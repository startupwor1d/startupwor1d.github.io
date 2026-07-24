export class Interaction {


    constructor(){

        this.nearby = null;

        this.distance = 120;

    }



    update(player, objects){


        this.nearby = null;


        for(const object of objects){


            const dx =
            player.x - object.x;


            const dy =
            player.y - object.y;


            const distance =
            Math.sqrt(
                dx*dx + dy*dy
            );



            if(distance < this.distance){

                this.nearby = object;

                break;

            }

        }

    }



    canInteract(){

        return this.nearby !== null;

    }



    getTarget(){

        return this.nearby;

    }


}