import { Buildings } from "./Buildings.js";


export class World {


    constructor(){

        this.buildings =
        Buildings;

    }



    draw(ctx,camera,canvas){


        for(const building of this.buildings){


            const pos =
            camera.worldToScreen(
                building.x,
                building.y,
                canvas
            );


            ctx.fillStyle =
            building.colour;


            ctx.fillRect(
                pos.x,
                pos.y,
                building.width,
                building.height
            );



            ctx.fillStyle="white";

            ctx.font="16px Arial";


            ctx.fillText(
                building.name,
                pos.x+10,
                pos.y+25
            );


        }


    }


}