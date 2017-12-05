import {GameState} from "./state/GameState";
import {Game} from "./core/Game";
import {LoadingState} from "./state/LoadingState";
import {MenuState} from "./state/MenuState";
import {GameOverState} from "./state/GameOverState";
import {PauseState} from "./state/PauseState";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
window.onload = () => {

    let setup = function (app: PIXI.Application) {
        let game = new Game(app);
        game.addState("loading", new LoadingState(), true);
        game.addState("menu", new MenuState());
        game.addState("game", new GameState());
        game.addState("pause", new PauseState());
        game.addState("game over", new GameOverState());
        game.start();

        let delta,
            lastTs = Date.now();
        let run = function () {
            let now = Date.now();
            delta = now - lastTs;
            lastTs = now;
            game.update(delta);
            requestAnimationFrame(run);
        };
        hookTabChange(game);
        requestAnimationFrame(run);

    };

    let hookTabChange = function (game: Game) {
        let visibilityChange;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
            visibilityChange = "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            visibilityChange = "msvisibilitychange";
        } else {
            return;
        }
        document.addEventListener(visibilityChange, function () {
            if (document.hidden) {
                game.pauseGame();
            } else {
                game.resumeGame();
            }
        });
    };

    PIXI.loader
        .add("board", "/assets/atlas/board.json")
        .add("piece", "/assets/atlas/piece.json")
        .add("rule", "/assets/atlas/rule.json")
        .add("ui", "/assets/atlas/ui.json")
        .load(function() {
            let options: PIXI.RendererOptions = {
                // antialias: true,
                transparent: true,
                view: document.getElementById("game-canvas") as HTMLCanvasElement,
                width: 600,
                height: 450
            };
            let app: PIXI.Application = new PIXI.Application(options);
            document.getElementById("game-container").appendChild(app.view);
            setup(app);
        });
};