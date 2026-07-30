export class Renderer {


    constructor(canvas){

        this.canvas = canvas;

        this.ctx =
            canvas.getContext("2d");


        this.resize();


        window.addEventListener(
            "resize",
            ()=>this.resize()
        );

    }


    resize(){

        this.canvas.width =
            window.innerWidth;

        this.canvas.height =
            window.innerHeight;

    }


    clear(){

        this.ctx.fillStyle="#101820";

        this.ctx.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

    }


}