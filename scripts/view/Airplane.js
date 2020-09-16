class Airplane extends Machine {
    constructor(texture, name, x, y, bombTexture, bombs, bombSpeed, parent) {
        super(texture, name, x, y, bombs);

        this.fuel = 5;
        this.distance = 0;
        this.landing = false;
        this.bombSpeed = bombSpeed;
        this.trunk = [];
        this.droppedBombs = [];
        this.bombTexture = bombTexture;
        this.parent = parent;

        this.createBombs(bombs);
    }

    createBombs = (bombs) => {
        for(let i = 0; i < bombs; i++) {
            let bomb = new Bomb(this.bombTexture, 0, 0, 5);
            bomb.anchor.set(0.5);
            bomb.visible = false;
            this.trunk.push(bomb);
            this.parent.addChild(bomb);
        }
    }

    destroyBomb = () => {
        if(this.droppedBombs.length) {
            let bomb = this.droppedBombs.shift();
            this.parent.removeChild(bomb);
        }
    }

    destroyAllBombs = (value) => {
        for(let i = 0; i < value; i++) {
            let bomb = this.trunk.shift();
            this.parent.removeChild(bomb);
        }
        this.trunk = [];
    }

    move = (direction, speed) => {
        if(direction == 'up') {
            this.y -= speed;
        } else if(direction == 'down') {
            this.y += speed;
        }
    }

    fire = () => {
        if(this.trunk.length) {
            let bomb = this.trunk.shift();
            bomb.position.x = this.x;
            bomb.position.y = this.y;
            bomb.visible = true;
            this.droppedBombs.push(bomb);
        } else {
            // TODO sound error
        }
    }

    checkBombExplosion = (bomb) => {
        if(bomb.position.y > (gameH - 90)) {
            this.droppedBombs.shift();
            this.parent.removeChild(bomb);
        }
    }

    updateBombs = () => {
        if(this.droppedBombs.length) {
            for(let i = 0; i < this.droppedBombs.length; i++) {
                this.droppedBombs[i].position.y += this.bombSpeed;
                this.checkBombExplosion(this.droppedBombs[i]);
            }
        }
    }

    isBombDropped = () => this.droppedBombs.length;

    getCurrentBombs = () => this.trunk.length;

    getBomb = () => this.droppedBombs[0];

    addBombs = (value) => {
        this.createBombs(value);
    }
    

    update = () => {  // on every tick
        this.updateBombs();
        if(this.landing) {
            this.position.y = this.position.y + 4;
            if(this.position.y > 350) {
                this.landing = false;
                const event = new CustomEvent('AIRPLANE-CRASHED');
                dispatchElement.dispatchEvent(event);
            }
        }
            
    }
}