export class DialogueManager {

    constructor() {

        this.ui = null;

        this.active = false;

    }


    attachUI(ui) {

        this.ui = ui;

    }


    openNPC(npc) {

        this.active = true;


        const name =

            npc.name ||

            npc.data?.name ||

            "Stranger";


        const lines =

            npc.dialogue ||

            npc.data?.dialogue ||

            [
                "Good to meet you. What's your startup idea?"
            ];


        this.ui?.showDialogue(

            name,

            lines,

            () =>
                this.close()

        );

    }


    advance() {

        this.ui?.advance();

    }


    close() {

        this.active = false;

        this.ui?.hideDialogue();

    }

}
