class Loader {
    constructor(cb) {
        this.loader = new PIXI.Loader();
        this.cb = cb;
    }

    loadImages = (res) => {
        // for(let i = 0; i < res.lenght; i++) {
        //     console.log("ooooo ", res[i].name, res[i].url);
        //     this.loader.add(res[i].name, res[i].url);
        // }

        this.loader
            .add('airplane', 'images/airplane1.png')
            .add('playBtn', 'images/play-button.png')
            .add('initBackground', 'images/init-background.png')
            .add('background1', 'images/background1.png')
            .add('background2', 'images/background2.png')
            .add('background3', 'images/background3.png')
            .add('tank0', 'images/tank-red.png')
            .add('tank1', 'images/tank-blue.png')
            .add('tank2', 'images/tank-green.png')
            .add('fuel', 'images/fuel.png')
            .add('bomb', 'images/bomb.png')
            .add('box', 'images/box.png')
            .add('tankBullet', 'images/tank-bullet.png')

        this.loader.onProgress.add(this.showProgress);
        this.loader.onComplete.add(this.doneLoading);
        this.loader.onError.add(this.logError);
        this.loader.load();
    }

    showProgress = (e) => {
        console.log("loading progress: ", e.progress);
        // TODO visualize with bar progress
    }

    doneLoading = () => {
        sysAssets = this.loader.resources;
        console.log("all system assets: ", sysAssets);
        this.cb();
    }

    logError = (e) => {
        console.error("ERROR: " + e.message);
    }
}