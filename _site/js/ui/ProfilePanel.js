export class ProfilePanel {


    constructor(){


        this.visible = false;

        this.profile = null;


    }





    show(profile){


        this.profile = profile;

        this.visible = true;


    }





    hide(){


        this.visible = false;


    }





    draw(ctx,canvas){


        if(
            !this.visible ||
            !this.profile
        )
        return;



        const x = canvas.width - 260;

        const y = 30;



        ctx.fillStyle =
        "rgba(0,0,0,0.85)";


        ctx.fillRect(
            x,
            y,
            230,
            240
        );



        ctx.fillStyle="#ffcc00";

        ctx.font="22px Arial";


        ctx.fillText(
            "Founder Profile",
            x+20,
            y+35
        );



        ctx.fillStyle="white";

        ctx.font="16px Arial";


        ctx.fillText(
            "Level: " + this.profile.level,
            x+20,
            y+75
        );


        ctx.fillText(
            "XP: " + this.profile.xp,
            x+20,
            y+100
        );


        ctx.fillText(
            "Innovation: " + this.profile.innovation,
            x+20,
            y+130
        );


        ctx.fillText(
            "Market Fit: " + this.profile.marketFit,
            x+20,
            y+160
        );


        ctx.fillText(
            "Reputation: " + this.profile.reputation,
            x+20,
            y+190
        );


        ctx.fillText(
            "Money: £" + this.profile.money,
            x+20,
            y+220
        );


    }


}