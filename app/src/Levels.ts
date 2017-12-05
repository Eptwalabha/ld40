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
let level5: LevelSpec = {
    name: "Rouge one is worthless",
    boardDimension: new PIXI.Point(4, 4),
    pieces: {
        placed: [],
        random: [
            {
                form: PieceForm.CIRCLE,
                color: PieceColor.RED,
                amount: 4
            },
            {
                form: PieceForm.STAR,
                color: PieceColor.RED,
                amount: 4
            },
            {
                form: PieceForm.SQUARE,
                color: PieceColor.RED,
                amount: 4
            },
            {
                form: PieceForm.TRIANGLE,
                color: PieceColor.RED,
                amount: 4
            }
        ]
    },
    rules: [
        {
            type: {
                color: PieceColor.WHITE
            },
            rule: {
                type: RuleType.NONE,
                against: RuleAgainst.AGAINST
            },
            against: {
                color: PieceColor.RED
            }
        },
        {
            type: {
                color: PieceColor.RED,
                form: PieceForm.TRIANGLE
            },
            rule: {
                type: RuleType.NONE,
                against: RuleAgainst.AGAINST
            },
            against: {
                color: PieceColor.RED,
                form: PieceForm.SQUARE
            }
        },
        {
            type: {
                color: PieceColor.RED,
                form: PieceForm.STAR
            },
            rule: {
                type: RuleType.NONE,
                against: RuleAgainst.AGAINST
            },
            against: {
                color: PieceColor.RED,
                form: PieceForm.CIRCLE
            }
        }
    ]
};
let level6: LevelSpec = {
    name: 'I cannot find a name for this one',
    boardDimension: new PIXI.Point(4, 4),
    pieces: {
        placed: [
            {
                form: PieceForm.CIRCLE,
                color: PieceColor.BLUE,
                position: new PIXI.Point(1, 1),
                draggable: false
            },
            {
                form: PieceForm.CIRCLE,
                color: PieceColor.BLUE,
                position: new PIXI.Point(2, 2),
                draggable: false
            }
        ],
        random: [
            { form: PieceForm.CIRCLE, color: PieceColor.WHITE, amount: 2 },
            { form: PieceForm.SQUARE, color: PieceColor.BLUE, amount: 2 },
            { form: PieceForm.TRIANGLE, color: PieceColor.BLUE, amount: 2 },
            { color: PieceColor.RED, amount: 2 }
        ]
    },
    rules: [
        {
            type: {
                color: PieceColor.BLUE
            },
            rule: {
                type: RuleType.GROUP,
                range: {
                    min: 3
                }
            }
        },
        {
            type: {
                color: PieceColor.WHITE,
                form: PieceForm.CIRCLE
            },
            rule: {
                type: RuleType.SURROUNDED,
                against: RuleAgainst.AGAINST
            },
            against: {
                color: PieceColor.BLUE
            }
        },
        {
            type: {
                color: PieceColor.RED
            },
            rule: {
                type: RuleType.NONE,
                against: RuleAgainst.AGAINST
            },
            against: {
            }
        }
    ]
};
let level7: LevelSpec = {
    name: 'Matriochkas!',
    boardDimension: new PIXI.Point(7, 7),
    pieces: {
        placed: [
            {
                form: PieceForm.CIRCLE,
                color: PieceColor.GREEN,
                position: new PIXI.Point(1, 1),
                draggable: false
            },
            {
                form: PieceForm.SQUARE,
                color: PieceColor.GREEN,
                position: new PIXI.Point(5, 1),
                draggable: false
            },
            {
                form: PieceForm.STAR,
                color: PieceColor.GREEN,
                position: new PIXI.Point(5, 5),
                draggable: false
            },
            {
                form: PieceForm.TRIANGLE,
                color: PieceColor.GREEN,
                position: new PIXI.Point(1, 5),
                draggable: false
            }
        ],
        random: [
            { form: PieceForm.CIRCLE, color: PieceColor.GREEN, amount: 3 },
            { form: PieceForm.SQUARE, color: PieceColor.GREEN, amount: 3 },
            { form: PieceForm.STAR, color: PieceColor.GREEN, amount: 3 },
            { form: PieceForm.TRIANGLE, color: PieceColor.GREEN, amount: 3 },
            { form: PieceForm.CIRCLE, color: PieceColor.BLUE, amount: 2 },
            { form: PieceForm.SQUARE, color: PieceColor.BLUE, amount: 2 },
            { form: PieceForm.STAR, color: PieceColor.BLUE, amount: 2 },
            { form: PieceForm.TRIANGLE, color: PieceColor.BLUE, amount: 2 },
            { form: PieceForm.STAR, color: PieceColor.RED, amount: 1},
            { form: PieceForm.CIRCLE, color: PieceColor.BLACK, amount: 6},
            { form: PieceForm.SQUARE, color: PieceColor.BLACK, amount: 6},
            { form: PieceForm.STAR, color: PieceColor.BLACK, amount: 6},
            { form: PieceForm.TRIANGLE, color: PieceColor.BLACK, amount: 6}
        ]
    },
    rules: [
        {
            type: {
                color: PieceColor.GREEN
            },
            rule: {
                type: RuleType.GROUP,
                range: { min: 16 }
            }
        },
        {
            type: {
                form: PieceForm.SQUARE
            },
            rule: {
                type: RuleType.GROUP,
                range: { min: 12 }
            }
        },
        {
            type: {
                form: PieceForm.TRIANGLE
            },
            rule: {
                type: RuleType.GROUP,
                range: { min: 12 }
            }
        },
        {
            type: {
                form: PieceForm.STAR
            },
            rule: {
                type: RuleType.GROUP,
                range: { max: 6 }
            }
        }
    ]
};

export var levels: Array<LevelSpec> = [
    level1,
    level2,
    level3,
    level4,
    level5,
    level6,
    level7
];