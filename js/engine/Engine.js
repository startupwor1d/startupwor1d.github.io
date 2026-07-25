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
import { DialogueBox } from "../ui/DialogueBox.js";


export class Engine {


    constructor(canvas){


        this.canvas = canvas;



        // Core systems

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



        this.dialogueBox =
        new DialogueBox();



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



        // Camera

        this.camera.follow(
            this.player
        );



        // Find nearby interactables

        this.interaction.update(
            this.player,
            [
                ...this.world.buildings,
                ...this.world.npcs
            ]
        );



        // If dialogue is open

        if(
            this.dialogueBox.visible
        ){


            if(
                this.input.isPressed("e")
            ){


                const target =
                this.dialogueBox.target;



                if(
                    target &&
                    target.objective !== undefined
                ){


                    this.questManager.completeObjective(
                        target.objective
                    );



                    const quest =
                    this.questManager.getQuest();



                    if(quest){


                        this.questPanel.show(
                            quest
                        );


                    }


                }



                this.dialogueBox.hide();


            }



            return;


        }





        // Interaction prompt

        if(
            this.interaction.canInteract()
        ){


            const target =
            this.interaction.getTarget();



            this.hud.setMessage(
                "Press E to interact with "
                + target.name
            );


        }
        else{


            this.hud.clear();


        }





        // Press E

        if(
            this.input.isPressed("e") &&
            this.interaction.canInteract()
        ){


            const target =
            this.interaction.getTarget();




            // Start building quests

            if(
                target.quest
            ){


                this.questManager.startQuest(
                    target.quest
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





            // NPC dialogue

            else if(
                target.dialogue
            ){


                this.dialogueBox.show(
                    target.name,
                    target.dialogue,
                    target
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



        // Draw UI

        this.hud.draw(
            ctx,
            this.canvas
        );



        this.questPanel.draw(
            ctx,
            this.canvas
        );



        this.dialogueBox.draw(
            ctx,
            this.canvas
        );


    }


}