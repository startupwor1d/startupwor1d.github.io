export class Entity {


    constructor(x,y){

        this.x=x;
        this.y=y;

        this.width=32;
        this.height=32;

    }


    update(){

    }


    draw(ctx,camera,canvas){

        const pos =
        camera.worldToScreen(
            this.x,
            this.y,
            canvas
        );


        ctx.fillStyle="white";


        ctx.fillRect(
            pos.x,
            pos.y,
            this.width,
            this.height
        );

    }


}