let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play],
};

//reserve keyboard vars
let keyF, keyLEFT, keyRIGHT;

let game = new Phaser.Game(config );
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000,
}
