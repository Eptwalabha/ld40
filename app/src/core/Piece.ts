import {Board} from "./Board";
import {Transition} from "./Transition";

export enum PieceForm {
    SQUARE = 'square',
    CIRCLE = 'circle',
    TRIANGLE = 'triangle',
    STAR = 'star'
}

export enum PieceColor {
    RED = 0xff0000,
    GREEN = 0x00ff00,
    BLUE = 0x0000ff,
    WHITE = 0xffffff,
    BLACK = 0x888888,
}

export enum PieceMood {
    NEUTRAL,
    HAPPY,
    CHEERING,
    ANGRY
}

export interface PieceSpec {
    form: PieceForm,
    color: PieceColor,
    draggable?: boolean,
    position: PIXI.Point
}

export interface RandomPieceSpec {
    form?: PieceForm,
    color?: PieceColor,
    draggable?: boolean,
    amount: number
}

export class Piece extends PIXI.Container {

    public form: PieceForm;
    public color: PieceColor;
    private deltaValue: number;
    private board: Board;
    private sprite: PIXI.Sprite;
    private eyes: PIXI.Sprite;
    private blinkIn: number;
    private mood: PieceMood;
    private spec: PieceSpec;
    private origin: PIXI.Point;

    public alphaFilter: PIXI.filters.AlphaFilter;
    public draggable: boolean;
    public satisfy: boolean;
    private offset: PIXI.Point;
    private transition: Transition;

    constructor(board: Board, spec: PieceSpec) {
        super();
        this.form = spec.form;
        this.color = spec.color;
        this.board = board;
        this.x = spec.position.x * this.board.cell.x;
        this.y = spec.position.y * this.board.cell.y;
        this.origin = new PIXI.Point(this.x, this.y);
        this.draggable = spec.draggable === undefined ? true : spec.draggable;
        this.name = this.board.getId();
        this.spec = spec;
        this.offset = new PIXI.Point();
        this.transition = new Transition();

        this.deltaValue = Math.random() * 1000;
        this.buildPIXIContainer();
        this.alphaFilter = new PIXI.filters.AlphaFilter(1);
        this.filters = [this.alphaFilter];
        this.blinkIn = Math.random() * 19;
        this.satisfy = true;
        this.mood = PieceMood.NEUTRAL;
    }

    public update(delta) {
        this.deltaValue += delta;
        this.blinkIn -= delta;
        this.updateTransition(delta);
        this.updateRotation();
        this.updatePosition();
        this.blink();
    }

    private updateTransition(delta: number) {
        this.transition.update(delta);
    }

    private updateRotation() {
        if (this.mood === PieceMood.ANGRY) {
            this.rotation = Math.sin(this.deltaValue * 20) / 5;
            this.offset.set(0, 0);
        } else if (this.mood === PieceMood.HAPPY) {
            this.rotation = Math.sin(this.deltaValue * 5) / 5;
            this.offset.set(0, 0);
        } else if (this.mood === PieceMood.CHEERING) {
            let sin = Math.sin(this.deltaValue * 10);
            this.rotation = sin / 5;
            this.offset.y = -Math.abs(sin * (this.board.cell.y / 2));
        } else {
            this.rotation = 0;
            this.offset.set(0, 0);
        }
    }

    private updatePosition() {
        this.x = this.origin.x + this.offset.x + this.transition.dX;
        this.y = this.origin.y + this.offset.y + this.transition.dY;
    }

    private blink () {
        if (this.mood !== PieceMood.CHEERING && this.mood !== PieceMood.HAPPY) {
            if (this.blinkIn < 0) {
                this.eyes.texture = PIXI.loader.resources["piece"].textures[this.eyeType()];
                this.blinkIn = Math.random() * 10;
            } else if (this.blinkIn < .1) {
                this.eyes.texture = PIXI.loader.resources["piece"].textures["eye-blink.png"];
            }
        }
    }

    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.origin.set(this.x, this.y);
        this.transition.reset();
    }

    private buildPIXIContainer() {
        let atlas = PIXI.loader.resources["piece"];
        this.sprite = new PIXI.Sprite(atlas.textures[`form-${this.form}.png`]);
        this.sprite.tint = this.color;
        this.sprite.anchor.set(0.5);
        this.mood = PieceMood.NEUTRAL;
        this.eyes = new PIXI.Sprite(atlas.textures[this.eyeType()]);
        this.eyes.anchor.set(0.5);
        this.eyes.scale.set(0.8);
        this.eyes.position.set(0, this.sprite.height / -3);
        this.addChild(this.sprite, this.eyes);
    }

    public setMood(mood: PieceMood = PieceMood.NEUTRAL, force: boolean = false) {
        if (force) {
            this.mood = mood;
        } else {
            if (mood === PieceMood.ANGRY) {
                this.mood = mood;
            } else {
                this.mood = (this.mood === PieceMood.NEUTRAL) ? mood : this.mood;
            }
        }
        this.updateMoodPiece();
    }

    private updateMoodPiece() {
        let texture: string = this.eyeType();
        this.eyes.texture = PIXI.loader.resources["piece"].textures[texture];
    }

    private eyeType() {
        if (this.mood === PieceMood.ANGRY) return "eye-angry.png";
        if (this.mood === PieceMood.HAPPY || this.mood === PieceMood.CHEERING) return "eye-happy.png";
        return "eye-regular.png";
    }

    cheering(allRules: boolean): boolean {
        if (allRules || this.mood === PieceMood.HAPPY) {
            this.setMood(PieceMood.CHEERING, true);
            return true;
        }
        return this.mood === PieceMood.CHEERING;
    }

    transitionTo(x: number, y: number, duration: number) {
        this.transition.superSetup(
            new PIXI.Point(this.x, this.y),
            new PIXI.Point(x, y),
            this.origin,
            duration
        );
    }
}