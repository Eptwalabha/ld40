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
    name: "rule n°1:\nthere are no rules",
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
    name: "rule n°2:\nbut rules stack up",
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
                form: PieceForm.CIRCLE,
                amount: 3
            },
            {
                color: PieceColor.BLUE,
                amount: 5
            },
            {
                color: PieceColor.RED,
                form: PieceForm.SQUARE,
                amount: 8
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
    boardDimension: new PIXI.Point(5, 5)
};
let level3: LevelSpec = {
    name: 'Black sheep',
    boardDimension: new PIXI.Point(5, 5),
    pieces: {
        placed: [
            {
                color: PieceColor.BLACK,
                form: PieceForm.CIRCLE,
                position: new PIXI.Point(2, 2)
            }
        ],
        random: [
            {
                color: PieceColor.WHITE,
                form: PieceForm.CIRCLE,
                amount: 4
            },
            {
                color: PieceColor.WHITE,
                form: PieceForm.SQUARE,
                amount: 4
            }
        ]
    },
    rules: [
        {
            type: {
                color: PieceColor.BLACK
            },
            rule: {
                type: RuleType.NEIGHBOURS,
                against: RuleAgainst.AGAINST,
                amount: 4
            },
            against: {
                color: PieceColor.WHITE
            }
        },
        {
            type: {
                color: PieceColor.WHITE
            },
            rule: {
                type: RuleType.NEIGHBOURS,
                against: RuleAgainst.SAME,
                amount: 2
            }
        },
        {
            type: {
                color: PieceColor.WHITE,
                form: PieceForm.SQUARE
            },
            rule: {
                type: RuleType.NEIGHBOURS,
                against: RuleAgainst.AGAINST,
                amount: 2
            },
            against: {
                color: PieceColor.WHITE,
                form: PieceForm.CIRCLE
            }
        }
    ]
};
let level4: LevelSpec = {
    name: "among the stars",
    boardDimension: new PIXI.Point(7, 7),
    pieces: {
        placed: [
            {
                form: PieceForm.TRIANGLE,
                color: PieceColor.BLUE,
                position: new PIXI.Point(3, 3),
                draggable: false
            }
        ],
        random: [
            { color: PieceColor.WHITE, form: PieceForm.SQUARE, amount: 3 },
            { color: PieceColor.WHITE, form: PieceForm.STAR, amount: 3 },
            { color: PieceColor.GREEN, form: PieceForm.SQUARE, amount: 3 },
            { color: PieceColor.GREEN, form: PieceForm.STAR, amount: 3 },
            { color: PieceColor.RED, amount: 5 }
        ]
    },
    rules: [
        {
            type: {
                color: PieceColor.WHITE
            },
            rule: {
                type: RuleType.GROUP,
                range: { min: 5 }
            }
        },
        {
            type: {
                color: PieceColor.GREEN
            },
            rule: {
                type: RuleType.GROUP,
                range: { min: 5 }
            }
        },
        {
            type: {
                form: PieceForm.TRIANGLE,
                color: PieceColor.BLUE
            },
            rule: {
                type: RuleType.NEIGHBOURS,
                against: RuleAgainst.AGAINST,
                amount: 4
            },
            against: {
                form: PieceForm.STAR
            }
        }
    ]
};

export var levels: Array<LevelSpec> = [
    level1,
    level2,
    level3,
    level4
];