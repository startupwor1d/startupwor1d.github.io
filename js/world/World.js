import { Buildings } from "./Buildings.js";
import { Terrain } from "./Terrain.js";
import { Roads } from "./Roads.js";
import { Decorations } from "./Decorations.js";
import { NPCs } from "./NPCs.js";


export class World {


    constructor(){


        this.buildings = Buildings;

        this.terrain = new Terrain();

        this.roads = Roads;

        this.decorations = Decorations;

        this.npcs = NPCs;


    }




    draw(ctx,camera,canvas){


        this.terrain.draw(
            ctx,
            camera,
            canvas
        );



        // Roads

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

        }




        // Buildings

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





        // Decorations

        for(const item of this.decorations){


            const pos =
            camera.worldToScreen(
                item.x,
                item.y,
                canvas
            );


            if(item.type==="tree"){


                ctx.fillStyle="#8b5a2b";


                ctx.fillRect(
                    pos.x-5,
                    pos.y,
                    10,
                    25
                );


                ctx.fillStyle="#2ecc71";


                ctx.beginPath();

                ctx.arc(
                    pos.x,
                    pos.y-10,
                    25,
                    0,
                    Math.PI*2
                );

                ctx.fill();

            }


        }





        // NPCs

        for(const npc of this.npcs){


            const pos =
            camera.worldToScreen(
                npc.x,
                npc.y,
                canvas
            );



            ctx.fillStyle =
            npc.colour;



            ctx.beginPath();


            ctx.arc(
                pos.x,
                pos.y,
                15,
                0,
                Math.PI*2
            );


            ctx.fill();



            ctx.fillStyle="white";


            ctx.font="14px Arial";


            ctx.fillText(
                npc.name,
                pos.x-25,
                pos.y-25
            );


        }


    }


}