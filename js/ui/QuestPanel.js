export class QuestPanel {


    constructor(){

        this.quest = null;


    }



    show(quest){


        this.quest = quest;


    }



    hide(){


        this.quest = null;


    }



    draw(ctx,canvas){


        if(!this.quest)
            return;



        const x = 30;

        const y = 30;

        const width = 420;

        const height = 250;



        ctx.fillStyle =
        "rgba(0,0,0,0.85)";



        ctx.fillRect(
            x,
            y,
            width,
            height
        );



        ctx.fillStyle="#ffcc00";

        ctx.font="26px Arial";


        ctx.fillText(
            this.quest.title,
            x+20,
            y+40
        );



        ctx.fillStyle="white";

        ctx.font="16px Arial";


        ctx.fillText(
            this.quest.description,
            x+20,
            y+75
        );



        ctx.fillStyle="#00ff88";

        ctx.fillText(
            "Objectives:",
            x+20,
            y+120
        );



        ctx.fillStyle="white";


        this.quest.objectives.forEach(
            (item,index)=>{


                ctx.fillText(
                    "□ " + item,
                    x+30,
                    y+150+(index*25)
                );


            }
        );


    }


}