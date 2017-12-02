import * as PIXI from "pixi.js/lib";
import {World} from "ept-ecs/lib";

class SimpleGame {
    constructor() {}
}

var options: PIXI.RendererOptions = {
    antialias: true,
    transparent: true
};
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
var app: PIXI.Application = new PIXI.Application(500, 500, options);
var atlasGame;

window.onload = () => {

    var setup = function () {
        new SimpleGame();
        document.getElementById("game-container").appendChild(app.view);
        var robot = new PIXI.Sprite(PIXI.loader.resources["robot"].texture);
        atlasGame = PIXI.loader.resources["atlas-game"].textures;

        var sprite1 = new PIXI.Sprite(atlasGame["image1.png"]);
        var sprite2 = new PIXI.Sprite(atlasGame["image2.png"]);
        var sprite3 = new PIXI.Sprite(atlasGame["image3.png"]);

        robot.anchor.set(0.5);
        robot.position.set(250, 250);

        var container = new PIXI.Container();
        sprite1.anchor.set(0.5);
        sprite3.anchor.set(0.5);
        container.addChild(sprite1);
        container.addChild(sprite3);
        sprite1.position.set(-5, -5);
        sprite3.position.set(5, 5);
        container.position.set(250, 250);
        container.scale.set(10, 10);
        container.filters = [new PIXI.filters.AlphaFilter(0.6)];

        sprite2.anchor.set(0.5);
        sprite2.position.set(250, 250);
        sprite2.scale.set(12, 12);

        app.stage.addChild(sprite2);
        app.stage.addChild(container);
        app.stage.addChild(robot);

        app.ticker.add(function (delta) {
            sprite1.rotation -= 0.02 * delta;
            sprite3.rotation += 0.01 * delta;
        });
        console.log("ok", PIXI);
    };

    PIXI.loader
        .add("robot", "/assets/images/robot.png")
        .add("atlas-game", "/assets/atlas/game.json")
        .load(setup);

    var world = new World();
    console.log(world.create());
    console.log(world.create());
    console.log(world.create());
    console.log("lol");
};