class Orb {
    constructor(options) {
        this.color = this.getRandomColor();

        this.locationX = Math.floor(Math.random() * options.worldWidth);
        this.locationY = Math.floor(Math.random() * options.worldHeight);

        this.radius = 5;
    }

    getRandomColor() {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);

        return `rgb(${r}, ${g}, ${b})`;
    }
}

module.exports = Orb;