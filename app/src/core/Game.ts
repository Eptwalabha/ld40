import {State} from "../state/State";

export class Game {

    public current: State;
    private states: {
        [id: string]: State
    };
    public app: PIXI.Application;
    private pause: boolean;

    constructor(app: PIXI.Application) {
        this.states = {};
        this.app = app;
    }

    public start() {
        this.current.init(this.app);
        this.pause = false;
    }

    public addState(stateName: string, state: State, start: boolean = false): void {
        state.setGame(this);
        this.states[stateName] = state;
        if (start) {
            this.current = state;
        }
    }

    public changeState(newState: string) {
        let state: State = this.states[newState];
        if (this.current) {
            this.current.stop();
        }
        this.current = state;
        this.current.init(this.app);
    }

    public pauseGame() {
        this.current.pauseState();
        this.pause = true;
    }

    public resumeGame() {
        this.current.resumeState();
        this.pause = false;
    }

    public update(delta) {
        if (!this.pause) {
            this.current.update(delta);
        }
        this.current.render();
    }
}