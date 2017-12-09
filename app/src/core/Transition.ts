export class Transition {

    private delta: PIXI.Point;
    public from: PIXI.Point;
    private duration: number;
    private time: number;
    private active: boolean;

    public dX: number;
    public dY: number;
    public onEnd: () => void;


    constructor () {
        this.delta = new PIXI.Point();
        this.from = new PIXI.Point();
        this.dX = 0;
        this.dY = 0;
        this.active = false;
    }

    superSetup(from: PIXI.Point, to: PIXI.Point, position: PIXI.Point, duration) {
        this.from.set(from.x - position.x, from.y - position.y);
        this.delta.x = to.x - from.x;
        this.delta.y = to.y - from.y;
        this.duration = duration;
        this.time = 0;
        this.active = true;
    }

    public update(delta) {
        if (!this.active) {
            return;
        }
        this.time += delta;
        if (this.time < this.duration) {
            this.dX = this.from.x + Transition.easeOutQuad(this.time, this.delta.x, this.duration);
            this.dY = this.from.y + Transition.easeOutQuad(this.time, this.delta.y, this.duration);
        } else {
            this.dX = this.from.x + this.delta.x;
            this.dY = this.from.y + this.delta.y;
            this.active = false;
            if (this.onEnd) {
                this.onEnd();
            }
        }
    }

    // http://gizma.com/easing/#quad3
    public static easeInOutQuad (time, start, change, duration) {
        time /= duration / 2;
        if (time < 1) {
            return change / 2 * time * time + start;
        }
        time--;
        return - change / 2 * (time * (time - 2) - 1) + start;
    }

    public static easeOutQuad (time, change, duration) {
        time /= duration;
        return change * time * time + duration;
    }

    reset() {
        this.dX = 0;
        this.dY = 0;
        this.from.set(0, 0);
        this.active = false;
    }
}