export class Terrain {


    constructor(){

        this.tileSize = 80;

        this.colors = [
            "#4a7c59",
            "#568f5b",
            "#5c9563"
        ];

    }



    draw(ctx,camera,canvas){


        const startX =
        Math.floor(
            (camera.x - canvas.width/2)
            / this.tileSize
        ) * this.tileSize;


        const startY =
        Math.floor(
            (camera.y - canvas.height/2)
            / this.tileSize
        ) * this.tileSize;



        const endX =
        camera.x + canvas.width;


        const endY =
        camera.y + canvas.height;



        for(
            let x=startX;
            x<endX;
            x+=this.tileSize
        ){

            for(
                let y=startY;
                y<endY;
                y+=this.tileSize
            ){


                const screen =
                camera.worldToScreen(
                    x,
                    y,
                    canvas
                );


                const index =
                Math.abs(
                    (x+y)/this.tileSize
                )
                % this.colors.length;



                ctx.fillStyle =
                this.colors[
                    Math.floor(index)
                ];



                ctx.fillRect(
                    screen.x,
                    screen.y,
                    this.tileSize,
                    this.tileSize
                );


            }

        }


    }


}