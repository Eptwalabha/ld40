import {Piece, PieceForm, PieceColor, PieceMood} from "./Piece";
import {RuleFactory} from "./RuleFactory";
import {Board} from "./Board";

export enum RulePieceType {
    EMPTY,
    MATCHING,
    OTHER,
    AGAINST
}

export enum RuleType {
    SURROUNDED,
    NONE,
    NEIGHBOURS,
    GROUP
}

export enum RuleAgainst {
    SAME,
    AGAINST
}

export interface RuleRange {
    min?: number,
    max?: number
}

export interface RuleTypeSpec {
    type: RuleType,
    against?: RuleAgainst,
    amount?: number,
    range?: RuleRange
}

export interface RuleSpec {
    type: PieceType,
    against?: PieceType,
    rule: RuleTypeSpec
}

export interface PieceType {
    form?: PieceForm,
    color?: PieceColor
}

export class Rule extends PIXI.Container {

    private isPieceAffected: (piece: Piece) => boolean;
    private isPieceAgainst: (piece: Piece) => boolean;
    private validator: (x: number, y: number, disposition: Array<Array<RulePieceType>>) => boolean;
    private disposition: Array<Array<RulePieceType>>;

    public valid: boolean;
    public active: boolean;
    private spec: RuleSpec;

    private backCard: PIXI.Sprite;
    private frontCard: PIXI.Sprite;
    private imageContainer: PIXI.Container;
    private textContainer: PIXI.Container;

    public constructor (spec: RuleSpec) {
        super();
        this.valid = false;
        this.spec = spec;
        this.isPieceAffected = this.buildPieceMatcher(spec.type, false);
        this.isPieceAgainst = this.buildPieceMatcher(spec.against, true);
        this.validator = Rule.buildValidator(spec.rule);
        this.buildContainer();
        this.active = false;
    }

    private static buildValidator(spec: RuleTypeSpec): (x: number, y: number, disposition: Array<Array<RulePieceType>>) => boolean {
        switch (spec.type) {
            case RuleType.NONE:
                return RuleFactory.get_none(spec.against);
            case RuleType.NEIGHBOURS:
                return RuleFactory.get_neighbours(spec.against, spec.amount);
            case RuleType.SURROUNDED:
                return RuleFactory.get_surrounded(spec.against);
            case RuleType.GROUP:
                return RuleFactory.get_group(spec.range);
        }
        return function() {
            return false;
        }
    }

    private buildPieceMatcher(type: PieceType, matchAll: boolean): (piece: Piece) => boolean {
        if (type === undefined) {
            return function () {
                return false;
            }
        }
        if (type.color === undefined && type.form !== undefined) {
            return function (piece: Piece) {
                return piece.form === type.form;
            }
        }
        if (type.color !== undefined && type.form === undefined) {
            return function (piece: Piece) {
                return piece.color === type.color;
            }
        }
        if (type.color !== undefined && type.form !== undefined) {
            return function (piece: Piece) {
                return piece.form === type.form && piece.color === type.color;
            }
        }
        return function () {
            return matchAll;
        }
    }

    public checkDispositionAgainstRule(disposition: Array<Array<Piece>>): boolean {
        this.updateDisposition(disposition);
        this.valid = this.checkValidity(disposition);
        return this.valid;
    }

    private updateDisposition(disposition: Array<Array<Piece>>) {
        this.disposition = [];
        for (let x = 0; x < disposition.length; ++x) {
            this.disposition[x] = [];
            for (let y = 0; y < disposition[x].length; ++y) {
                let p = disposition[x][y];
                if (p === null) {
                    this.disposition[x][y] = RulePieceType.EMPTY;
                } else {
                    if (this.isPieceAffected(p)) {
                        this.disposition[x][y] = RulePieceType.MATCHING;
                    } else {
                        this.disposition[x][y] = this.isPieceAgainst(p) ? RulePieceType.AGAINST : RulePieceType.OTHER;
                    }
                }
            }
        }
    }

    private checkValidity(disposition: Array<Array<Piece>>) {
        let valid: boolean = true;
        for (let x = 0; x < this.disposition.length; ++x) {
            for (let y = 0; y < this.disposition.length; ++y) {
                if (this.disposition[x][y] !== RulePieceType.MATCHING) continue;
                let p = disposition[x][y];
                if (this.validator(x, y, this.disposition)) {
                    p.setMood(PieceMood.HAPPY);
                } else {
                    p.setMood(PieceMood.ANGRY);
                    valid = false;
                }
            }
        }
        return valid;
    }

    setActive(active: boolean, board: Board) {
        if (active) {
            this.backCard.tint = 0xaaffaa;
            let style = new PIXI.TextStyle({
                fontSize: 32,
                fill: 0xffffff,
                fontWeight: 'bold',
                align: 'center'
            });
            let clickMe = new PIXI.Text("CLICK ME", style);
            clickMe.anchor.set(0.5);
            clickMe.scale.set(0.25);
            clickMe.position.set(this.frontCard.width / 5, this.frontCard.height / 5);
            let self = this;
            this.backCard.addChild(clickMe);
            this.backCard.interactive = true;
            this.backCard.on('pointerdown', function () {
                self.active = true;
                board.activateRule();
                self.backCard.interactive = false;
                self.backCard.on('pointerdown', null);
                self.removeChild(self.backCard)
            });
        }
    }

    private buildContainer() {
        let atlas = PIXI.loader.resources["rule"];
        this.frontCard = new PIXI.Sprite(atlas.textures["card-front.png"]);
        this.backCard = new PIXI.Sprite(atlas.textures["card-back.png"]);
        this.frontCard.scale.set(2.5);
        this.backCard.scale.set(2.5);
        this.imageContainer = new PIXI.Container();
        this.textContainer = new PIXI.Container();
        let style = new PIXI.TextStyle({
            fontSize: 20,
            fontWeight: 'bold',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 120
        });
        let text = new PIXI.Text(this.textRule(), style);
        text.anchor.set(0.5);
        text.scale.set(0.25);
        text.position.set(this.frontCard.width / 5, this.frontCard.height / 5);
        this.frontCard.addChild(this.imageContainer);
        this.frontCard.addChild(text);
        this.addChild(this.frontCard);
        this.addChild(this.backCard);
    }

    public textRule() {
        let matching: string = Rule.getSpecDescription(this.spec.type, true);
        let action: string = this.getActionDescription(this.spec);
        return `${matching}\n${action}`;
    }

    private static getSpecDescription(type: PieceType, all: boolean = false) {
        if (type.color === undefined && type.form === undefined) {
            return `${all? 'all ': ''}pieces`;
        }
        if (type.color !== undefined && type.form === undefined) {
            return `${all? 'all ': ''}${Rule.getColorName(type.color)}`;
        }
        if (type.color === undefined && type.form !== undefined) {
            return `${all? 'all ': ''}${type.form}`;
        }
        if (type.color !== undefined && type.form !== undefined) {
            return `${all? 'all ': ''}${Rule.getColorName(type.color)} ${type.form}`;
        }
    }

    private static getColorName(color: PieceColor): string {
        switch (color) {
            case PieceColor.BLACK: return "black";
            case PieceColor.WHITE: return "white";
            case PieceColor.RED: return "red";
            case PieceColor.GREEN: return "green";
            case PieceColor.BLUE: return "blue";
        }
        return "???";
    }

    private getActionDescription(spec: RuleSpec) {
        switch (spec.rule.type) {
            case RuleType.SURROUNDED:
                return "must be surrounded by";
            case RuleType.NONE:
                let against = Rule.getAgainstDescription(spec);
                return `should not be surrounded by any ${against}`;
            case RuleType.GROUP:
                return `should be in a group ${Rule.getRangeDescription(spec.rule.range, spec.type)}`;
            case RuleType.NEIGHBOURS:
                let against = Rule.getAgainstDescription(spec);
                return `should have ${spec.rule.amount === undefined ? 8 : spec.rule.amount} ${against} as neighbours.`;
        }
        return "It's a bug!";
    }

    private static getRangeDescription(range: RuleRange, type: PieceType) {
        if (range.max !== undefined && range.min !== undefined) {
            return `of ${range.min} to ${range.max} ${Rule.getSpecDescription(type)}`;
        }
        if (range.max !== undefined && range.min === undefined) {
            return `of ${range.max} ${Rule.getSpecDescription(type)} maximum`;
        }
        if (range.max === undefined && range.min !== undefined) {
            return `of ${range.min} ${Rule.getSpecDescription(type)} minimum`;
        }
        return `of 3 ${Rule.getSpecDescription(type)} minimum`
    }

    private static getAgainstDescription(spec: RuleSpec) {
        if (spec.rule.against === RuleAgainst.SAME) {
            return Rule.getSpecDescription(spec.type);
        }
        return Rule.getSpecDescription(spec.against);
    }
}