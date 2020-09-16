class Machine extends PIXI.Sprite {
    constructor(texture, name = 'none', x = 0, y = 0, bombs = 1) {
        super(texture);

        this.name = name;
        this.anchor.set(0.5);
        this.x = x;
        this.y = y;
        this.bombs = bombs;

    }
}