import { Quests } from "./quests.js";


export class QuestManager {


    constructor(){


        this.activeQuest = null;


    }



    startQuest(id){


        if(Quests[id]){


            this.activeQuest = {

                ...Quests[id],

                progress: 0,

                completedObjectives: [],

                completed:false

            };


        }


    }





    getQuest(){


        return this.activeQuest;


    }





    completeObjective(index){


        if(!this.activeQuest)
            return;



        if(
            this.activeQuest.completedObjectives.includes(index)
        ){

            return;

        }



        this.activeQuest.completedObjectives.push(
            index
        );



        this.activeQuest.progress =
        this.activeQuest.completedObjectives.length;



        if(
            this.activeQuest.progress >=
            this.activeQuest.objectives.length
        ){


            this.activeQuest.completed = true;


        }


    }





    isComplete(){


        if(!this.activeQuest)
            return false;


        return this.activeQuest.completed;


    }





    clearQuest(){


        this.activeQuest = null;


    }


}