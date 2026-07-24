import { GameLoop } from "./GameLoop.js";
import { Renderer } from "./Renderer.js";
import { Input } from "./Input.js";


export class Engine {

    constructor(canvas){

        this.canvas = canvas;

        this.renderer = new Renderer(canvas);

        this.input = new Input();

        this.loop = new GameLoop(
            this.update.bind(this),
            this.render.bind(this)
        );

    }


    start(){

        this.loop.start();

    }


    update(delta){

        this.input.update();

    }


    render(){

        this.renderer.clear();

    }

}