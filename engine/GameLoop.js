export class GameLoop {

    constructor(update, render){

        this.update = update;
        this.render = render;

        this.running = false;
        this.lastTime = 0;

    }


    start(){

        this.running = true;

        requestAnimationFrame(
            this.loop.bind(this)
        );

    }


    loop(time){

        if(!this.running) return;


        const delta =
            (time - this.lastTime) / 1000;


        this.lastTime = time;


        this.update(delta);

        this.render();


        requestAnimationFrame(
            this.loop.bind(this)
        );

    }

}