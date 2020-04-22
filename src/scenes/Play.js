class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load images/tile sprites
        //this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        //this.load.image('spaceshipanim', './assets/Spaceship2.png');

        //load spritesheets
        this.load.spritesheet('explosion', './assets/explosion.png', 
        {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('boom', './assets/explosion2.png', 
        {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 5});
        this.load.spritesheet('spaceshipanim', './assets/Spaceship2.png', 
        {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 7});
        this.load.spritesheet('rocket', './assets/Mech.png',
        {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 5});
        this.load.spritesheet('MechPunch', './assets/MechPunch.png',
        {frameWidth: 32, frameHeight: 64, startFrame: 0, endFrame: 4});

        //load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
     
        //white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
       
        //green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);    

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('boom', { start: 0, end: 5, first: 0}),
            frameRate: 30
        });

        this.anims.create({
            key: 'default',
            frames: this.anims.generateFrameNumbers('spaceshipanim', { start: 0, end: 7, first: 0}),
            frameRate: 12,
            yoyo: false,
            repeat: -1
        });

        this.anims.create({
            key: 'defloat',
            frames: this.anims.generateFrameNumbers('rocket', { start: 0, end: 5, first: 0}),
            frameRate: 12,
            yoyo: false,
            repeat: -1
        });

        this.anims.create({
            key: 'LAUNCH',
            frames: this.anims.generateFrameNumbers('MechPunch', { start: 0, end: 4, first: 0}),
            frameRate: 12,
            yoyo: false,
            repeat: -1
        });

        //add rocket
        this.p1Rocket = new Rocket(this,game.config.width/2 - 8, 410, 'rocket', 0).setScale().setOrigin(0,0);
        this.p1Rocket.anims.play('defloat');

        //add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceshipanim', 0, 30).setOrigin(0,0);
        this.ship01.anims.play('default');  
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceshipanim', 0, 20).setOrigin(0,0);
        this.ship02.anims.play('default');  
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceshipanim', 0, 10).setOrigin(0,0);
        this.ship03.anims.play('default');  


        //ship animations
        //this.ship01.animations.add('default' ,[0,1,2,3,4,5], 16,true);
        //this.ship02.animations.add('default' ,[0,1,2,3,4,5], 16,true);
        //this.ship03.animations.add('default' ,[0,1,2,3,4,5], 16,true);
        
        // this.ship01.animations.play('default');
        // this.ship02.animations.play('default');
        //  this.ship03.animations.play('default');
    
        //score
        this.p1Score = 0;

        

        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        //game over flag
        this.gameOver = false;

        //firing flag
        this.FIRING = false;

        //60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this); 
    }

    update() {
        // check key input for restart or Menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        
        this.starfield.tilePositionX -= 4;
        
        if(this.gameOver==false) {
            //update rocket sprite
            this.p1Rocket.update();
            //update spaceships (x3)
            this.ship01.update();
            //this.ship01.anims.play('default'); 
            this.ship02.update();
            //this.ship02.anims.play('default');
            this.ship03.update();
            //this.ship03.anims.play('default');
        }

        //check for ship firing
        if(this.p1Rocket.isFiring == true && this.FIRING == false) {
            this.p1Rocket.anims.play('LAUNCH');
            this.FIRING = true;
            //console.log("words");
        }

        //check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.anims.play('defloat');
            this.FIRING = false;
            this.shipExplode(this.ship03);
            this.p1Rocket.reset();
            //this.ship03.reset();
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.anims.play('defloat');
            this.FIRING = false;
            this.shipExplode(this.ship02);
            this.p1Rocket.reset();
            //this.ship02.reset();  
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.anims.play('defloat');
            this.FIRING = false;
            this.shipExplode(this.ship01);
            this.p1Rocket.reset();
           // this.ship01.reset();  
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        //temporarily hide ship
        ship.alpha = 0;
        //create expiosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');            //play explode animation
        boom.on('animationcomplete', () => {   //callback after animation completes
            ship.reset();                        //reset ship position
            ship.alpha = 1;                    //make ship visible again
            boom.destroy();                      //remove explosion sprite
        });
        //score increment and repaint
        this.p1Score += ship.points*(this.p1Rocket.vertSpeed/2);
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}