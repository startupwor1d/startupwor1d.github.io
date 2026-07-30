import { Entity } from "./Entity.js";

export class Player extends Entity {

    constructor(
        x,
        y,
        input,
        navigation,
        quests,
        dialogue,
        sprites,
        animations
    ) {

        super(x, y);

        this.type = "player";

        this.input = input;
        this.navigation = navigation;
        this.quests = quests;
        this.dialogue = dialogue;

        this.sprites = sprites;
        this.animations = animations;

        this.speed = 190;
        this.radius = 14;

        this.interactionTarget = null;

        this.facing = "down";

        if (animations) {
            this.animator = animations.create("player", {
                fps: 7,
                frames: [
                    "idle",
                    "walk1",
                    "walk2"
                ]
            });
        } else {
            this.animator = {
                frame:"idle",
                play(){},
                update(){}
            };
        }

    }

    update(dt) {

        // Don't move while dialogue is open
        if (this.dialogue.active) {
            this.animator.play("idle");
            this.animator.update(dt);
            return;
        }

        let dx = 0;
        let dy = 0;

        if (this.input.down("ArrowLeft") || this.input.down("a")) dx--;
        if (this.input.down("ArrowRight") || this.input.down("d")) dx++;

        if (this.input.down("ArrowUp") || this.input.down("w")) dy--;
        if (this.input.down("ArrowDown") || this.input.down("s")) dy++;

        if (dx !== 0 || dy !== 0) {

            const len = Math.hypot(dx, dy);

            dx /= len;
            dy /= len;

            if (!this.navigation.isBlocked(
                this.x + dx * this.speed * dt,
                this.y,
                this.radius
            )) {
                this.x += dx * this.speed * dt;
            }

            if (!this.navigation.isBlocked(
                this.x,
                this.y + dy * this.speed * dt,
                this.radius
            )) {
                this.y += dy * this.speed * dt;
            }

            this.animator.play("walk");

        } else {

            this.animator.play("idle");

        }

        this.animator.update(dt);

        // Look for nearest NPC
        this.findInteractionTarget();

        // Press E
        if (
            this.interactionTarget &&
            (
                this.input.down("e") ||
                this.input.down("E")
            )
        ) {

            this.interact();

        }

    }

    findInteractionTarget() {

        this.interactionTarget = null;

        let closest = 999999;

        const npcs = this.quests.getInteractableNPCs();

        for (const npc of npcs) {

            const d = Math.hypot(
                npc.x - this.x,
                npc.y - this.y
            );

            if (d < 70 && d < closest) {

                closest = d;
                this.interactionTarget = npc;

            }

        }

    }

    interact() {

        if (!this.interactionTarget) return;

        console.log("Talking to", this.interactionTarget.name);

        this.dialogue.openNPC(this.interactionTarget);

        this.quests.handleTalk(this.interactionTarget.id);

    }

    draw(ctx, camera) {

        const p = camera.worldToScreen(this.x, this.y);

        ctx.save();

        ctx.translate(p.x, p.y);

        // Shadow
        ctx.fillStyle = "rgba(0,0,0,.2)";
        ctx.beginPath();
        ctx.ellipse(0, 4, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = "#2563eb";
        ctx.fillRect(-8, -22, 16, 22);

        // Head
        ctx.fillStyle = "#f2c7a5";
        ctx.beginPath();
        ctx.arc(0, -28, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

    }

}