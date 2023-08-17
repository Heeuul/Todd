var game = new Phaser.Game(640, 960, Phaser.CANVAS, 'phaser-example', 
{
    preload: preload,
    create: create, update: update, render: render
});

function preload() 
{
    game.load.tilemap('stage', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset', 'assets/tileset.png');
    game.load.image('skyline-a', 'assets/skyline-a.png');
    game.load.image('skyline-b', 'assets/skyline-b.png');
    game.load.spritesheet('rain', 'assets/rain.png', 17, 17); 
    game.load.spritesheet('dude', 'assets/uglytoddori.png', 32, 48);
    game.load.spritesheet('dudette', 'assets/uglytodd.png', 32, 48);
    game.load.spritesheet('idk', 'assets/idk.png', 32, 48);
    game.load.image('vplatform', 'assets/vertical tile.png');
    game.load.image('tmUp', 'assets/moveUp.png');
    game.load.image('tmDown', 'assets/moveDown.png');
    game.load.image('tmLeft', 'assets/moveLeft.png');
    game.load.image('tmRight', 'assets/moveRight.png');
    game.load.audio('rainS', 'assets/rain.mp3');
    game.load.audio('songS', 'assets/thunderbird.mp3');
}

var map;
var tileset;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var dashButton;
var skinButton;
var skin = 0; 
var vertPlatform1;
var horPlatform1;
var vertPlatform2;
var winText;
var deathText;
var rainSound;
var songSound; 

var melee;
var hitbox; 

function create() 
{
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#000000'; 

    map = game.add.tilemap('stage');
    map.addTilesetImage('tileset');
    map.addTilesetImage('skyline-a');
    map.addTilesetImage('skyline-b');

    bg1 = map.createLayer('bg1');
    doorL = map.createLayer('door');
    decorL = map.createLayer('decor');
    stageL = map.createLayer('stage');
    saveL = map.createLayer('save');
    ghostL = map.createLayer('ghost tile');

    map.setCollisionByExclusion([-1], true, stageL, true);
    map.setCollisionByExclusion([-1], true, decorL, true);
    map.setCollisionByExclusion([-1], true, saveL, true);
    map.setCollisionByExclusion([-1], true, ghostL, true);

    game.physics.arcade.gravity.y = 500;

    player = game.add.sprite(72, 769, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.1;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('idle', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.allowRotation = false;

    game.camera.follow(player);
    //game.camera.setSize(640,320); 

    vertPlatform1 = game.add.sprite(30, 600, 'vplatform');
    game.physics.enable(vertPlatform1, Phaser.Physics.ARCADE);
    vertPlatform1.body.allowGravity = false;
    vertPlatform1.body.immovable = true;
    vertPlatform1.body.velocity.y = 50;
    vertPlatform2 = game.add.sprite(600, 420, 'vplatform');
    game.physics.enable(vertPlatform2, Phaser.Physics.ARCADE);
    vertPlatform2.body.allowGravity = false;
    vertPlatform2.body.immovable = true;
    vertPlatform2.body.velocity.y = 50;

    horPlatform1 = game.add.sprite(0, 350, 'vplatform');
    game.physics.enable(horPlatform1, Phaser.Physics.ARCADE);
    horPlatform1.body.allowGravity = false;
    horPlatform1.body.immovable = true;
    horPlatform1.body.velocity.x = 50; 

    colPlatform1 = game.add.sprite(550, 490, 'tmLeft');
    game.physics.enable(colPlatform1, Phaser.Physics.ARCADE);
    colPlatform1.body.allowGravity = false;
    colPlatform1.body.immovable = true;
    colPlatform2 = game.add.sprite(30, 470, 'tmUp');
    game.physics.enable(colPlatform2, Phaser.Physics.ARCADE);
    colPlatform2.body.allowGravity = false;
    colPlatform2.body.immovable = true;
    colPlatform3 = game.add.sprite(550, 460, 'tmLeft');
    game.physics.enable(colPlatform3, Phaser.Physics.ARCADE);
    colPlatform3.body.allowGravity = false;
    colPlatform3.body.immovable = true;
    colPlatform4 = game.add.sprite(201, 460, 'tmUp');
    game.physics.enable(colPlatform4, Phaser.Physics.ARCADE);
    colPlatform4.body.allowGravity = false;
    colPlatform4.body.immovable = true;
    colPlatform5 = game.add.sprite(370, 190, 'tmUp');
    game.physics.enable(colPlatform5, Phaser.Physics.ARCADE);
    colPlatform5.body.allowGravity = false;
    colPlatform5.body.immovable = true;
    colPlatform6 = game.add.sprite(0, 350, 'tmUp');
    game.physics.enable(colPlatform6, Phaser.Physics.ARCADE);
    colPlatform6.body.allowGravity = false;
    colPlatform6.body.immovable = true;
    colPlatform7 = game.add.sprite(0, 200, 'tmRight');
    game.physics.enable(colPlatform7, Phaser.Physics.ARCADE);
    colPlatform7.body.allowGravity = false;
    colPlatform7.body.immovable = true; 

    winText = game.add.text(game.world.centerX-130, game.world.centerY, 'You Win!', {font: '64px Arial', fill:'#fff'}); 
    winText.visible = false; 
    deathText = game.add.text(158, 450, 'Game Over', { font: '64px Arial', fill: '#fff' });
    deathText.visible = false;
    
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    dashButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    skinButton = game.input.keyboard.addKey(Phaser.Keyboard.P);

    var emitter = game.add.emitter(game.world.centerX, -500, 400);
    emitter.width = game.world.width*2;
    emitter.angle = 27; 
    emitter.makeParticles('rain');
    emitter.minParticleScale = 0.1;
    emitter.maxParticleScale = 0.5;
    emitter.setYSpeed(300, 500);
    emitter.setXSpeed(-5, 5);
    emitter.minRotation = 0;
    emitter.maxRotation = 0;
    emitter.start(false, 1600, 5, 0);

    rainSound = game.add.audio('rainS');
    game.sound.context.resume(); 
    rainSound.loopFull(0.05);

    songSound = game.add.audio('songS');
    songSound.loopFull(0.5);
}
    
function update() {
    game.physics.arcade.collide(player, stageL);
    game.physics.arcade.collide(player, saveL);

    game.physics.arcade.collide(player, vertPlatform1);
    game.physics.arcade.collide(player, horPlatform1);
    game.physics.arcade.collide(player, vertPlatform2);
    game.physics.arcade.collide(player, colPlatform1, tileLeft); 
    game.physics.arcade.collide(player, colPlatform2, tileUp);
    game.physics.arcade.collide(player, colPlatform3, tileLeft);
    game.physics.arcade.collide(player, colPlatform4, tileUp);
    game.physics.arcade.collide(player, colPlatform5, tileUp);
    game.physics.arcade.collide(player, colPlatform6, tileUp);
    game.physics.arcade.collide(player, colPlatform7, tileRight);

    game.physics.arcade.collide(colPlatform1, ghostL, stopTile);
    game.physics.arcade.collide(colPlatform2, ghostL, stopTile);
    game.physics.arcade.collide(colPlatform3, ghostL, stopTile);
    game.physics.arcade.collide(colPlatform4, ghostL, stopTile);
    game.physics.arcade.collide(colPlatform5, ghostL, stopTile);
    game.physics.arcade.collide(colPlatform6, ghostL, stopTile);
    game.physics.arcade.collide(colPlatform7, ghostL, stopTile);

    function tileLeft(p, c) {
        c.body.velocity.x = -300;
    }
    function tileRight(p, c) {
        c.body.velocity.x = 300;
    }
    function tileUp(p, c) {
        c.body.velocity.y = -300;
    }
    function tileDown(p, c) {
        c.body.velocity.y = 300;
    }
    function stopTile(p, c) {
        p.body.velocity.y = 0;
        p.body.velocity.x = 0;
    }

    if (vertPlatform1.y < 550) {
        vertPlatform1.body.velocity.y = 50;
    }
    if (vertPlatform1.y > 675) {
        vertPlatform1.body.velocity.y = -50;
    } 

    if (horPlatform1.x < 0) {
        horPlatform1.body.velocity.x = 50;
    }
    if (horPlatform1.x > 200) {
        horPlatform1.body.velocity.x = -50;
    }

    if (vertPlatform2.y < 120) {
        vertPlatform2.body.velocity.y = 50;
    }
    if (vertPlatform2.y > 720) {
        vertPlatform2.body.velocity.y = -50;
    }

    player.body.velocity.x = 0;
    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
        if (facing != 'left') {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
        if (facing != 'right') {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else {
        if (facing != 'idle') {
            player.animations.stop();
            if (facing == 'left') {
                player.frame = 0;
            }
            else {
                player.frame = 5;
            }
            facing = 'idle';
            player.frame = 4;
        }
    }
    if (jumpButton.isDown && game.time.now > jumpTimer || jumpButton.isDown && player.body.onFloor()) {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 1000;
    }
    if (dashButton.isDown) {
        if (facing == 'left') {
            player.body.velocity.x = player.body.velocity.x - 300; 
        }
        else if (facing == 'right') {
            player.body.velocity.x = player.body.velocity.x + 300; 
        }
    }
    if (skinButton.isDown) {
        if (skin == 0) {
            skin = 1;
            player.loadTexture('dudette', 0); 
        }
        else if (skin == 1){
            skin = 2;
            player.loadTexture('dude', 0);
        }
        else {
            skin = 0;
            player.loadTexture('idk', 0);
        }
    }
    if (player.y > 900) {
        deathText.visible = true; 
        game.paused = true;
    }
    if (player.x > 0 && player.y == 25 && player.x < 25) {
        game.camera.flash(0x696969, 15);
        winText.visible = true;
        game.paused = true;
    }
}

function render() {
    //game.debug.spriteInfo(colPlatform2, 64, 700);
    //game.debug.spriteInfo(player, 350, 700);
    game.debug.text('Textures: Warped City by ansimuz', 383, 55);
    game.debug.text('BGM: Thunderbird by Kevin MacLeod', 374, 40);
    game.debug.text('Sound: Heavy Rain by Daniel Simion', 366, 25);
}