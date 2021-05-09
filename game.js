var Sopwith = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Breakout ()
    {
        Phaser.Scene.call(this, { key: 'sopwith' });

        this.plane;        
        this.planeSpeed = 100;
    },

    preload: function ()
    {
        // TODO: Load sopwith assets
        //this.load.atlas('assets', 'assets/games/breakout/breakout.png', 'assets/games/breakout/breakout.json');
        this.load.image('plane', 'assets/pics/plane2.png');
        this.load.image('burntPlane', 'assets/pics/burntplane.png');
        this.load.image('ground', 'assets/pics/ground.png');
        this.load.image('breadcrumb', 'assets/pics/breadcrumb.png');
    },

    create: function ()
    {
        this.physics.world.setBoundsCollision(true, true, true, true);

        //this.plane = new Sprite(scene, x, y, texture, [frame]);  this.physics.add.sprite   image(400, 550, 'plane');
        this.plane = this.physics.add.sprite(400, 550, 'plane');
        this.plane.crashed = false;
        this.planeAOA_Ind = this.physics.add.image(400, 550, 'breadcrumb');

        this.plane.setBounce(0.2);
        this.plane.label = "plane";
        this.plane.setCollideWorldBounds(true);
        this.plane.aoa = 0;
        var style = { font: "12px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: this.plane.width, align: "center", backgroundColor: "#ffff00" };
        //this.text = this.add.text(0, 0, "", style);
        
        this.boundaries = this.physics.add.staticGroup();
        this.boundaries.create(200, 590, 'ground').label = "ground";
        this.boundaries.create(600, 590, 'ground').label = "ground";      
        //captureText = this.text;
        this.physics.add.collider(this.plane, this.boundaries, function (plane, obstacle) {
            //captureText.setText("BOOM");
            plane.setTexture("burntPlane");
            plane.crashed = true;
            plane.setVelocityX(0);
            plane.setVelocityY(0);
        });

        cursors = this.input.keyboard.createCursorKeys();

    },

    updatePlaneAOA(delta) {
        this.plane.aoa += delta;
        if (this.plane.aoa > 180)
            this.plane.aoa -= 360;
        if (this.plane.aoa < -180)
            this.plane.aoa += 360;
    },

    calcYVelocity(theta, h) {
        sineTheta = Math.sin(this.degreesToRadians(theta));
        return sineTheta * h;
    },

    calcXVelocity(y, h) {
        return Math.sqrt(Math.pow(h, 2) - Math.pow(y, 2));
    },

    degreesToRadians(degrees)
    {
        var pi = Math.PI;
        return degrees * (pi/180);
    },
    
    update: function ()
    {
        if (this.plane.crashed) {
            return;
        }

        //this.text.x = Math.floor(this.plane.x);
        //this.text.y = Math.floor(this.plane.y);
        if (cursors.up.isDown) {
            this.updatePlaneAOA(1);
        }
        if (cursors.down.isDown) {
            this.updatePlaneAOA(-1);
        }
    
        if (this.plane.y < 20) {            
            this.plane.aoa = 90;
            this.plane.y = 21;
        }

        //this.text.setText(`x: ${this.plane.x.toFixed(2)}, y: ${this.plane.y.toFixed(2)}, rotation: ${this.plane.angle}`);
        this.plane.angle = this.plane.aoa;
        
        y = this.calcYVelocity(this.plane.angle, this.planeSpeed);
        x = this.calcXVelocity(y, this.planeSpeed);

        if (this.plane.angle > 90 || this.plane.angle < -90) {
            x = x * -1;
        }

        //this.planeAOA_Ind.x = this.plane.x + x;
        //this.planeAOA_Ind.y = this.plane.y + y;

        this.plane.setVelocityX(x);
        this.plane.setVelocityY(y);               
    }

});

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    scene: [ Sopwith ],
    physics: {
        default: 'arcade'
    }
};

var game = new Phaser.Game(config);
