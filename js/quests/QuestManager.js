export class QuestManager {


    constructor(){

        this.activeQuest = null;

    }



    startQuest(id){


        if(id === "idea-validation"){


            this.activeQuest = {

                title:"Validate Your Startup Idea",

                description:
                "Interview customers and discover a real problem."

            };


        }


    }



    getQuest(){

        return this.activeQuest;

    }


}