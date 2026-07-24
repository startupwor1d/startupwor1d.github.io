export class HUD {


    constructor(){

        this.message = "";

    }



    setMessage(text){

        this.message = text;

    }



    clear(){

        this.message = "";

    }



    draw(ctx,canvas){


        if(!this.message)
            return;



        ctx.fillStyle =
        "rgba(0,0,0,0.7)";


        ctx.fillRect(
            20,
            canvas.height - 100,
            canvas.width - 40,
            60
        );



        ctx.fillStyle="white";

        ctx.font="22px Arial";


        ctx.fillText(
            this.message,
            40,
            canvas.height - 60
        );


    }


}