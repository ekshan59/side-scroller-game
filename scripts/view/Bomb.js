class Bomb extends PIXI.Sprite {
    constructor(texture, x = 0, y = 0, speed = 5, w = 40, h = 25) {
        super(texture);

        this.x = x;
        this.y = y;
        this.visible = false;
        this.width = w;
        this.height = h;
        this.speed = speed;
    }
}