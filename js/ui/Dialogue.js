export class Dialogue {


    constructor(){

        this.message = "";

    }



    show(text){

        this.message = text;

        console.log(text);

    }



    clear(){

        this.message="";

    }


}