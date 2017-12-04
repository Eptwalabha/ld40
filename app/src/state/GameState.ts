import {State} from "./State";
import {Board} from "../core/Board";
import {levels, LevelSpec} from "../Levels";
import {PieceForm, PieceColor} from "../core/Piece";
import {RuleType, RuleAgainst} from "../core/Rule";

export class GameState extends State {

    private stage: PIXI.Container;
    private board: Board;
    private currentLevel: number;

    init(app: PIXI.Application): void {
        this.stage = new PIXI.Container();
        this.game.app.stage = this.stage;
        this.currentLevel = 0;
        this.initScene();
        this.nextLevel();
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

    private centerBoard(view: HTMLCanvasElement) {
        let diffX = (view.width - this.board.boardWidth * this.board.cell.x) / 2;
        let diffY = (view.height - this.board.boardHeight * this.board.cell.y) / 2;
        this.board.position.x = diffX + 16;
        this.board.position.y = diffY + 16;
    }

    nextLevel() {
        let levelSpec: LevelSpec = this.getLevelSpec();
        this.board = new Board(this, levelSpec);
        this.stage.addChild(this.board);
        this.centerBoard(this.game.app.view);
    }

    private getLevelSpec(): LevelSpec {
        let spec: LevelSpec = (this.currentLevel < levels.length) ? levels[this.currentLevel] : this.makeRandomSpec();
        this.currentLevel++;
        return spec;
    }

    private makeRandomSpec(): LevelSpec {
        return {
            name: "this is a random level (it might not work…)",
            pieces: {
                placed: [],
                random: [
                    {
                        amount: 50
                    }
                ]
            },
            rules: [
                {
                    type: {
                        color: PieceColor.RED,
                        form: PieceForm.CIRCLE
                    },
                    rule: {
                        type: RuleType.NEIGHBOURS,
                        against: RuleAgainst.AGAINST,
                        amount: 5
                    },
                    against: {
                        color: PieceColor.RED,
                        form: PieceForm.SQUARE
                    }
                },
                {
                    type: {
                        color: PieceColor.BLUE,
                        form: PieceForm.CIRCLE
                    },
                    rule: {
                        type: RuleType.NEIGHBOURS,
                        against: RuleAgainst.AGAINST,
                        amount: 2
                    },
                    against: {
                        color: PieceColor.RED,
                        form: PieceForm.SQUARE
                    }
                }
            ],
            boardDimension: new PIXI.Point(10, 10)
        };
    }
}