export class Renderer{constructor(c){this.canvas=c;this.ctx=c.getContext("2d")}begin(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}end(){}}
