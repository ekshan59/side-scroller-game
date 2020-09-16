class Model {

    constructor() {
        this.myLoader;
        this.images = [
            {name: 'initBackground', url: 'images/init-background.png'},
            {name: 'background1', url: 'images/background1.png'},
            {name: 'background2', url: 'images/background2.png'},
            {name: 'background3', url: 'images/background3.png'},
            {name: 'airplane', url: 'images/airplane1.png'},
            {name: 'tank0', url: 'images/tank-red.png'},
            {name: 'tank1', url: 'images/tank-blue.png'},
            {name: 'tank2', url: 'images/tank-green.png'},
            {name: 'fuel', url: 'images/fuel.png'},
            {name: 'bomb', url: 'images/bomb.png'},
            {name: 'box', url: 'images/box.png'},
            {name: 'tankBullet', url: 'images/tank-bullet.png'},
            {name: 'playBtn', url: 'images/play-button.png'}
        ]

        this.init();
    }

    init = () => {
        this.myLoader = new Loader(this.resourcesLoaded);
        this.myLoader.loadImages(this.images);
    }

    resourcesLoaded = () => {
        const event = new CustomEvent('RESOURCES_LOADED');
        dispatchElement.dispatchEvent(event);
    }
}