class View extends PIXI.Container  {
    constructor(app) {
        super();

        this.app = app;
        this.initContainer = new PIXI.Container();
        this.initBg;
        this.playBtn;
        this.airplane;
        this.tankNames = ['tankRed', 'tankBlue', 'tankGreen'];
        this.tanksCreatCounter = 3;
        this.enemiesContainer = new PIXI.Container;
        this.bombBox;
        this.bombBoxShowCounter = 10;
        this.fuel;
        this.fuelShowCount = 5;

        this.gameContainer = new PIXI.Container;
        this.bgBack;
        this.bgMiddle;
        this.bgFront;
        this.bgX = 0;
        this.bgSpeed = 2;

        this.bombsLabel = new PIXI.Text('bombs:');
        this.bombsCountText = new PIXI.Text(0);
        this.scoreLabel = new PIXI.Text('score:');
        this.scoreCountText = new PIXI.Text(0);
        this.fuelLabel = new PIXI.Text('fuel:');
        this.fuelCountText = new PIXI.Text(0);

        this.prevC = -2;
        this.destMark = 2000;
        this.commonTimerCounter = 0;
        this.commonTimer;
    }

    buildGame = () => {
        //----------------------init background----------------------
        this.initBg = new PIXI.Sprite.from(sysAssets.initBackground.texture);
        this.initBg.x = 0;
        this.initBg.y = 0;
        this.initContainer.addChild(this.initBg);
        //-----------------------------------------------------------
        //----------------------game backgrounds---------------------
        this.bgBack = this.createBg(sysAssets.background3.texture);
        this.bgMiddle = this.createBg(sysAssets.background2.texture);
        this.bgFront = this.createBg(sysAssets.background1.texture);

        this.app.stage.addChild(this.gameContainer);
        this.gameContainer.visible = false;
        //-----------------------------------------------------------
        //------------------------play button------------------------
        this.playBtn = new PIXI.Sprite.from(sysAssets.playBtn.texture);
        this.playBtn.anchor.set(0.5);
        this.playBtn.x = gameW /2;
        this.playBtn.y = gameH /2;
        this.playBtn.interactive = true;
        this.playBtn.buttonMode = true;
        this.playBtn.click = () => {
            const event = new CustomEvent('PLAY-PRESSED');
            dispatchElement.dispatchEvent(event);
        }
        this.initContainer.addChild(this.playBtn);

        this.app.stage.addChild(this.initContainer);
        this.initContainer.visible = false;
        //-----------------------------------------------------------
        //---------------------------player--------------------------
        this.airplane = new Airplane(sysAssets.airplane.texture, 'player', 200, 180, sysAssets.bomb.texture, 5, 5, this.gameContainer);
        this.gameContainer.addChild(this.airplane);
        //-----------------------------------------------------------
        //--------------------------enemies--------------------------
        this.gameContainer.addChild(this.enemiesContainer);
        //-----------------------------------------------------------
        //---------------------------texts---------------------------
        this.bombsLabel.x = 20;
        this.bombsLabel.y = 50;
        this.gameContainer.addChild(this.bombsLabel);
        this.bombsCountText.x = 115;
        this.bombsCountText.y = 50;
        this.gameContainer.addChild(this.bombsCountText);

        this.scoreLabel.x = 20;
        this.scoreLabel.y = 10;
        this.gameContainer.addChild(this.scoreLabel);
        this.scoreCountText.x = 115;
        this.scoreCountText.y = 10
        this.gameContainer.addChild(this.scoreCountText);

        this.fuelLabel.x = 650;
        this.fuelLabel.y = 20;
        this.gameContainer.addChild(this.fuelLabel);
        this.fuelCountText.x = 710;
        this.fuelCountText.y = 20;
        this.gameContainer.addChild(this.fuelCountText);
        //-----------------------------------------------------------
        //-----------------------gifts-------------------------------
        this.bombBox = new PIXI.Sprite.from(sysAssets.box.texture);
        this.bombBox.x = 800;
        this.bombBox.y = 250;
        this.bombBox.width = 40;
        this.bombBox.height = 40;
        this.bombBox.anchor.set(0.5);
        this.bombBox.visible = false;
        this.gameContainer.addChild(this.bombBox);

        this.fuel = new PIXI.Sprite.from(sysAssets.fuel.texture);
        this.fuel.x = 800;
        this.fuel.y = 250;
        this.fuel.anchor.set(0.5);
        this.fuel.visible = false;
        this.gameContainer.addChild(this.fuel);
        //-----------------------------------------------------------

        const event = new CustomEvent('GAME-INITIALIZED');
        dispatchElement.dispatchEvent(event);
    }

    restoreGame = () => {
        this.airplane.position.x = 200;
        this.airplane.position.y = 180;
        this.enemiesContainer.removeChildren();
        this.bombBox.x = 800;
        this.bombBox.y = 250;
        this.fuel.x = 800;
        this.fuel.y = 250;
        this.commonTimerCounter = 0;
        this.bgSpeed = 2;
    }

    createBg = (texture) => {
        let tilling = new PIXI.TilingSprite(texture, gameW, gameH);
        tilling.position.set(0,0);
        this.gameContainer.addChild(tilling);

        return tilling;
    }

    showInitStage = () => {
        this.initContainer.visible = true;
    }

    playGame = () => {
        this.gameContainer.visible = true;
        this.initContainer.visible = false;
        this.startCommonTimer();
    }

    endGame = () => {
        this.gameContainer.visible = false;
        this.initContainer.visible = true;
    }

    //-----------------set game texts------------
    setGameScore = (value) => {
        this.scoreCountText.text = value;
    }

    setGameFuel = (value) => {
        this.fuelCountText.text = value;
    }

    setGameBomb = (value) => {
        this.bombsCountText.text = value;
    }
    //-------------------------------------------
    //---------------view collision--------------
    checkCollision = () => {
        if(this.airplane.isBombDropped()) {
            for(let i = 0; i < this.enemiesContainer.children.length; i++) {
                if(this.haveCollision(this.airplane.getBomb(), this.enemiesContainer.children[i])) {
                    this.airplane.destroyBomb();
                    this.enemiesContainer.removeChildAt(i);
                    const event = new CustomEvent('DESTROYED-TANK');
                    dispatchElement.dispatchEvent(event);
                    return;
                }
            }
        }
        
        if(this.bombBox.visible && this.haveCollision(this.bombBox, this.airplane)) {
            this.bombBox.visible = false;
            this.bombBox.x = 800;
            const event = new CustomEvent('INCREASE-BOMBS');
            dispatchElement.dispatchEvent(event);   
        }

        if(this.fuel.visible && this.haveCollision(this.fuel, this.airplane)) {
            this.fuel.visible = false;
            this.fuel.x = 800;
            const event = new CustomEvent('INCREASE-FUEL');
            dispatchElement.dispatchEvent(event);   
        }
    }

    haveCollision = (a, b) => {
        let aObj = a.getBounds();
        let bObj = b.getBounds();

        return aObj.x + aObj.width > bObj.x &&
               aObj.x < bObj.x + bObj.width &&
               aObj.y + aObj.height > bObj.y &&
               aObj.y < bObj.y + bObj.height;
    }
    //-------------------------------------------
    update = () => {
        this.updateBg();
        this.airplane.update();
        this.calculateAirplaneDestination();
        this.tanksMovement();
        this.stuffMovement(this.bombBox);
        this.stuffMovement(this.fuel);
        this.checkCollision();
    }

    updateBg = () => {
        this.bgX = (this.bgX - this.bgSpeed);
        this.bgFront.tilePosition.x = this.bgX;
        this.bgMiddle.tilePosition.x = this.bgX /3;
        this.bgBack.tilePosition.x = this.bgX /6;
    }

    moveBg = (direction) => {
        let dir = (direction == 'right')? 1 : -1;
        this.bgSpeed = this.bgSpeed + dir;
        if(this.bgSpeed < 2) this.bgSpeed = 2;
        if(this.bgSpeed > 8) this.bgSpeed = 8;
    }

    tanksMovement = () => {
        for(let i = 0; i < this.enemiesContainer.children.length; i++) {
            this.enemiesContainer.children[i].x = this.enemiesContainer.children[i].x - this.bgSpeed;
            if(this.enemiesContainer.children[i].x < -50) {
                this.enemiesContainer.removeChildAt(i);
            }
        }
    }

    stuffMovement = (obj) => {
        if(obj.visible) {
            obj.x = obj.x - this.bgSpeed;
            if(obj.x < - 50) {
                obj.visible = false;
                obj.x = 800;
            }
        }
    }

    calculateAirplaneDestination = () => {
    //    console.log(this.prevC, " GGGGG ",  parseInt(this.bgX % this.destMark));
        if(this.prevC < parseInt(this.bgX % this.destMark)) { 
            const event = new CustomEvent('DECREASES-FUEL');
            dispatchElement.dispatchEvent(event);
        }
        this.prevC = parseInt(this.bgX % this.destMark);
    }

    gamePause = (is) => {
        if(is) this.stopCommonTimer();
        else this.startCommonTimer();
    }

    //---------------------------airplane---------------------------
    moveAirplane = (direction) => {
        if(direction == 'up' && this.airplane.position.y > this.airplane.height/2) {
            this.airplane.move(direction, this.bgSpeed)
        } 
        else if(direction == 'down' && this.airplane.position.y < 300) {
            this.airplane.move(direction, this.bgSpeed)
        }
    }

    addAirplaneBombs = (value) => {
        this.airplane.addBombs(value);
    }

    airplaneFire = () => {
        this.airplane.fire();
    }

    crashAirplane = (bombs) => {
        this.airplane.landing = true;
        this.airplane.destroyAllBombs(bombs);
    }
    //--------------------------------------------------------------
    //-------------------additional timer---------------------------
    startCommonTimer = () => {
        this.commonTimer = setInterval(() => {
            this.commonTimerCounter++;

            if(this.commonTimerCounter % this.tanksCreatCounter == 0) {
                let countX = Math.floor((Math.random() * 10) + 1);
                let countName = Math.floor((Math.random() * 3));
                let enemy = new Tank(sysAssets['tank'+countName].texture, this.tankNames[countName], (768 + countX * 10), 340, sysAssets.tankBullet.texture, 1, 5);
                this.enemiesContainer.addChild(enemy);
            } 

            if(!this.bombBox.visible && this.commonTimerCounter % this.bombBoxShowCounter == 0) {
                let boxY = Math.floor((Math.random() * 300) + 10);
                this.bombBox.y = boxY;
                this.bombBox.visible = true;
            }

            if(!this.fuel.visible && this.commonTimerCounter % this.fuelShowCount == 0) {
                let fuelY = Math.floor((Math.random() * 300) + 10);
                this.fuel.y = fuelY;
                this.fuel.visible = true;
            }
        }, 1000)
    }

    stopCommonTimer = () => {
        clearInterval(this.commonTimer);
    }
    //--------------------------------------------------------------
}