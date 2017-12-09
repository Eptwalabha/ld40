export class Transition {

    private delta: PIXI.Point;
    private duration: number;
    private time: number;

    public active: boolean;
    public dX: number;
    public dY: number;

    public onEnd: () => void;
    private keepActive: boolean;

    constructor () {
        this.delta = new PIXI.Point();
        this.dX = 0;
        this.dY = 0;
        this.active = false;
        this.keepActive = false;
    }

    setup(dx: number, dy: number, duration: number, forward: boolean) {
        this.delta.set(dx, dy);
        this.duration = duration;
        this.time = 0;
        this.keepActive = forward;
    }

    public update(delta) {
        this.time += delta;
        if (this.time < this.duration) {
            let dx = Transition.easeOutQuad(this.time, this.delta.x, this.duration);
            let dy = Transition.easeOutQuad(this.time, this.delta.y, this.duration);
            this.dX = this.keepActive ? dx : this.delta.x - dx;
            this.dY = this.keepActive ? dy : this.delta.y - dy;
        } else {
            this.dX = this.keepActive ? this.delta.x : 0;
            this.dY = this.keepActive ? this.delta.y : 0;
            this.active = this.keepActive;
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
        this.active = false;
    }
}