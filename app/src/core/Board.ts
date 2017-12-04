import {Piece, PieceMood, PieceSpec, RandomPieceSpec} from "./Piece";
import {RuleSpec, Rule} from "./Rule";
import {LevelSpec, PiecesSpec} from "../Levels";
import {PieceFactory} from "./PieceFactory";

export class Board extends PIXI.Container {

    boardWidth: number;
    boardHeight: number;
    private pieces: Array<Piece>;
    private dragging: boolean;
    public cell: PIXI.Point;
    private disposition: Array<Array<Piece>>;
    private selectedPiece: any;
    private rules: Array<Rule>;
    private id: number;
    private backgroundContainer: PIXI.Container;
    private boardContainer: PIXI.Container;
    private piecesContainer: PIXI.Container;
    private movingPieceContainer: PIXI.Container;

    constructor(level: LevelSpec) {
        super();
        this.boardWidth = level.boardDimension.x;
        this.boardHeight = level.boardDimension.y;

        this.cell = new PIXI.Point(40, 40);
        this.dragging = false;

        this.createContainers();
        this.initPieces(level.pieces);
        this.initInteractivity();
        this.initBoardContainer();
        this.initRules(level.rules);
        this.checkRules();
    }

    update (delta: number) {
        let deltaMs = delta / 1000;
        for (let piece of this.pieces) {
            piece.update(deltaMs);
        }
    }

    private initPieces(spec: PiecesSpec) {
        this.id = 0;
        this.resetDisposition();
        this.initPlacedPieces(spec.placed);
        this.initRandomPieces(spec.random);
    }

    private resetDisposition() {
        this.pieces = [];
        this.disposition = [];
        for (let i = 0; i < this.boardWidth; ++i) {
            this.disposition[i] = [];
            for (let j = 0; j < this.boardHeight; ++j) {
                this.disposition[i][j] = null;
            }
        }
    }

    private initPlacedPieces(spec: Array<PieceSpec>) {
        for (let pieceSpec of spec) {
            let piece: Piece = new Piece(this, pieceSpec);
            this.disposition[pieceSpec.position.x][pieceSpec.position.y] = piece;
            this.pieces.push(piece);
            this.addChild(piece);
        }
    }

    public getId () {
        return `piece-${++this.id}`;
    }

    private initRandomPieces(specs: Array<RandomPieceSpec>) {
        for (let randomSpec of specs) {
            let amount = randomSpec.amount;
            for (let i = 0; i < amount; ++i) {
                let freePosition = this.getFreePosition();
                if (freePosition === null) {
                    return;
                }
                let piece: Piece = PieceFactory.buildFromRandomSpec(this, randomSpec);
                piece.setPosition(freePosition.x * this.cell.x, freePosition.y * this.cell.y);
                this.disposition[freePosition.x][freePosition.y] = piece;
                this.pieces.push(piece);
                this.piecesContainer.addChild(piece);
            }
        }
    }

    private initInteractivity() {
        this.on('pointerdown', this.dragstart, this)
            .on('pointerup', this.dragend, this)
            .on('pointermove', this.dragmove, this);
        this.interactive = true;
    }
    private initRules(rules: Array<RuleSpec>) {
        this.rules = [];
        for (let rule of rules) {
            this.rules.push(new Rule(rule));
        }
        // let ruleSpec: RuleSpec = {
        //     type: {
        //         color: PieceColor.RED
        //     },
        //     rule: {
        //         type: RuleType.GROUP,
        //         range: {
        //             min: 3
        //         }
        //     }
        // };
        // let ruleSpec2: RuleSpec = {
        //     type: {
        //         color: PieceColor.GREEN
        //     },
        //     rule: {
        //         type: RuleType.NONE
        //     },
        //     against: {
        //         color: PieceColor.BLUE
        //     }
        // };
        // this.rules.push(new Rule(ruleSpec));
        // this.rules.push(new Rule(ruleSpec2));
    }

    private dragstart(event) {
        if (!this.dragging) {
            let position = event.data.getLocalPosition(this);
            let boardPosition: PIXI.Point = this.positionToBoard(position.x, position.y);
            let piece = this.getPieceAt(boardPosition.x, boardPosition.y);
            if (piece === null || !piece.draggable) {
                return;
            }
            this.selectedPiece = {
                piece: piece,
                origin: boardPosition
            };
            this.dragging = true;
        }
    }

    private positionToBoard(x: number, y: number, bound: boolean = false): PIXI.Point {
        let x2 = Math.floor((x + this.cell.x / 2) / this.cell.x);
        let y2 = Math.floor((y + this.cell.y / 2) / this.cell.y);
        if (bound) {
            if (x2 < 0) x2 = 0;
            if (x2 >= this.boardWidth) x2 = this.boardWidth - 1;
            if (y2 < 0) y2 = 0;
            if (y2 >= this.boardHeight) y2 = this.boardHeight - 1;
        }
        return new PIXI.Point(x2, y2);
    }

    private getPieceAtPosition(x: number, y: number): Piece {
        let boardPosition: PIXI.Point = this.positionToBoard(x, y);
        if (boardPosition.x < 0 || boardPosition.x >= this.boardWidth ||
            boardPosition.y < 0 || boardPosition.y >= this.boardHeight) {
            return null;
        }
        return this.getPieceAt(boardPosition.x, boardPosition.y);
    }

    private getPieceAt(x: number, y: number): Piece {
        return this.disposition[x][y];
    }

    private dragend(event) {
        if (this.dragging) {
            this.dragging = false;
            let position = event.data.getLocalPosition(this);
            let boardPosition: PIXI.Point = this.positionToBoard(position.x, position.y, true);
            let piece = this.getPieceAt(boardPosition.x, boardPosition.y);
            if (piece === null) {
                let x = boardPosition.x * this.cell.x;
                let y = boardPosition.y * this.cell.y;
                this.selectedPiece.piece.setPosition(x, y);
                this.disposition[boardPosition.x][boardPosition.y] = this.selectedPiece.piece;
                this.disposition[this.selectedPiece.origin.x][this.selectedPiece.origin.y] = null;
            } else if (piece.draggable) {
                if (this.selectedPiece.piece.name === piece.name) return;
                let x = boardPosition.x * this.cell.x;
                let y = boardPosition.y * this.cell.y;
                this.selectedPiece.piece.setPosition(x, y);
                this.disposition[boardPosition.x][boardPosition.y] = this.selectedPiece.piece;
                let x = this.selectedPiece.origin.x * this.cell.x;
                let y = this.selectedPiece.origin.y * this.cell.y;
                piece.setPosition(x, y);
                this.disposition[this.selectedPiece.origin.x][this.selectedPiece.origin.y] = piece;
            } else {
                let x = this.selectedPiece.origin.x * this.cell.x;
                let y = this.selectedPiece.origin.y * this.cell.y;
                this.selectedPiece.piece.setPosition(x, y);
            }
            this.checkRules();
        }
    }

    private dragmove(event) {
        if (this.dragging) {
            let position = event.data.getLocalPosition(this);
            let boardPosition: PIXI.Point = this.positionToBoard(position.x, position.y, true);
            this.selectedPiece.piece.setPosition(boardPosition.x * this.cell.x, boardPosition.y * this.cell.y);
        }
    }

    private checkRules() {
        this.resetAllPiecesMood();
        for (let rule of this.rules) {
            rule.checkDispositionAgainstRule(this.disposition);
        }
    }

    private resetAllPiecesMood() {
        for (let x = 0; x < this.disposition.length; ++x) {
            for (let y = 0; y < this.disposition[x].length; ++y) {
                let p = this.disposition[x][y];
                if (p === null) continue;
                p.setMood(PieceMood.NEUTRAL, true);
            }
        }
    }

    private getFreePosition(): PIXI.Point {
        let freeIndex = [];
        for (let x = 0; x < this.disposition.length; ++x) {
            for (let y = 0; y < this.disposition[x].length; ++y) {
                if (this.disposition[x][y] === null) {
                    freeIndex.push(new PIXI.Point(x, y));
                }
            }
        }
        if (freeIndex.length === 0) {
            return null;
        }
        return freeIndex[Math.floor(Math.random() * freeIndex.length)];
    }

    private createContainers() {
        this.backgroundContainer = new PIXI.Container();
        this.boardContainer = new PIXI.Container();
        this.piecesContainer = new PIXI.Container();
        this.movingPieceContainer = new PIXI.Container();
        this.addChild(this.backgroundContainer, this.boardContainer, this.piecesContainer, this.movingPieceContainer);
    }

    private initBoardContainer() {
        let atlas = PIXI.loader.resources["board"];
        for (let x = 0; x < this.disposition.length; ++x) {
            for (let y = 0; y < this.disposition[x].length; ++y) {
                let tile: PIXI.Sprite = new PIXI.Sprite(atlas.textures[Board.tileName(this.disposition[x][y])]);
                tile.anchor.set(0.5);
                let scaleX = this.cell.x / tile.width;
                let scaleY = this.cell.y / tile.height;
                tile.position.set(x * this.cell.x, y * this.cell.y);
                tile.scale.set(scaleX, scaleY);
                this.boardContainer.addChild(tile);
            }
        }
    }

    private static tileName(piece: Piece): string {
        let prefix = (piece === null || piece.draggable) ? "regular" : "static";
        let num = Math.floor(Math.random() * 4);
        return `tile-${prefix}-${num}.png`;
    }
}