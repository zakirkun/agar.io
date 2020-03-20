class PlayerData{
    constructor(name, id ,options){
        this.name = name;
        this.id = id;

        this.locationX = Math.floor(options.worldWidth * Math.random());
        this.locationY = Math.floor(options.worldHeight * Math.random());

        this.radius = options.size;
        this.color = this.getRandomColor();
        this.score = 0;
    }

    getRandomColor(){
        const r = Math.floor((Math.random() * 255));
        const g = Math.floor((Math.random() * 255));
        const b = Math.floor((Math.random() * 255));

        return `rgb(${r}, ${g}, ${b})`;
    }
}

module.exports = PlayerData;