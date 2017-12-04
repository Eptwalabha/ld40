import {Game} from "../core/Game";
export abstract class State {
    protected game: Game;

    public abstract init(data?: any): void;
    public abstract update(delta: number): void;
    public abstract render(): void;
    public abstract stop(): void;
    public abstract pauseState(): void;
    public abstract resumeState(): void;

    public setGame(game: Game) {
        this.game = game;
    }
}