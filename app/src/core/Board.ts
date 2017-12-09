import {Piece, PieceMood, PieceSpec, RandomPieceSpec} from "./Piece";
import {RuleSpec, Rule} from "./Rule";
import {LevelSpec, PiecesSpec} from "../Levels";
import {PieceFactory} from "./PieceFactory";
import {GameState} from "../state/GameState";

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
    private rulesContainer: PIXI.Container;
    private transition: number;
    private gameState: GameState;
    private levelTitle: PIXI.Text;
    private hover: PIXI.Point;
    private hoveredPiece: Piece;

    constructor(gameState: GameState, level: LevelSpec) {
        super();
        this.gameState = gameState;
        this.boardWidth = level.boardDimension.x;
        this.boardHeight = level.boardDimension.y;

        this.cell = new PIXI.Point(40, 40);
        this.dragging = false;
        this.hover = new PIXI.Point(-1, -1);

        this.createContainers();
        this.initTitle(level.name);
        this.initPieces(level.pieces);
        this.initInteractivity();
        this.initBoardContainer();
        this.initRules(level.rules);
        this.initRulesContainer();
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
        this.sortZIndex();
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
            this.piecesContainer.addChild(piece);
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
    }

    private initRules(rules: Array<RuleSpec>) {
        this.rules = [];
        for (let rule of rules) {
            this.rules.push(new Rule(rule));
        }
        this.interactive = false;
        this.rules[0].setActive(true, this);
    }

    private dragstart(event) {
        if (!this.dragging) {
            let position = event.data.getLocalPosition(this.piecesContainer);
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
            this.hoveredPiece = null;
            this.sortZIndex();
        }
    }

    private dragend(event) {
        if (this.dragging) {
            this.dragging = false;
            let position = event.data.getLocalPosition(this.piecesContainer);
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
            this.hoveredPiece = null;
            this.sortZIndex();
            this.checkRules();
        }
    }

    private dragmove(event) {
        if (this.dragging) {
            let position = event.data.getLocalPosition(this.piecesContainer);
            let boardPosition: PIXI.Point = this.positionToBoard(position.x, position.y, true);
            if (boardPosition.x !== this.hover.x || boardPosition.y !== this.hover.y) {
                let previouslyHoveredPiece: Piece = this.getPieceAt(this.hover.x, this.hover.y);
                if (Board.canPieceBeSwapped(previouslyHoveredPiece, this.selectedPiece.piece)) {
                    let x = this.hover.x * this.cell.x;
                    let y = this.hover.y * this.cell.y;
                    previouslyHoveredPiece.transitionTo(x, y, .2);
                }
                let newlyHoveredPiece: Piece = this.getPieceAt(boardPosition.x, boardPosition.y);
                if (Board.canPieceBeSwapped(newlyHoveredPiece, this.selectedPiece.piece)) {
                    let x = this.selectedPiece.origin.x * this.cell.x;
                    let y = this.selectedPiece.origin.y * this.cell.y;
                    newlyHoveredPiece.transitionTo(x, y, .2);
                    this.hoveredPiece = newlyHoveredPiece;
                }
                this.hover.set(boardPosition.x, boardPosition.y);
                this.selectedPiece.piece.transitionTo(boardPosition.x * this.cell.x, boardPosition.y * this.cell.y, .1);
            }
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

    private getPieceAt(x: number, y: number): Piece {
        if (!this.withinBoard(x, y)) {
            return null;
        }
        return this.disposition[x][y];
    }

    private checkRules() {
        this.resetAllPiecesMood();
        let allRulesValid = true;
        for (let rule of this.rules) {
            if (rule.active) {
                if (!rule.checkDispositionAgainstRule(this.disposition)) {
                    allRulesValid = false;
                }
            }
        }
        if (allRulesValid) {
            this.allActiveRulesValid();
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
        this.rulesContainer = new PIXI.Container();
        this.addChild(
            this.backgroundContainer,
            this.boardContainer,
            this.piecesContainer,
            this.rulesContainer
        );
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
        this.centerBoard();
    }

    private centerBoard() {
        let diffX = ((this.gameState.getWidth() - 200) - this.boardContainer.width) / 2 + 200;
        let diffY = (this.gameState.getHeight() - this.boardContainer.height) / 2 + 10;
        this.boardContainer.position.set(diffX + 16, diffY + 16);
        this.piecesContainer.position.set(diffX + 16, diffY + 16);
        this.levelTitle.position.set(400, 10);
    }

    private initRulesContainer() {
        for (let i = 0; i < this.rules.length; ++i) {
            this.rules[i].position.set(0, i * (this.rules[i].height + 5));
            this.rulesContainer.addChild(this.rules[i]);
        }
        let offsetX = (200 - this.rulesContainer.width) / 2;
        let offsetY = (this.gameState.getHeight() - this.rulesContainer.height) / 2;
        this.rulesContainer.position.set(offsetX, offsetY);
    }

    private static tileName(piece: Piece): string {
        let prefix = (piece === null || piece.draggable) ? "regular" : "static";
        let num = Math.floor(Math.random() * 4);
        return `tile-${prefix}-${num}.png`;
    }


    private allActiveRulesValid() {
        let allRules = true;
        this.interactive = false;
        for (let rule of this.rules) {
            if (rule.active === false) {
                rule.setActive(true, this);
                allRules = false;
                break;
            }
        }

        this.cheerPieces(allRules);

        if (allRules) {
            let self = this;
            window.setTimeout(function () {
                self.gameState.nextLevel();
            }, 2000);
        }
    }

    public activateRule () {
        this.interactive = true;
        this.checkRules();
    }

    private initTitle(title: string) {
        let style = new PIXI.TextStyle({
            fontSize: 24,
            fontWeight: 'bold',
            align: 'center'
        });
        this.levelTitle = new PIXI.Text(title, style);
        this.levelTitle.anchor.set(0.5, 0);
        this.addChild(this.levelTitle);
    }

    private cheerPieces(allRulesSatisfied: boolean) {
        let atLeastOneCheering = false;
        for (let piece of this.pieces) {
            if (piece.cheering(allRulesSatisfied)) {
                atLeastOneCheering = true;
            }
            this.transition = 2000;
        }

        if (!atLeastOneCheering) {
            for (let piece of this.pieces) {
                piece.setMood(PieceMood.CHEERING, true);
            }
        }
    }

    private withinBoard(x: number, y: number) {
        return x >= 0 && x < this.boardWidth && y >= 0 && y < this.boardHeight;
    }

    private static canPieceBeSwapped(piece: Piece, pieceOrign: Piece) {
        return piece !== null && piece.draggable && piece.name !== pieceOrign.name;
    }

    private sortZIndex () {
        let self = this;
        this.piecesContainer.children.sort(function (pA: Piece, pB: Piece) {
            if (self.selectedPiece && pA === self.selectedPiece.piece) return 1;
            if (pA.y < pB.y) return -1;
            if (pA.y > pB.y) return 1;
            return 0
        });
    }
}