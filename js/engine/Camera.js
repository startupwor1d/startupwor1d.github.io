export class Camera {


    constructor(){

        this.x = 0;
        this.y = 0;

    }


    follow(target){

        this.x = target.x;
        this.y = target.y;

    }


    worldToScreen(x,y,canvas){

        return {

            x:
            x - this.x + canvas.width / 2,


            y:
            y - this.y + canvas.height / 2

        };

    }


}