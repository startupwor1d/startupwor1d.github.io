export class QuestPanel {


    constructor(){


        this.quest = null;

        this.visible = false;


        this.closeButton = {

            x:0,

            y:0,

            width:40,

            height:40

        };


        window.addEventListener(
            "click",
            (event)=>{


                if(!this.visible)
                    return;



                const mouseX =
                event.clientX;


                const mouseY =
                event.clientY;



                if(

                    mouseX >= this.closeButton.x &&

                    mouseX <= this.closeButton.x +
                    this.closeButton.width &&

                    mouseY >= this.closeButton.y &&

                    mouseY <= this.closeButton.y +
                    this.closeButton.height

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





    draw(ctx,canvas){


        if(
            !this.visible ||
            !this.quest
        )
            return;



        const x = 30;

        const y = 30;

        const width = 460;

        const height = 320;



        ctx.fillStyle =
        "rgba(0,0,0,0.85)";


        ctx.fillRect(
            x,
            y,
            width,
            height
        );



        // Close button

        this.closeButton.x =
        x + width - 50;


        this.closeButton.y =
        y + 10;



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



        // Title

        ctx.fillStyle="#ffcc00";

        ctx.font="24px Arial";


        ctx.fillText(
            this.quest.title,
            x+20,
            y+45
        );



        // Description

        ctx.fillStyle="white";

        ctx.font="15px Arial";


        ctx.fillText(
            this.quest.description,
            x+20,
            y+80
        );



        // Progress

        ctx.fillStyle="#00ff88";

        ctx.font="18px Arial";


        ctx.fillText(
            "Progress: "
            +
            this.quest.progress
            +
            "/"
            +
            this.quest.objectives.length,
            x+20,
            y+115
        );



        // Objectives

        ctx.font="16px Arial";


        this.quest.objectives.forEach(
            (objective,index)=>{


                const complete =
                this.quest.completedObjectives.includes(index);



                ctx.fillStyle =
                complete
                ? "#00ff88"
                : "white";



                ctx.fillText(

                    (complete ? "☑ " : "☐ ")
                    +
                    objective,

                    x+35,

                    y+155+(index*30)

                );


            }
        );



        // Reward

        ctx.fillStyle="#ffd166";


        ctx.fillText(
            "Reward: +" +
            this.quest.reward.xp +
            " XP   +" +
            this.quest.reward.reputation +
            " Reputation",
            x+20,
            y+275
        );


    }


}