export class DialogueUI {

    constructor() {

        this.box =
            document.getElementById(
                "dialogue-box"
            );

        this.nameEl =
            document.getElementById(
                "dialogue-name"
            );

        this.textEl =
            document.getElementById(
                "dialogue-text"
            );

        this.hintEl =
            document.getElementById(
                "dialogue-hint"
            );

        this.prompt =
            document.getElementById(
                "interact-prompt"
            );


        this.lines = [];

        this.index = 0;

        this.onClose = null;


        if (this.box) {

            this.box.addEventListener(

                "click",

                () =>
                    this.advance()

            );

        }

    }


    showDialogue(
        name,
        lines,
        onClose
    ) {

        this.lines =
            lines;

        this.index =
            0;

        this.onClose =
            onClose;


        if (this.nameEl) {

            this.nameEl.textContent =
                name;

        }


        if (this.box) {

            this.box.classList.remove(
                "hidden"
            );

        }


        this.showLine();

    }


    showLine() {

        if (

            this.index <
            this.lines.length

        ) {

            if (this.textEl) {

                this.textEl.textContent =
                    this.lines[
                        this.index
                    ];

            }


            this.index++;

            return;

        }


        this.hideDialogue();


        if (this.onClose) {

            this.onClose();

        }

    }


    advance() {

        if (

            this.box &&

            !this.box.classList.contains(
                "hidden"
            )

        ) {

            this.showLine();

        }

    }


    hideDialogue() {

        if (this.box) {

            this.box.classList.add(
                "hidden"
            );

        }

    }


    showPrompt(
        text
    ) {

        if (!this.prompt) {

            return;

        }


        this.prompt.textContent =
            text;

        this.prompt.classList.remove(
            "hidden"
        );

    }


    hidePrompt() {

        if (this.prompt) {

            this.prompt.classList.add(
                "hidden"
            );

        }

    }

}
