export class AnimationManager{constructor(){this.animations=new Map()}register(id,d){this.animations.set(id,d)}get(id){return this.animations.get(id)}}
