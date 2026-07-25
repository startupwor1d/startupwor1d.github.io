export class DialogueBox {


    constructor(){


        this.visible = false;

        this.text = "";

        this.speaker = "";

        this.target = null;


    }



    show(speaker,text,target){


        this.speaker = speaker;

        this.text = text;

        this.target = target;

        this.visible = true;


    }



    hide(){


        this.visible = false;

        this.target = null;


    }



    draw(ctx,canvas){


        if(!this.visible)
            return;



        const width = 520;

        const height = 150;

        const x = 40;

        const y = canvas.height - 190;



        ctx.fillStyle =
        "rgba(0,0,0,0.85)";


        ctx.fillRect(
            x,
            y,
            width,
            height
        );



        ctx.fillStyle="#ffcc00";

        ctx.font="22px Arial";


        ctx.fillText(
            this.speaker,
            x+20,
            y+35
        );



        ctx.fillStyle="white";

        ctx.font="18px Arial";


        ctx.fillText(
            this.text,
            x+20,
            y+80
        );



        ctx.fillStyle="#00ff88";

        ctx.fillText(
            "Press E to continue",
            x+20,
            y+125
        );


    }


}