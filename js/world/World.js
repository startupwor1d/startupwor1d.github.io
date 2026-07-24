import { Buildings } from "./Buildings.js";
import { Terrain } from "./Terrain.js";
import { Roads } from "./Roads.js";


export class World {


    constructor(){

        this.buildings = Buildings;

        this.terrain = new Terrain();

        this.roads = Roads;

    }



    draw(ctx,camera,canvas){


        this.terrain.draw(
            ctx,
            camera,
            canvas
        );


        // roads

        for(const road of this.roads){


            const pos =
            camera.worldToScreen(
                road.x,
                road.y,
                canvas
            );


            ctx.fillStyle="#3b3b3b";


            ctx.fillRect(
                pos.x,
                pos.y,
                road.width,
                road.height
            );


            // road markings

            ctx.strokeStyle="#f5d742";
            ctx.lineWidth=4;
            ctx.setLineDash([20,20]);


            ctx.beginPath();

            ctx.moveTo(
                pos.x,
                pos.y + road.height/2
            );

            ctx.lineTo(
                pos.x + road.width,
                pos.y + road.height/2
            );

            ctx.stroke();


            ctx.setLineDash([]);

        }



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