import {Piece, PieceForm, PieceColor, PieceMood} from "./Piece";
export enum RuleAffect {
    COLOR,
    FORM,
    FORM_AND_COLOR,
    ALL
}

enum Type {
    EMPTY,
    MATCHING,
    OTHER,
    CONFLICT
}

export interface RuleSpec {
    form?: PieceForm,
    color?: PieceColor,
    affect: RuleAffect
}

export class Rule {

    public form: PieceForm;
    public color: PieceColor;
    public affect: RuleAffect;
    private isPieceAffected: (piece: Piece) => boolean;
    private valid: boolean;
    private disposition: Array<Array<Type>>;

    public constructor (spec: RuleSpec) {
        this.affect = spec.affect;
        this.color = spec.color !== undefined ? spec.color : PieceColor.WHITE;
        this.form = spec.form !== undefined ? spec.form : PieceForm.SQUARE;
        this.valid = false;
        switch (this.affect) {
            case RuleAffect.ALL:
                this.isPieceAffected = function () {
                    return true;
                };
                break;
            case RuleAffect.COLOR:
                this.isPieceAffected = function (piece: Piece) {
                    return piece.color === this.color;
                };
                break;
            case RuleAffect.FORM:
                this.isPieceAffected = function (piece: Piece) {
                    return piece.form === this.form;
                };
                break;
            case RuleAffect.FORM_AND_COLOR:
                this.isPieceAffected = function (piece: Piece) {
                    return piece.form === this.form && piece.color === this.color;
                };
                break;
            default:
                this.isPieceAffected = function () {
                    return false;
                };
        }
    }

    public checkDispositionAgainstRule(disposition: Array<Array<Piece>>): boolean {
        this.updateDisposition(disposition);
        this.valid = this.checkValidity(disposition);
        return this.valid;
    }

    private isPieceConflict(piece: Piece): boolean {
        return false;
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
                        this.disposition[x][y] = this.isPieceConflict(p) ? Type.CONFLICT : Type.OTHER;
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