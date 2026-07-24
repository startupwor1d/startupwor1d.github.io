import { GameLoop } from "./GameLoop.js";
import { Renderer } from "./Renderer.js";
import { Input } from "./Input.js";
import { Camera } from "./Camera.js";
import { Interaction } from "./Interaction.js";

import { Player } from "../entities/Player.js";
import { World } from "../world/World.js";

import { QuestManager } from "../quests/QuestManager.js";
import { Dialogue } from "../ui/Dialogue.js";
import { HUD } from "../ui/HUD.js";


export class Engine {


    constructor(canvas){


        this.canvas = canvas;



        this.renderer =
        new Renderer(canvas);



        this.input =
        new Input();



        this.camera =
        new Camera();



        this.world =
        new World();



        this.player =
        new Player(
            0,
            0,
            this.input,
            this.world
        );



        this.interaction =
        new Interaction();



        this.questManager =
        new QuestManager();



        this.dialogue =
        new Dialogue();



        this.hud =
        new HUD();



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



        this.interaction.update(
            this.player,
            this.world.buildings
        );



        if(
            this.interaction.canInteract()
        ){


            const building =
            this.interaction.getTarget();



            this.hud.setMessage(
                "Press E to enter " + building.name
            );


        }
        else{


            this.hud.clear();


        }



        if(
            this.input.isDown("e") &&
            this.interaction.canInteract()
        ){


            const building =
            this.interaction.getTarget();



            if(building.quest){


                this.questManager.startQuest(
                    building.quest
                );



                const quest =
                this.questManager.getQuest();



                if(quest){


                    this.hud.setMessage(
                        "Quest Started: "
                        + quest.title
                    );


                }


            }


        }


    }




    render(){


        this.renderer.clear();



        const ctx =
        this.renderer.ctx;



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



        this.hud.draw(
            ctx,
            this.canvas
        );


    }


}