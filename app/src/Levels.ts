import {PieceSpec, PieceForm, RandomPieceSpec, PieceColor} from "./core/Piece";
import {RuleSpec, RuleType} from "./core/Rule";

export interface LevelList {
    [id: string]: Level
}

export interface Level {
    name: string,
    pieces: PiecesSpec,
    rules: Array<RuleSpec>,
    boardDimension: PIXI.Point,
}

export interface PiecesSpec {
    placed: Array<PieceSpec>,
    random: Array<RandomPieceSpec>
}

export var levels: LevelList = {
    "level-1" : {
        name: "rule n°1: there are no rules",
        pieces: {
            placed: [
                { form: PieceForm.CIRCLE, color: PieceColor.RED, position: new PIXI.Point(0, 0) },
                { form: PieceForm.SQUARE, color: PieceColor.RED, position: new PIXI.Point(3, 0) },
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
    }
};