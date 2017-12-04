import {Piece, PieceForm, PieceColor, PieceMood} from "./Piece";
import {RuleSpec, Rule} from "./Rule";

export interface BoardSpec {
    size: number
}

export class Board extends PIXI.Container {

    private boardWidth: number;
    private boardHeight: number;
    private pieces: Array<Piece>;
    private active: boolean;
    private dragging: boolean;
    private cell: PIXI.Point;
    private disposition: Array<Array<Piece>>;
    private selectedPiece: any;
    private rules: Array<Rule>;

    constructor(width: number = 10, height: number = 10) {
        super();
        this.boardWidth = width;
        this.boardHeight = height;
        this.pieces = [];
        this.position.set(50, 50);
        this.cell = new PIXI.Point(40, 40);
        this.active = true;
        this.dragging = false;
        this.disposition = [];
        this.rules = [];
    }

    update (delta: number) {
        let deltaMs = delta / 1000;
        for (let piece of this.pieces) {
            if (piece.draggable) {
                piece.update(deltaMs);
            }
        }
    }

    init(spec: BoardSpec) {
        this.initPieces(spec);
        this.initInteractivity();
        this.initRules(spec);
        this.checkRules();
    }

    private initPieces(spec: BoardSpec) {
        let forms = [
            PieceForm.SQUARE,
            PieceForm.CIRCLE,
            PieceForm.TRIANGLE,
            PieceForm.STAR
        ];
        let colors = [
            PieceColor.RED,
            PieceColor.GREEN,
            PieceColor.BLUE,
            PieceColor.WHITE,
            PieceColor.BLACK
        ];
        this.pieces = [];
        this.disposition = [];
        for (let i = 0; i < this.boardWidth; ++i) {
            this.disposition[i] = [];
            for (let j = 0; j < this.boardWidth; ++j) {
                this.disposition[i][j] = null;
            }
        }
        for (let i = 0; i < spec.size; ++i) {
            let form = forms[Math.floor(Math.random() * forms.length)];
            let color = colors[Math.floor(Math.random() * colors.length)];
            let piece = new Piece(this, form, color);
            let x = i % this.boardWidth;
            let y = Math.floor(i / this.boardWidth);
            piece.setPosition(x * this.cell.x, y * this.cell.y);
            piece.name = `piece-${i}`;
            this.pieces.push(piece);
            this.disposition[x][y] = piece;
            this.addChild(piece);
        }
    }

    private initInteractivity() {
        this.on('pointerdown', this.dragstart, this)
            .on('pointerup', this.dragend, this)
            .on('pointermove', this.dragmove, this);
        this.interactive = true;
    }
    private initRules(spec: BoardSpec) {
        let ruleSpec: RuleSpec = {
            type: {
                color: PieceColor.RED,
                form: PieceForm.STAR
            }
        };
        let ruleSpec2: RuleSpec = {
            type: {
                color: PieceColor.GREEN
            },
            against: {
                color: PieceColor.BLUE
            }
        };
        this.rules.push(new Rule(ruleSpec));
        this.rules.push(new Rule(ruleSpec2));
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
}