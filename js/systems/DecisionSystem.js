export class DecisionSystem {


    constructor(){


        this.lastChoice = null;


    }





    makeChoice(choice, founder){



        founder.applyStats(
            choice.stats
        );



        this.lastChoice = choice;


    }





    getLastChoice(){


        return this.lastChoice;


    }


}