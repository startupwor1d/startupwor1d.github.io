export class SpriteManager{constructor(a){this.assets=a}draw(ctx,id,x,y,w,h){const i=this.assets.getImage(id);if(i)ctx.drawImage(i,x-w/2,y-h,w,h)}}
