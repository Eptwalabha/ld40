import {Piece, PieceForm, PieceColor, PieceMood} from "./Piece";

enum Type {
    EMPTY,
    MATCHING,
    OTHER,
    AGAINST
}

export interface RuleSpec {
    type: PieceType,
    against?: PieceType
}

export interface PieceType {
    form?: PieceForm,
    color?: PieceColor
}

export class Rule {

    private isPieceAffected: (piece: Piece) => boolean;
    private isPieceAgainst: (piece: Piece) => boolean;
    private valid: boolean;
    private disposition: Array<Array<Type>>;

    public constructor (spec: RuleSpec) {
        this.valid = false;
        this.isPieceAffected = this.buildPieceMatcher(spec.type, false);
        this.isPieceAgainst = this.buildPieceMatcher(spec.against, true);
    }

    private buildPieceMatcher(type: PieceType, matchAll: boolean): (piece: Piece) => boolean {
        if (type === undefined) {
            return function () {
                return false;
            }
        }
        if (type.color === undefined && type.form !== undefined) {
            return function (piece: Piece) {
                return piece.form === type.form;
            }
        }
        if (type.color !== undefined && type.form === undefined) {
            return function (piece: Piece) {
                return piece.color === type.color;
            }
        }
        if (type.color !== undefined && type.form !== undefined) {
            return function (piece: Piece) {
                return piece.form === type.form && piece.color === type.color;
            }
        }
        return function () {
            return matchAll;
        }
    }

    public checkDispositionAgainstRule(disposition: Array<Array<Piece>>): boolean {
        this.updateDisposition(disposition);
        this.valid = this.checkValidity(disposition);
        return this.valid;
    }

    private updateDisposition(disposition: Array<Array<Piece>>) {
        this.disposition = [];
        for (let x = 0; x < disposition.length; ++x) {
            this.disposition[x] = [];
            for (let y = 0; y < disposition[x].length; ++y) {
                let p = disposition[x][y];
                if (p === null) {
                    this.disposition[x][y] = Type.EMPTY;
                } else {
                    if (this.isPieceAffected(p)) {
                        this.disposition[x][y] = Type.MATCHING;
                    } else {
                        this.disposition[x][y] = this.isPieceAgainst(p) ? Type.AGAINST : Type.OTHER;
                    }
                }
            }
        }
    }

    private checkValidity(disposition: Array<Array<Piece>>) {
        let valid: boolean = true;
        for (let x = 0; x < this.disposition.length; ++x) {
            for (let y = 0; y < this.disposition.length; ++y) {
                if (this.disposition[x][y] !== Type.MATCHING) continue;
                let p = disposition[x][y];
                if (this.checkPieceValidity(p)) {
                    p.setMood(PieceMood.FRIENDLY);
                } else {
                    p.setMood(PieceMood.ANGRY);
                    valid = false;
                }
            }
        }
        return valid;
    }

    private checkPieceValidity(piece: Piece) {
        return false;
    }
}