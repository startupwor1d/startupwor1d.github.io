import { Quests } from "./quests.js";


export class QuestManager {


    constructor(){


        this.activeQuest = null;


    }



    startQuest(id){


        if(Quests[id]){


            this.activeQuest =
            {

                ...Quests[id],

                progress:0,

                completed:false

            };


        }


    }



    getQuest(){


        return this.activeQuest;


    }



    completeObjective(){


        if(!this.activeQuest)
            return;



        this.activeQuest.progress++;



        if(
            this.activeQuest.progress >=
            this.activeQuest.objectives.length
        ){


            this.activeQuest.completed = true;


        }


    }



    clearQuest(){


        this.activeQuest = null;


    }


}