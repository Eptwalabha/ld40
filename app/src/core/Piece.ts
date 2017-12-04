import {Board} from "./Board";

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
    FRIENDLY,
    ANGRY
}

export class Piece extends PIXI.Container {

    public form: PieceForm;
    public color: PieceColor;
    private deltaValue: number;
    private board: Board;
    private sprite: PIXI.Sprite;
    private eyes: PIXI.Sprite;
    private blinkIn: number;
    private tint: number;
    private mood: PieceMood;

    public alphaFilter: PIXI.filters.AlphaFilter;
    public draggable: boolean;
    public satisfy: boolean;

    constructor(board: Board, form: PieceForm, color: PieceColor) {
        super();
        this.form = form;
        this.color = color;
        this.x = 0;
        this.y = 0;
        this.deltaValue = Math.random() * 1000;
        this.board = board;
        this.buildPIXIContainer();
        this.alphaFilter = new PIXI.filters.AlphaFilter(1);
        this.filters = [this.alphaFilter];
        this.blinkIn = Math.random() * 19;
        this.satisfy = true;
        this.draggable = true;
        this.mood = PieceMood.NEUTRAL;
    }

    public update(delta) {
        this.deltaValue += delta;
        this.blinkIn -= delta;
        if (this.mood === PieceMood.ANGRY) {
            this.rotation = Math.sin(this.deltaValue * 20) / 5;
        }
        this.blink();
    }

    private blink () {
        if (this.blinkIn < 0) {
            this.eyes.texture = PIXI.loader.resources["piece"].textures[this.eyeType()];
            this.blinkIn = Math.random() * 10;
        } else if (this.blinkIn < .1) {
            this.eyes.texture = PIXI.loader.resources["piece"].textures["eye-blink.png"];
        }
    }

    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public isAt(x: number, y: number): boolean {
        return this.x === x && this.y === y;
    }

    private buildPIXIContainer() {
        let atlas: PIXI.loaders.TextureDictionary = PIXI.loader.resources["piece"].textures;
        this.sprite = new PIXI.Sprite(atlas[`form-${this.form}.png`]);
        this.sprite.tint = this.color;
        this.sprite.anchor.set(0.5);
        this.eyes = new PIXI.Sprite(atlas[`eye.png`]);
        this.eyes.anchor.set(0.5);
        this.eyes.scale.set(0.8);
        this.eyes.position.set(0, this.sprite.height / -3);
        this.addChild(this.sprite, this.eyes);
    }

    public changeTint (tint?: number) {
        if (tint === undefined) {
            this.sprite.tint = this.color;
        } else {
            this.tint = tint;
            this.sprite.tint = tint;
        }
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
        switch (this.mood) {
            case PieceMood.ANGRY:
                this.eyes.texture = PIXI.loader.resources["piece"].textures["eye-angry.png"];
                break;
            default:
                this.eyes.texture = PIXI.loader.resources["piece"].textures["eye.png"];
                break;
        }
    }

    private eyeType() {
        if (this.mood === PieceMood.ANGRY) return "eye-angry.png";
        return "eye.png";
    }
}