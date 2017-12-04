import {RandomPieceSpec, Piece, PieceSpec, PieceForm, PieceColor} from "./Piece";
import {Board} from "./Board";

export class PieceFactory {

    public static buildFromRandomSpec(board: Board, randomSpec: RandomPieceSpec): Piece {
        let spec: PieceSpec = PieceFactory.buildSpec(randomSpec);
        return new Piece(board, spec);
    }

    private static buildSpec(randomSpec: RandomPieceSpec): PieceSpec {
        let form = (randomSpec.form === undefined) ?  PieceFactory.pickARandomForm() : randomSpec.form;
        let color = (randomSpec.color === undefined) ? PieceFactory.pickARandomColor() : randomSpec.color;
        return {
            form: form,
            color: color,
            draggable: (randomSpec.draggable === undefined) ? true : randomSpec.draggable,
            position: new PIXI.Point()
        }
    }

    private static pickARandomForm(): PieceForm {
        let forms: Array<PieceForm> = [
            PieceForm.SQUARE,
            PieceForm.CIRCLE,
            PieceForm.TRIANGLE,
            PieceForm.STAR
        ];
        return forms[Math.floor(Math.random() * forms.length)];
    }

    private static pickARandomColor(): PieceColor {
        let colors: Array<PieceColor> = [
            PieceColor.RED,
            PieceColor.GREEN,
            PieceColor.BLUE,
            PieceColor.WHITE,
            PieceColor.BLACK,
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}