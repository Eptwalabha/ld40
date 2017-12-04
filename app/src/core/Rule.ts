import {Piece, PieceForm, PieceColor, PieceMood} from "./Piece";
import {RuleFactory} from "./RuleFactory";

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

export class Rule {

    private isPieceAffected: (piece: Piece) => boolean;
    private isPieceAgainst: (piece: Piece) => boolean;
    private validator: (x: number, y: number, disposition: Array<Array<RulePieceType>>) => boolean;
    private valid: boolean;
    private disposition: Array<Array<RulePieceType>>;

    public constructor (spec: RuleSpec) {
        this.valid = false;
        this.isPieceAffected = this.buildPieceMatcher(spec.type, false);
        this.isPieceAgainst = this.buildPieceMatcher(spec.against, true);
        this.validator = this.buildValidator(spec.rule);
    }

    private buildValidator(spec: RuleTypeSpec): (x: number, y: number, disposition: Array<Array<RulePieceType>>) => boolean {
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
                    p.setMood(PieceMood.FRIENDLY);
                } else {
                    p.setMood(PieceMood.ANGRY);
                    valid = false;
                }
            }
        }
        return valid;
    }
}