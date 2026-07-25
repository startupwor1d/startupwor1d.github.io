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

import { Company } from "../company/Company.js";
import { CompanyHQ } from "../world/CompanyHQ.js";


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



        // Startup systems

        this.founder =
        new FounderProfile();



        this.company =
        new Company();



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



        // Dialogue

        if(this.dialogueBox.visible){


            if(this.input.isPressed("e")){


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



                this.dialogueBox.hide();


            }


            return;

        }






        // Startup decision

        if(this.choicePanel.visible){



            if(this.input.isPressed("1")){


                this.createStartup(0);


            }



            if(this.input.isPressed("2")){


                this.createStartup(1);


            }



            if(this.input.isPressed("3")){


                this.createStartup(2);


            }



            return;


        }






        // Interaction prompt

        if(this.interaction.canInteract()){


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






        // Press E

        if(
            this.input.isPressed("e") &&
            this.interaction.canInteract()
        ){


            const target =
            this.interaction.getTarget();




            if(target.quest){


                this.questManager.startQuest(
                    target.quest
                );



                this.questPanel.show(
                    this.questManager.getQuest()
                );


            }



            else if(target.dialogue){


                this.dialogueBox.show(
                    target.name,
                    target.dialogue,
                    target
                );


            }


        }


    }






    createStartup(index){



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



            this.company.create(
                "My First Startup",
                choice.text
            );



            this.company.addMoney(
                1000
            );



            CompanyHQ.active = true;



            this.world.companyHQ =
            CompanyHQ;



            this.hud.setMessage(
                "Startup Created!"
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