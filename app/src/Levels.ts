import {PieceSpec, PieceForm, RandomPieceSpec, PieceColor} from "./core/Piece";
import {RuleSpec, RuleType, RuleAgainst} from "./core/Rule";

export interface LevelSpec {
    name: string,
    pieces: PiecesSpec,
    rules: Array<RuleSpec>,
    boardDimension: PIXI.Point,
}

export interface PiecesSpec {
    placed: Array<PieceSpec>,
    random: Array<RandomPieceSpec>
}

let level1: LevelSpec = {
    name: "rule n°1: there are no rules",
    pieces: {
        placed: [
            {
                form: PieceForm.CIRCLE,
                color: PieceColor.RED,
                position: new PIXI.Point(0, 0)
            },
            {
                form: PieceForm.SQUARE,
                color: PieceColor.RED,
                position: new PIXI.Point(2, 0)
            }
        ],
        random: []
    },
    rules: [
        {
            type: {
                color: PieceColor.RED
            },
            rule: {
                type: RuleType.GROUP,
                range: {
                    min: 2
                }
            }
        }
    ],
    boardDimension: new PIXI.Point(3, 1)
};

let level2: LevelSpec = {
    name: "rule n°1: there are no rules",
    pieces: {
        placed: [
            {
                form: PieceForm.CIRCLE,
                color: PieceColor.RED,
                position: new PIXI.Point(2, 2),
                draggable: false
            }
        ],
        random: [
            {
                color: PieceColor.BLUE,
                amount: 8
            },
            {
                color: PieceColor.GREEN,
                amount: 8
            }
        ]
    },
    rules: [
        {
            type: {
                color: PieceColor.RED
            },
            rule: {
                type: RuleType.SURROUNDED,
                against: RuleAgainst.AGAINST
            },
            against: {
                type: PieceColor.BLUE
            }
        }
    ],
    boardDimension: new PIXI.Point(5, 5)
};

export var levels: Array<LevelSpec> = [
    level1,
    level2
];