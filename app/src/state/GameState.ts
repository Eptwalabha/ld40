import {State} from "./State";
import {Board} from "../core/Board";
import {levels, LevelSpec} from "../Levels";

export class GameState extends State {

    private stage: PIXI.Container;
    private board: Board;

    init(app: PIXI.Application): void {
        this.stage = new PIXI.Container();
        this.game.app.stage = this.stage;
        this.initScene();
        this.initLevel(levels[1]);
        this.centerBoard(app.view);
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

    private initLevel(levelSpec: LevelSpec) {
        this.board = new Board(levelSpec);
        this.stage.addChild(this.board);
    }

    private centerBoard(view: HTMLCanvasElement) {
        let diffX = (view.width - this.board.boardWidth * this.board.cell.x) / 2;
        let diffY = (view.height - this.board.boardHeight * this.board.cell.y) / 2;
        this.board.position.x = diffX + 16;
        this.board.position.y = diffY + 16;
    }
}