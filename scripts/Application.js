class Application {
    app;
    controller;

    constructor() {
       // console.log("Application class");

        this.start();
    }


    start = () => {
        this.app = new PIXI.Application({
            width: gameW,
            height: gameH,
            backgroundColor: 0xAAAAAA
        });

        document.querySelector("#gameParent").appendChild(this.app.view);

        this.controller = new Controller(this.app);
    };
}