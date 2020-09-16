class Tank extends Machine {
    constructor(texture, name, x, y, bombTexture, bombs, bombSpeed) {
        super(texture, name, x, y, bombs);

        this.bombTexture = bombTexture;
        this.bombSpeed = bombSpeed;
    }

}