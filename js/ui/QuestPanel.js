export class QuestPanel {


    constructor(){


        this.quest = null;


        this.visible = false;


        this.closeButton = {

            x: 0,

            y: 0,

            width: 40,

            height: 40

        };



        window.addEventListener(
            "click",
            (event)=>{


                if(!this.visible)
                    return;



                const x =
                event.clientX;


                const y =
                event.clientY;



                if(
                    x >= this.closeButton.x &&
                    x <= this.closeButton.x + this.closeButton.width &&
                    y >= this.closeButton.y &&
                    y <= this.closeButton.y + this.closeButton.height
                ){


                    this.hide();


                }


            }
        );


    }





    show(quest){


        this.quest = quest;

        this.visible = true;


    }





    hide(){


        this.visible = false;


    }





    draw(ctx, canvas){


        if(!this.visible || !this.quest)
            return;



        const x = 30;

        const y = 30;

        const width = 430;

        const height = 260;



        // panel

        ctx.fillStyle =
        "rgba(0,0,0,0.85)";


        ctx.fillRect(
            x,
            y,
            width,
            height
        );



        // close button position

        this.closeButton.x =
        x + width - 50;


        this.closeButton.y =
        y + 10;



        // close button

        ctx.fillStyle="#e63946";


        ctx.fillRect(
            this.closeButton.x,
            this.closeButton.y,
            this.closeButton.width,
            this.closeButton.height
        );



        ctx.fillStyle="white";

        ctx.font="28px Arial";


        ctx.fillText(
            "X",
            this.closeButton.x + 10,
            this.closeButton.y + 30
        );



        // title

        ctx.fillStyle="#ffcc00";

        ctx.font="24px Arial";


        ctx.fillText(
            this.quest.title,
            x + 20,
            y + 45
        );



        // description

        ctx.fillStyle="white";

        ctx.font="16px Arial";


        ctx.fillText(
            this.quest.description,
            x + 20,
            y + 80
        );



        // objectives

        ctx.fillStyle="#00ff88";


        ctx.fillText(
            "Objectives:",
            x + 20,
            y + 125
        );



        ctx.fillStyle="white";


        this.quest.objectives.forEach(
            (objective,index)=>{


                ctx.fillText(
                    "□ " + objective,
                    x + 35,
                    y + 160 + (index * 25)
                );


            }
        );


    }


}