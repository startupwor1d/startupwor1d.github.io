import { GameLoop } from "./GameLoop.js";
import { Renderer } from "./Renderer.js";
import { Input } from "./Input.js";
import { Camera } from "./Camera.js";
import { Interaction } from "./Interaction.js";

import { Player } from "../entities/Player.js";
import { World } from "../world/World.js";

import { QuestManager } from "../quests/QuestManager.js";

import { HUD } from "../ui/HUD.js";
import { QuestPanel } from "../ui/QuestPanel.js";


export class Engine {


    constructor(canvas){


        this.canvas = canvas;



        // Core engine systems

        this.renderer =
        new Renderer(canvas);



        this.input =
        new Input();



        this.camera =
        new Camera();



        // World

        this.world =
        new World();



        // Player

        this.player =
        new Player(
            0,
            0,
            this.input,
            this.world
        );



        // Interaction

        this.interaction =
        new Interaction();



        // Quest systems

        this.questManager =
        new QuestManager();



        // UI

        this.hud =
        new HUD();



        this.questPanel =
        new QuestPanel();



        // Loop

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



        // Player movement

        this.player.update(delta);



        // Camera tracking

        this.camera.follow(
            this.player
        );



        // Check nearby buildings

        this.interaction.update(
            this.player,
            this.world.buildings
        );



        // Show interaction prompt

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




        // Press E interaction

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


                    this.questPanel.show(
                        quest
                    );



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



        // World

        this.world.draw(
            ctx,
            this.camera,
            this.canvas
        );



        // Player

        this.player.draw(
            ctx,
            this.camera,
            this.canvas
        );



        // UI

        this.hud.draw(
            ctx,
            this.canvas
        );



        this.questPanel.draw(
            ctx,
            this.canvas
        );


    }


}