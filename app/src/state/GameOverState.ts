import {State} from "./State";

export class GameOverState extends State {

    init(data?: any): void {
        this.game.changeState("game");
    }

    update(delta: number): void {
    }

    render(): void {
    }

    stop(): void {
    }

    pauseState(): void {
    }

    resumeState(): void {
    }

}