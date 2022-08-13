
import { MainForm } from './main_form';
import { CommonMethods } from './common_methods';
import { SGCSState } from './sg_cs_state';
import { SGCSBomb } from './sg_cs_bomb';
import { SGCSPlayer } from './sg_cs_player';
import { stringify } from 'querystring';
import { SGCSDude } from './sg_cs_dude';

const CreateCollectStar_REQUEST = "CreateCollectStar"
const EndCollectStar_REQUEST = "EndCollectStar"
const GrabStar_REQUEST = "GrabStar"

export class SGDrawingHelper {
    public mainForm: MainForm

    public isDragging: any
    public DrawSf2ryu: Function
    public DrawWalker: Function
    public CreateCollectStar: Function
    public hiddenEffects: any
    public hiddenEffectImages: any[]
    public hiddenGames: any
    public hiddenGamesImages: any[]
    public players: any;
    public stars: any;
    public bombs: any;
    public platforms: any;
    public scoreTexts: any;
    public usageText: any;
    public IsPlayingGame: string = "";
    public sgcsState: SGCSState;
    public myPlayerIndex: number = -1;

    constructor(mf: MainForm) {
        this.mainForm = mf
        this.hiddenEffectImages = [];
        this.hiddenGamesImages = [];
        this.sgcsState = new SGCSState(mf);

        this.DrawSf2ryu = function () {
            this.hiddenEffectImages = [];
            this.mainForm.gameScene.anims.create({
                key: 'hadoken',
                frameRate: 12,
                frames: this.mainForm.gameScene.anims.generateFrameNames('sf2ryu', { prefix: 'frame_', end: 15, zeroPad: 2 }),
                yoyo: false,
                repeat: 3,
                hideOnComplete: true
            });
            this.hiddenEffectImages.push(this.mainForm.gameScene.add.sprite(this.mainForm.gameScene.coordinates.centerX, this.mainForm.gameScene.coordinates.centerY, 'sf2ryu').play('hadoken').setScale(3))
        }

        this.DrawWalker = function () {
            this.hiddenEffectImages = [];
            let animConfig = {
                key: 'walk',
                frames: 'walker',
                frameRate: 60,
                repeat: -1
            };

            this.mainForm.gameScene.anims.create(animConfig);

            this.hiddenEffectImages.push(this.mainForm.gameScene.add.sprite(this.mainForm.gameScene.coordinates.screenWid, this.mainForm.gameScene.coordinates.centerY, 'walker', 'frame_0000'))
            this.hiddenEffectImages[0].setX(this.mainForm.gameScene.coordinates.screenWid + this.hiddenEffectImages[0].width / 4);

            this.hiddenEffectImages[0].play('walk');

            this.mainForm.gameScene.tweens.add({
                targets: this.hiddenEffectImages[0],
                x: 0 - this.hiddenEffectImages[0].width / 2,
                y: this.mainForm.gameScene.coordinates.centerY,
                delay: 500,
                duration: 5000,
                ease: "Cubic.easeInOut",
                onComplete: () => {
                    this.hiddenEffectImages[0].destroy();
                }
            });
        }

        this.CreateCollectStar = function (isNewGame?: boolean, playerID?: string) {
            if (isNewGame) this.sgcsState = new SGCSState(this.mainForm);
            if (playerID) this.sgcsState.PlayerId = playerID;
            this.mainForm.gameScene.sendMessageToServer(CreateCollectStar_REQUEST, this.mainForm.tractorPlayer.MyOwnId, JSON.stringify(this.sgcsState));
        }

        this.hiddenEffects = {
            "hadoken": this.DrawSf2ryu,
            "walker": this.DrawWalker,
        }
        this.hiddenGames = {
            "collectstar": this.CreateCollectStar,
        }
    }

    public NotifyCreateCollectStar(state: SGCSState) {
        if (state.Stage > 1 && !this.IsPlayingGame) return;
        this.sgcsState = state;
        if (this.sgcsState.Stage > 1) {
            this.usageText.setText(`stage: ${this.sgcsState.Stage}\nmove: ← and →\njump: ↑\nquit: esc`);
            //  A new batch of stars to collect
            for (let i = 0; i < this.stars.children.entries.length; i++) {
                let child = this.stars.children.entries[i];
                child.enableBody(true, this.mainForm.gameScene.coordinates.centerX - 400 + this.sgcsState.Stars[i].X, this.mainForm.gameScene.coordinates.centerY - 300 + this.sgcsState.Stars[i].Y, true, true);
            }
            // this.player.x = this.mainForm.gameScene.coordinates.centerX - 400 + this.sgcsState.Dude.X;
            // this.player.y = this.mainForm.gameScene.coordinates.centerY - 300 + this.sgcsState.Dude.Y;
            // for (let i = 0; i < this.bombs.children.entries.length; i++) {
            //     let bomb = this.bombs.children.entries[i];
            //     bomb.x = this.sgcsState.Bombs[i].X;
            //     bomb.y = this.sgcsState.Bombs[i].Y;
            // }
            this.createBomb();
            return;
        }

        this.mainForm.blurChat();
        this.mainForm.gameScene.physics.resume();
        this.hiddenGamesImages = [];
        this.mainForm.gameScene.physics.world.setBounds(this.mainForm.gameScene.coordinates.centerX - 400, this.mainForm.gameScene.coordinates.centerY - 300, 800, 600);

        //  A simple background for our game
        this.hiddenGamesImages.push(this.mainForm.gameScene.add.image(this.mainForm.gameScene.coordinates.centerX, this.mainForm.gameScene.coordinates.centerY, 'sky'));

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.mainForm.gameScene.physics.add.staticGroup();
        this.hiddenGamesImages.push(this.platforms);

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        this.platforms.create(this.mainForm.gameScene.coordinates.centerX, this.mainForm.gameScene.coordinates.centerY + 268, 'ground').setScale(2).refreshBody();

        //  Now let's create some ledges
        this.platforms.create(this.mainForm.gameScene.coordinates.centerX + 200, this.mainForm.gameScene.coordinates.centerY + 100, 'ground');
        this.platforms.create(this.mainForm.gameScene.coordinates.centerX - 275, this.mainForm.gameScene.coordinates.centerY - 50, 'ground2');
        this.platforms.create(this.mainForm.gameScene.coordinates.centerX + 275, this.mainForm.gameScene.coordinates.centerY - 80, 'ground2');

        // The player and its settings
        this.players = this.mainForm.gameScene.physics.add.group();
        this.hiddenGamesImages.push(this.players);
        for (let i = 0; i < this.sgcsState.Dudes.length; i++) {
            var player = this.mainForm.gameScene.physics.add.sprite(this.mainForm.gameScene.coordinates.centerX - 400 + this.sgcsState.Dudes[i].X, this.mainForm.gameScene.coordinates.centerY - 300 + this.sgcsState.Dudes[i].Y, 'dude');
            this.players.add(player);
            if (this.sgcsState.Dudes[i].Tint) {
                player.setTint(parseInt(this.sgcsState.Dudes[i].Tint));
            }

            //  Player physics properties. Give the little guy a slight bounce.
            player.setBounce(this.sgcsState.Dudes[i].Bounce);
            player.setCollideWorldBounds(true);
            if (!this.sgcsState.Dudes[i].Enabled) {
                player.disableBody(true, true);
            }
        }

        //  Our player animations, turning, walking left and walking right.
        this.mainForm.gameScene.anims.create({
            key: 'left',
            frames: this.mainForm.gameScene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.mainForm.gameScene.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.mainForm.gameScene.anims.create({
            key: 'right',
            frames: this.mainForm.gameScene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        this.stars = this.mainForm.gameScene.physics.add.group();
        this.hiddenGamesImages.push(this.stars);
        for (let i = 0; i < 12; i++) {
            var star = this.stars.create(this.mainForm.gameScene.coordinates.centerX - 400 + this.sgcsState.Stars[i].X, this.mainForm.gameScene.coordinates.centerY - 300 + this.sgcsState.Stars[i].Y, 'star');
            star.setBounce(this.sgcsState.Stars[i].Bounce);
            star.setScale(0.25);
        }

        this.bombs = this.mainForm.gameScene.physics.add.group();
        this.hiddenGamesImages.push(this.bombs);
        // this.createBomb();

        //  The score
        this.scoreTexts = this.mainForm.gameScene.add.group();
        this.hiddenGamesImages.push(this.scoreTexts);
        for (let i = 0; i < this.sgcsState.Dudes.length; i++) {
            let dude = this.sgcsState.Dudes[i];
            var scoreText = this.mainForm.gameScene.add.text(this.mainForm.gameScene.coordinates.centerX - 384 + 160 * (i + 1), this.mainForm.gameScene.coordinates.centerY - 284, `${dude.PlayerId}\nscore: ${dude.Score}`)
                .setColor(dude.Tint ? SGCSDude.TintColors[i] : "blue")
                .setFontSize(16);
            this.scoreTexts.add(scoreText);
        }

        //  usage
        this.usageText = this.mainForm.gameScene.add.text(this.mainForm.gameScene.coordinates.centerX - 384, this.mainForm.gameScene.coordinates.centerY - 284, `stage: ${this.sgcsState.Stage}\nmove: ← and →\njump: ↑\nquit: esc`)
            .setColor("black")
            .setFontSize(16);
        this.hiddenGamesImages.push(this.usageText);

        //  Collide the player and the stars with the platforms
        this.mainForm.gameScene.physics.add.collider(this.players, this.players);
        this.mainForm.gameScene.physics.add.collider(this.players, this.platforms);
        this.mainForm.gameScene.physics.add.collider(this.stars, this.platforms);
        this.mainForm.gameScene.physics.add.collider(this.bombs, this.platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.mainForm.gameScene.physics.add.overlap(this.players, this.stars, (player, star) => { this.collectStar.apply(this, [player, star]); }, undefined, this.mainForm.gameScene);
        this.mainForm.gameScene.physics.add.overlap(this.players, this.bombs, (player, bomb) => { this.hitBomb.apply(this, [player, bomb]); }, undefined, this.mainForm.gameScene);
        this.IsPlayingGame = SGCSState.GameName;
    }

    public moveLeft(player: any) {
        if (this.sgcsState.IsGameOver || !player.active) return;
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }

    public moveRight(player: any) {
        if (this.sgcsState.IsGameOver || !player.active) return;
        player.setVelocityX(160);
        player.anims.play('right', true);
    }

    public playerJump(player: any) {
        if (this.sgcsState.IsGameOver || !player.active) return;
        if (player.body.touching.down) {
            player.setVelocityY(-330);
        }
    }

    public playerStop(player: any) {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    public collectStar(player: any, star: any) {
        if (this.myPlayerIndex < 0 || this.players.children.entries[this.myPlayerIndex] !== player) return;
        star.disableBody(true, true);
        for (let i = 0; i < this.stars.children.entries.length; i++) {
            if (star === this.stars.children.entries[i]) {
                this.mainForm.gameScene.sendMessageToServer(GrabStar_REQUEST, this.mainForm.tractorPlayer.MyOwnId, JSON.stringify([this.myPlayerIndex, i]));
            }
        }
    }

    public NotifyGrabStar(playerIndex: number, starIndex: number) {
        if (!this.IsPlayingGame) return;
        let star = this.stars.children.entries[starIndex];
        star.disableBody(true, true);

        //  Add and update the score
        this.sgcsState.Dudes[playerIndex].Score += 10;
        this.scoreTexts.children.entries[playerIndex].setText(`${this.sgcsState.Dudes[playerIndex].PlayerId}\nScore: ${this.sgcsState.Dudes[playerIndex].Score}`);
    }

    public createBomb() {
        if (this.sgcsState.Bombs && this.sgcsState.Bombs.length > 0) {
            let bombIndex = this.sgcsState.Bombs.length - 1;
            var bomb = this.bombs.create(this.mainForm.gameScene.coordinates.centerX - 400 + this.sgcsState.Bombs[bombIndex].X, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(this.sgcsState.Bombs[bombIndex].VelX, 20);
            bomb.setScale(0.25);
        }
    }

    public hitBomb(player: any, bomb: any) {
        if (this.myPlayerIndex < 0 || this.players.children.entries[this.myPlayerIndex] !== player) return;
        this.mainForm.gameScene.sendMessageToServer(EndCollectStar_REQUEST, this.mainForm.tractorPlayer.MyOwnId, JSON.stringify(this.myPlayerIndex));
    }

    public NotifyEndCollectStar(state: SGCSState) {
        this.sgcsState = state;

        for (let i = 0; i < this.players.children.entries.length; i++) {
            if (!this.sgcsState.Dudes[i].Enabled) {
                let player = this.players.children.entries[i];
                this.playerStop(player)
                player.setTint("0xff0000");
                setTimeout(() => {
                    player.disableBody(true, true);
                }, 2 * 1000);
            }
        }

        if (this.sgcsState.IsGameOver) {
            this.destroyGame(2);
        }
    }

    public destroyGame(delaySeconds: number) {
        if (!this.IsPlayingGame) return;
        this.mainForm.gameScene.physics.pause();
        this.IsPlayingGame = "";
        this.mainForm.NotifyStartTimerEventHandler(delaySeconds)
        setTimeout(() => {
            this.hiddenGamesImages.forEach(image => {
                if (image.clear && typeof image.clear === "function") image.clear(true, true);
                else image.destroy();
            })
            this.hiddenGamesImages = [];
        }, delaySeconds * 1000);
    }

    public NotifySgcsPlayerUpdated(player: SGCSPlayer) {
        if (!this.IsPlayingGame) return;
        let dude = this.players.children.entries[player.PlayerIndex];
        if (player.leftKeyPressed) this.moveLeft(dude);
        else if (player.rightKeyPressed) this.moveRight(dude);
        else if (player.upKeyPressed) this.playerJump(dude);
        else this.playerStop(dude);
    }
}
