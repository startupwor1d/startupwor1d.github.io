export class Input {


    constructor(){


        this.keys = {};

        this.justPressed = {};



        window.addEventListener(
            "keydown",
            (event)=>{


                const key =
                event.key.toLowerCase();



                if(!this.keys[key]){

                    this.justPressed[key] = true;

                }



                this.keys[key] = true;


            }
        );



        window.addEventListener(
            "keyup",
            (event)=>{


                this.keys[
                    event.key.toLowerCase()
                ] = false;


            }
        );


    }



    update(){

        this.justPressed = {};

    }



    isDown(key){

        return !!this.keys[key];

    }



    isPressed(key){

        return !!this.justPressed[key];

    }


}