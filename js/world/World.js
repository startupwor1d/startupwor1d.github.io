import { Buildings } from "./Buildings.js";
import { Terrain } from "./Terrain.js";


export class World {


    constructor(){


        this.buildings =
        Buildings;


        this.terrain =
        new Terrain();


    }



    draw(ctx,camera,canvas){


        // ground

        this.terrain.draw(
            ctx,
            camera,
            canvas
        );


        // buildings

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