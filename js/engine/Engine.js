import { GameLoop } from "./GameLoop.js";
import { Renderer } from "./Renderer.js";
import { Input } from "./Input.js";
import { Camera } from "./Camera.js";
import { Interaction } from "./Interaction.js";

import { Player } from "../entities/Player.js";
import { World } from "../world/World.js";

import { QuestManager } from "../quests/QuestManager.js";
import { Dialogue } from "../ui/Dialogue.js";


export class Engine {


    constructor(canvas){


        this.canvas = canvas;



        // Core engine

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



        // Interaction + quests

        this.interaction =
        new Interaction();



        this.questManager =
        new QuestManager();



        this.dialogue =
        new Dialogue();



        // Game loop

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



        // Camera follows player

        this.camera.follow(
            this.player
        );



        // Check nearby objects

        this.interaction.update(
            this.player,
            this.world.buildings
        );



        // Interaction button

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



                this.dialogue.show(
                    "Quest Started: "
                    + quest.title
                );


            }


        }


    }




    render(){


        this.renderer.clear();


        const ctx =
        this.renderer.ctx;



        // Draw world

        this.world.draw(
            ctx,
            this.camera,
            this.canvas
        );



        // Draw player

        this.player.draw(
            ctx,
            this.camera,
            this.canvas
        );


    }


}