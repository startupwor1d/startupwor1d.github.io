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
import { ChoicePanel } from "../ui/ChoicePanel.js";
import { ProfilePanel } from "../ui/ProfilePanel.js";

import { FounderProfile } from "../player/FounderProfile.js";

import { DecisionSystem } from "../systems/DecisionSystem.js";

import { Problems } from "../data/Problems.js";


export class Engine {


    constructor(canvas){


        this.canvas = canvas;



        // Engine systems

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



        // Quest system

        this.questManager =
        new QuestManager();



        // Startup systems

        this.founder =
        new FounderProfile();



        this.decisionSystem =
        new DecisionSystem();



        // UI

        this.hud =
        new HUD();



        this.questPanel =
        new QuestPanel();



        this.dialogueBox =
        new DialogueBox();



        this.choicePanel =
        new ChoicePanel();



        this.profilePanel =
        new ProfilePanel();



        this.profilePanel.show(
            this.founder
        );



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



        this.player.update(delta);



        this.camera.follow(
            this.player
        );



        this.interaction.update(
            this.player,
            [
                ...this.world.buildings,
                ...this.world.npcs
            ]
        );



        // Dialogue handling

        if(
            this.dialogueBox.visible
        ){


            if(
                this.input.isPressed("e")
            ){


                const npc =
                this.dialogueBox.target;



                if(
                    npc &&
                    npc.problem
                ){


                    this.choicePanel.show(
                        Problems[npc.problem]
                    );


                }


                else if(
                    npc &&
                    npc.objective !== undefined
                ){


                    this.questManager.completeObjective(
                        npc.objective
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





        // Choice system

        if(
            this.choicePanel.visible
        ){


            if(
                this.input.isPressed("1")
            ){


                this.makeDecision(0);


            }



            if(
                this.input.isPressed("2")
            ){


                this.makeDecision(1);


            }



            if(
                this.input.isPressed("3")
            ){


                this.makeDecision(2);


            }



            return;


        }





        // Interaction message

        if(
            this.interaction.canInteract()
        ){


            const target =
            this.interaction.getTarget();



            this.hud.setMessage(
                "Press E to interact with "
                +
                target.name
            );


        }
        else{


            this.hud.clear();


        }





        // Interaction button

        if(
            this.input.isPressed("e") &&
            this.interaction.canInteract()
        ){


            const target =
            this.interaction.getTarget();



            // Start quest building

            if(
                target.quest
            ){


                this.questManager.startQuest(
                    target.quest
                );



                const quest =
                this.questManager.getQuest();



                this.questPanel.show(
                    quest
                );


            }



            // NPC conversation

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





    makeDecision(index){


        const problem =
        this.choicePanel.problem;



        if(!problem)
            return;



        const choice =
        problem.choices[index];



        if(choice){


            this.decisionSystem.makeChoice(
                choice,
                this.founder
            );


        }



        this.choicePanel.hide();


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



        this.questPanel.draw(
            ctx,
            this.canvas
        );



        this.dialogueBox.draw(
            ctx,
            this.canvas
        );



        this.choicePanel.draw(
            ctx,
            this.canvas
        );



        this.profilePanel.draw(
            ctx,
            this.canvas
        );


    }


}