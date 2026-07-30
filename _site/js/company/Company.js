export class Company {


    constructor(){


        this.name = "New Startup";


        this.founded = false;


        this.idea = "";


        this.money = 1000;


        this.users = 0;


        this.team = 1;


        this.value = 0;



        this.location = {

            x:0,

            y:0

        };


    }




    create(name,idea){


        this.name = name;

        this.idea = idea;

        this.founded = true;


    }




    addUsers(amount){


        this.users += amount;


        this.value += amount * 10;


    }




    addMoney(amount){


        this.money += amount;


    }


}