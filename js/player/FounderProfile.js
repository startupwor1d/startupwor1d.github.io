export class FounderProfile {


    constructor(){


        this.level = 1;

        this.xp = 0;


        this.innovation = 0;

        this.marketFit = 0;

        this.reputation = 0;


        this.money = 0;


    }





    addXP(amount){


        this.xp += amount;



        if(this.xp >= this.level * 100){


            this.level++;


            this.xp = 0;


        }


    }





    addMoney(amount){


        this.money += amount;


    }





    applyStats(stats){


        this.innovation +=
        stats.innovation || 0;



        this.marketFit +=
        stats.marketFit || 0;



        this.reputation +=
        stats.reputation || 0;


    }


}