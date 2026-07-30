export class ChoicePanel {


    constructor(){


        this.visible = false;

        this.problem = null;

        this.buttons = [];


    }





    show(problem){


        this.problem = problem;

        this.visible = true;


    }





    hide(){


        this.visible = false;

        this.problem = null;


    }





    draw(ctx,canvas){


        if(
            !this.visible ||
            !this.problem
        )
        return;



        const x = 40;

        const y = 40;

        const width = 500;

        const height = 330;



        ctx.fillStyle =
        "rgba(0,0,0,0.9)";


        ctx.fillRect(
            x,
            y,
            width,
            height
        );



        ctx.fillStyle="#ffcc00";

        ctx.font="24px Arial";


        ctx.fillText(
            this.problem.title,
            x+20,
            y+40
        );



        ctx.fillStyle="white";

        ctx.font="18px Arial";


        ctx.fillText(
            this.problem.description,
            x+20,
            y+80
        );



        ctx.fillStyle="#00ff88";


        ctx.fillText(
            "Choose your solution:",
            x+20,
            y+120
        );



        this.problem.choices.forEach(
            (choice,index)=>{


                ctx.fillStyle="white";


                ctx.fillText(

                    (index+1)
                    +
                    ". "
                    +
                    choice.text,

                    x+30,

                    y+165+(index*45)

                );


            }
        );


    }


}