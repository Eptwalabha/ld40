import {Board} from "./Board";

export class Piece extends PIXI.Container {

    private form: string;
    private color: number;
    private deltaValue: number;
    private board: Board;
    private sprite: PIXI.Sprite;
    private eyes: PIXI.Sprite;
    private blinkIn: number;

    public alphaFilter: PIXI.filters.AlphaFilter;
    public draggable: boolean;

    constructor(board: Board, form: string, color: number) {
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
    }

    public update(delta) {
        this.deltaValue += delta;
        this.blinkIn -= delta;
        this.rotation = Math.sin(this.deltaValue) / 5;
        this.blink();
    }

    private blink () {
        if (this.blinkIn < 0) {
            this.eyes.texture = PIXI.loader.resources["piece"].textures["eye.png"];
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
}