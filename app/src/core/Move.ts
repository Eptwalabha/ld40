export class Move {

    private x1: number;
    private y1: number;
    private x2: number;
    private y2: number;
    private duration: number;
    private delta: number;
    private element: PIXI.DisplayObject;
    private callback: () => void;

    constructor (element: PIXI.DisplayObject, x, y, duration, callback?: () => void) {
        this.x1 = element.x;
        this.y1 = element.y;
        this.x2 = x;
        this.y2 = y;
        this.duration = duration;
        this.delta = 0;
        this.element = element;
        this.callback = callback;
    }

    public update(delta) {
        this.delta += delta;
        if (this.delta >= this.duration) {
            this.delta = this.duration;
            this.element.position.set(this.x2, this.y2);
            if (this.callback) {
                this.callback();
            }
        } else {
            this.element.x = Move.easeInOutQuad(this.delta, this.x1, this.x2 - this.x1, this.duration);
            this.element.y = Move.easeInOutQuad(this.delta, this.y1, this.y2 - this.y1, this.duration);
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
}