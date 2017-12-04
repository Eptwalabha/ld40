import {State} from "./State";
import {Board, BoardSpec} from "../core/Board";

export class GameState extends State {

    private stage: PIXI.Container;
    private board: Board;

    init(app: PIXI.Application): void {
        this.stage = new PIXI.Container();
        this.game.app.stage = this.stage;
        this.initScene();
        this.initLevel();
    }

    update(delta: number): void {
        this.board.update(delta);
    }

    render(): void {
        this.game.app.render();
    }

    stop(): void {
    }

    pauseState(): void {
    }

    resumeState(): void {
    }

    private initScene() {
    }

    private initLevel() {
        this.board = new Board(10, 10);
        let spec: BoardSpec = {
            size: 45
        };
        this.board.init(spec);
        this.stage.addChild(this.board);
    }

}