import { Entity } from "./Entity.js";


export class Player extends Entity {


    constructor(x,y,input){

        super(x,y);

        this.input=input;

        this.speed=250;

        this.width=30;
        this.height=30;

    }



    update(delta){


        let dx=0;
        let dy=0;


        if(this.input.isDown("w"))
            dy -= 1;


        if(this.input.isDown("s"))
            dy += 1;


        if(this.input.isDown("a"))
            dx -= 1;


        if(this.input.isDown("d"))
            dx += 1;



        this.x += dx * this.speed * delta;

        this.y += dy * this.speed * delta;


    }



    draw(ctx,camera,canvas){


        const pos =
        camera.worldToScreen(
            this.x,
            this.y,
            canvas
        );


        ctx.fillStyle="#00ff88";


        ctx.beginPath();

        ctx.arc(
            pos.x,
            pos.y,
            16,
            0,
            Math.PI*2
        );

        ctx.fill();


    }


}