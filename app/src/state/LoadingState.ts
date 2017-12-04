import {State} from "./State";

export class LoadingState extends State {

    init(data?: any): void {
        console.log("init loading state");
        this.game.changeState("game");
    }

    update(delta: number): void {
    }

    render(): void {
    }

    stop(): void {
        console.log("stop loading state");
    }

    pauseState(): void {
    }

    resumeState(): void {
    }

}