import { GameLoop } from "./GameLoop.js";
import { Renderer } from "./Renderer.js";
import { Input } from "./Input.js";
import { Camera } from "./Camera.js";

import { Player } from "../entities/Player.js";
import { World } from "../world/World.js";


export class Engine {


    constructor(canvas){


        this.canvas=canvas;


        this.renderer =
        new Renderer(canvas);


        this.input =
        new Input();


        this.camera =
        new Camera();



        this.player =
        new Player(
            0,
            0,
            this.input
        );


        this.world =
        new World();



        this.loop =
        new GameLoop(
            this.update.bind(this),
            this.render.bind(this)
        );


    }



    start(){

        this.loop.start();

    }



    update(delta){


        this.player.update(delta);


        this.camera.follow(
            this.player
        );


    }



   render(){

    this.renderer.clear();


    const ctx = this.renderer.ctx;


    this.world.draw(
        ctx,
        this.camera,
        this.canvas
    );


    this.player.draw(
        ctx,
        this.camera,
        this.canvas
    );

}


}