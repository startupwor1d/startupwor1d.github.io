export class Input {


    constructor(){


        this.keys = {};

        this.previousKeys = {};



        window.addEventListener(
            "keydown",
            (event)=>{


                this.keys[
                    event.key.toLowerCase()
                ] = true;


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


        this.previousKeys = {
            ...this.keys
        };


    }



    isDown(key){


        return !!this.keys[key];


    }



    isPressed(key){


        return (
            this.keys[key] &&
            !this.previousKeys[key]
        );


    }


}