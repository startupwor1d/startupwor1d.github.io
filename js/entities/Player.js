import { Entity } from "./Entity.js";
import { Collision } from "../engine/Collision.js";


export class Player extends Entity {


    constructor(x,y,input,world){

        super(x,y);


        this.input = input;

        this.world = world;

        this.speed = 250;


        this.width = 30;
        this.height = 30;

    }



    update(delta){


        let dx = 0;
        let dy = 0;



        if(this.input.isDown("w"))
            dy -= 1;


        if(this.input.isDown("s"))
            dy += 1;


        if(this.input.isDown("a"))
            dx -= 1;


        if(this.input.isDown("d"))
            dx += 1;



        // test X movement

        let nextX = {
            x:this.x + dx*this.speed*delta,
            y:this.y,
            width:this.width,
            height:this.height
        };


        if(!this.checkCollision(nextX)){

            this.x = nextX.x;

        }



        // test Y movement

        let nextY = {
            x:this.x,
            y:this.y + dy*this.speed*delta,
            width:this.width,
            height:this.height
        };


        if(!this.checkCollision(nextY)){

            this.y = nextY.y;

        }


    }



    checkCollision(player){


        for(const building of this.world.buildings){


            if(
                Collision.intersects(
                    player,
                    building
                )
            ){

                return true;

            }

        }


        return false;

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