class PlayerConfig{
    constructor(options){
        this.xVector = 0;
        this.yVector = 0;
        this.speed = options.speed;
        this.zoom = options.zoom;
    }
}

module.exports = PlayerConfig;