
import { MainForm } from './main_form';
import { CommonMethods } from './common_methods';
import { SGCSState } from './sg_cs_state';
import { SGCSBomb } from './sg_cs_bomb';
import { SGCSPlayer } from './sg_cs_player';
import { stringify } from 'querystring';
import { SGCSDude } from './sg_cs_dude';
import { SGGBState } from './sg_gobang_state';
import { fontWeight } from '@mui/system';

const CreateCollectStar_REQUEST = "CreateCollectStar"
const UpdateGobang_REQUEST = "UpdateGobang"
const EndCollectStar_REQUEST = "EndCollectStar"
const GrabStar_REQUEST = "GrabStar"

export class SGDrawingHelper {
    public mainForm: MainForm

    public isDragging: any
    public DrawSf2ryu: Function
    public DrawWalker: Function
    public CreateCollectStar: Function
    public UpdateGobang: Function
    public hiddenEffects: any
    public hiddenEffectImages: any[]
    public hiddenGames: any
    public hiddenGamesImages: any[]
    public endCollectStarRequested: boolean = false;
    public players: any;
    public stars: any;
    public bombs: any;
    public platforms: any;
    public scoreTexts: any;
    public usageText: any;
    public IsPlayingGame: string = "";
    public sgcsState: SGCSState;
    public sggbState: SGGBState;
    public myPlayerIndex: number = -1;
    public txtGobangPlayer1: any
    public txtGobangPlayer2: any
    public txtGobangPlayerMoving: any
    public btnStartGobang: any
    public btnQuitGobang: any
    public imageChessboard: any
    public imageChessboardCells: any
    public gobangBoardEdge = 25
    public gobangBoardCell = 35
    public gobangBoardOriginX: any
    public gobangBoardOriginY: any
    public gobangColorByID = ["", "gobangPieceBlack", "gobangPieceWhite"]

    constructor(mf: MainForm) {
        this.mainForm = mf
        this.hiddenEffectImages = [];
        this.hiddenGamesImages = [];
        this.sgcsState = new SGCSState(mf);
        this.sggbState = new SGGBState(mf);

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

        this.UpdateGobang = function (isNewGame?: boolean, playerID?: string) {
            if (isNewGame) {
                this.sggbState = new SGGBState(this.mainForm);
                this.sggbState.GameAction = "create";
            }
            if (playerID) this.sggbState.PlayerId1 = playerID;
            this.mainForm.gameScene.sendMessageToServer(UpdateGobang_REQUEST, this.mainForm.tractorPlayer.MyOwnId, JSON.stringify(this.sggbState));
        }

        this.hiddenEffects = {
            "hadoken": this.DrawSf2ryu,
            "walker": this.DrawWalker,
        }
        this.hiddenGames = {
            "collectstar": this.CreateCollectStar,
            "gobang": this.UpdateGobang,
        }
    }

    public NotifyCreateCollectStar(state: SGCSState) {
        if (state.Stage > 1 && !this.IsPlayingGame) return;
        this.sgcsState = state;
        this.endCollectStarRequested = false;
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
        if (this.myPlayerIndex < 0 || this.players.children.entries[this.myPlayerIndex] !== player || this.endCollectStarRequested) return;
        this.endCollectStarRequested = true;
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
                    if (player && player.body) player.disableBody(true, true);
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

    public NotifyUpdateGobang(state: SGGBState) {
        this.sggbState = state;

        let isGameEnded = this.sggbState.GameStage === "over" && !this.sggbState.PlayerIdWinner;
        if (isGameEnded) {
            this.destroyGame(0);
            return;
        }
        else {
            this.IsPlayingGame = SGGBState.GameName;
        }

        // 后来加入的玩家，重新画UI
        // - 没有gameboard
        // - 不是第一次开始新游戏
        let isJoiningLater = (!this.imageChessboard || !this.imageChessboard.active) &&
            this.sggbState.GameStage !== "created";
        if (isJoiningLater) {
            this.InitUIGobang();
            if (this.sggbState.PlayerId2) {
                this.txtGobangPlayer2.setText(this.sggbState.PlayerId2);
            }
            if (this.sggbState.PlayerIdMoving) {
                this.txtGobangPlayerMoving.setText(this.sggbState.PlayerIdMoving);
            }
            if (this.sggbState.GameStage === "over" && this.sggbState.PlayerIdWinner) {
                this.txtGobangPlayerMoving.setText(`恭喜玩家\n【${this.sggbState.PlayerIdMoved}】\n获胜`);
            }
            if ((this.sggbState.GameStage === "over" && this.sggbState.PlayerIdWinner) ||
                (this.sggbState.GameStage === "restarted")) {
                this.btnStartGobang.setVisible(!this.mainForm.tractorPlayer.isObserver);
            }
            this.DrawPiecesGobang();
            return;
        }

        switch (this.sggbState.GameStage) {
            case "created":
                this.InitUIGobang();
                break;
            case "restarted":
                this.cleanupUIBoardGobang();
                this.InitImageChessboardCellsGobang();
                this.txtGobangPlayer1.setText(this.sggbState.PlayerId1);
                this.txtGobangPlayer2.setText("");
                this.txtGobangPlayerMoving.setText("");
                this.btnStartGobang.setVisible(!this.mainForm.tractorPlayer.isObserver && this.sggbState.PlayerId1 !== this.mainForm.tractorPlayer.MyOwnId);
                this.btnQuitGobang.setVisible([this.sggbState.PlayerId1, this.sggbState.PlayerId2].includes(this.mainForm.tractorPlayer.MyOwnId));
                break;
            case "joined":
                this.txtGobangPlayer2.setText(this.sggbState.PlayerId2);
                this.txtGobangPlayerMoving.setText(this.sggbState.PlayerId1);
                if (this.sggbState.PlayerIdMoving === this.mainForm.tractorPlayer.MyOwnId) {
                    this.imageChessboard.setInteractive({ useHandCursor: true });
                } else {
                    this.imageChessboard.disableInteractive();
                    this.btnStartGobang.setVisible(false);
                }
                this.btnQuitGobang.setVisible([this.sggbState.PlayerId1, this.sggbState.PlayerId2].includes(this.mainForm.tractorPlayer.MyOwnId));
                break;
            case "moved":
                this.ProcessMovedGobang();
                break;
            case "over":
                this.ProcessMovedGobang();
                this.txtGobangPlayerMoving.setText(`恭喜玩家\n【${this.sggbState.PlayerIdMoved}】\n获胜`);
                this.imageChessboard.disableInteractive();
                this.btnStartGobang.setVisible(!this.mainForm.tractorPlayer.isObserver);
                if (this.mainForm.enableSound) this.mainForm.gameScene.soundwin.play();
                break;
            default:
                break;
        }
    }

    private InitUIGobang() {
        this.mainForm.blurChat();
        this.hiddenGamesImages = [];
        let panelInfoWidth = 160;
        // chess board
        this.imageChessboard = this.mainForm.gameScene.add.sprite(this.mainForm.gameScene.coordinates.centerX - panelInfoWidth / 2, this.mainForm.gameScene.coordinates.centerY, 'chessboard');
        let cellBasePoint = this.imageChessboard.getTopLeft();
        this.gobangBoardOriginX = cellBasePoint.x + this.gobangBoardEdge;
        this.gobangBoardOriginY = cellBasePoint.y += this.gobangBoardEdge;
        this.imageChessboard.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            let tempX = pointer.x - this.gobangBoardOriginX;
            if (tempX < -17)
                tempX = -17;
            if (tempX > 507)
                tempX = 507;
            let tempY = pointer.y - this.gobangBoardOriginY;
            if (tempY < -17)
                tempY = -17;
            if (tempY > 507)
                tempY = 507;
            // very counter-intuitive: indexX comes from coordinate Y
            let indexRow = Math.abs(Math.round((tempY) / this.gobangBoardCell));
            let indexCol = Math.abs(Math.round((tempX) / this.gobangBoardCell));
            if (this.sggbState.ChessBoard[indexRow][indexCol] !== 0) {
                alert("bad move");
                return;
            }
            this.imageChessboard.disableInteractive();
            this.sggbState.LastMove = this.sggbState.CurMove;
            this.sggbState.CurMove = [indexRow, indexCol];
            this.sggbState.GameAction = "move";
            this.sggbState.PlayerIdMoved = this.sggbState.PlayerIdMoving;
            this.sggbState.PlayerIdMoving = this.sggbState.PlayerId1 === this.sggbState.PlayerIdMoved ? this.sggbState.PlayerId2 : this.sggbState.PlayerId1;
            this.UpdateGobang();
        });
        this.hiddenGamesImages.push(this.imageChessboard);

        // chess board cells
        this.InitImageChessboardCellsGobang();

        let infoBasePoint = this.imageChessboard.getTopRight();
        let panelInfo = this.mainForm.gameScene.add.sprite(infoBasePoint.x, infoBasePoint.y, 'chatPanel')
            .setOrigin(0, 0)
            .setDisplaySize(panelInfoWidth, this.imageChessboard.displayHeight)
            .setDepth(1);
        this.hiddenGamesImages.push(panelInfo);

        let infoSectionHeight = 60;
        let lblPlayer1 = this.mainForm.gameScene.add.text(infoBasePoint.x + panelInfoWidth / 2, infoBasePoint.y + 40, '玩家1')
            .setPadding(2)
            .setColor('black')
            .setStyle({ fontWeight: "bold" })
            .setFontSize(22)
            .setOrigin(0.5)
            .setDepth(2);
        this.hiddenGamesImages.push(lblPlayer1);

        let lblPlayer1Piece = this.mainForm.gameScene.add.sprite(infoBasePoint.x + panelInfoWidth / 2 - 50, infoBasePoint.y + 40, "gobangPieceBlackPlain", 0)
            .setDisplaySize(30, 30)
            .setDepth(2)
            .setOrigin(0.5);
        this.hiddenGamesImages.push(lblPlayer1Piece);

        this.txtGobangPlayer1 = this.mainForm.gameScene.add.text(infoBasePoint.x + panelInfoWidth / 2, infoBasePoint.y + 40 + infoSectionHeight, this.sggbState.PlayerId1)
            .setPadding(2)
            .setColor('blue')
            .setFontSize(18)
            .setOrigin(0.5)
            .setDepth(2);
        this.hiddenGamesImages.push(this.txtGobangPlayer1);

        let lblPlayer2 = this.mainForm.gameScene.add.text(infoBasePoint.x + panelInfoWidth / 2, infoBasePoint.y + 40 + infoSectionHeight * 2, '玩家2')
            .setPadding(2)
            .setColor('black')
            .setStyle({ fontWeight: "bold" })
            .setFontSize(22)
            .setOrigin(0.5)
            .setDepth(2);
        this.hiddenGamesImages.push(lblPlayer2);

        let lblPlayer2Piece = this.mainForm.gameScene.add.sprite(infoBasePoint.x + panelInfoWidth / 2 - 50, infoBasePoint.y + 40 + infoSectionHeight * 2, "gobangPieceWhitePlain", 0)
            .setDisplaySize(30, 30)
            .setDepth(2)
            .setOrigin(0.5);
        this.hiddenGamesImages.push(lblPlayer2Piece);

        this.txtGobangPlayer2 = this.mainForm.gameScene.add.text(infoBasePoint.x + panelInfoWidth / 2, infoBasePoint.y + 40 + infoSectionHeight * 3, '')
            .setPadding(2)
            .setColor('blue')
            .setFontSize(18)
            .setOrigin(0.5)
            .setDepth(2);
        this.hiddenGamesImages.push(this.txtGobangPlayer2);

        let lblPlayerMoving = this.mainForm.gameScene.add.text(infoBasePoint.x + panelInfoWidth / 2, infoBasePoint.y + 40 + infoSectionHeight * 4, '行动方')
            .setPadding(2)
            .setColor('black')
            .setStyle({ fontWeight: "bold" })
            .setFontSize(22)
            .setOrigin(0.5)
            .setDepth(2);
        this.hiddenGamesImages.push(lblPlayerMoving);
        this.txtGobangPlayerMoving = this.mainForm.gameScene.add.text(infoBasePoint.x + panelInfoWidth / 2, infoBasePoint.y + 40 + infoSectionHeight * 5, '')
            .setAlign("center")
            .setLineSpacing(5)
            .setPadding(2)
            .setColor('blue')
            .setFontSize(18)
            .setOrigin(0.5)
            .setDepth(2);
        this.hiddenGamesImages.push(this.txtGobangPlayerMoving);

        let infoBasePointBottom = this.imageChessboard.getBottomRight();
        // 开始按钮
        this.btnStartGobang = this.mainForm.gameScene.add.sprite(infoBasePointBottom.x + panelInfoWidth / 2, infoBasePointBottom.y - 100, 'gobangStartBtn')
            // 如果是我自己创建的游戏，则不需要“开始按钮”
            .setVisible(!this.mainForm.tractorPlayer.isObserver && this.sggbState.PlayerId1 !== this.mainForm.tractorPlayer.MyOwnId && this.sggbState.GameStage === "created")
            .setDepth(2)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.btnStartGobang.setScale(0.9);
            })
            .on('pointerup', () => {
                this.btnStartGobang.setScale(1);
                if (this.sggbState.GameStage === "over" && this.sggbState.PlayerIdWinner) {
                    this.sggbState = new SGGBState(this.mainForm);
                    this.sggbState.PlayerId1 = this.mainForm.tractorPlayer.MyOwnId;
                    this.sggbState.GameAction = "restart";
                    this.UpdateGobang();
                } else {
                    this.sggbState.PlayerId2 = this.mainForm.tractorPlayer.MyOwnId;
                    this.sggbState.GameAction = "join";
                    this.UpdateGobang();
                }
            });
        this.hiddenGamesImages.push(this.btnStartGobang);

        // 退出按钮
        this.btnQuitGobang = this.mainForm.gameScene.add.sprite(infoBasePointBottom.x + panelInfoWidth / 2, infoBasePointBottom.y - 40, 'gobangQuitBtn')
            // 只有加入了游戏的玩家才能退出
            .setVisible([this.sggbState.PlayerId1, this.sggbState.PlayerId2].includes(this.mainForm.tractorPlayer.MyOwnId))
            .setDepth(2)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.btnQuitGobang.setScale(0.9);
            })
            .on('pointerup', () => {
                this.btnQuitGobang.setScale(1);
                this.sggbState.GameAction = "quit";
                this.UpdateGobang();
            });
        this.hiddenGamesImages.push(this.btnQuitGobang);
    }

    private ProcessMovedGobang() {
        // update last move piece
        let LastMoveIndexRow = this.sggbState.LastMove[0];
        let LastMoveIndexCol = this.sggbState.LastMove[1];
        let lastMoveX = this.gobangBoardOriginX + this.gobangBoardCell * LastMoveIndexCol;
        let lastMoveY = this.gobangBoardOriginY + this.gobangBoardCell * LastMoveIndexRow;
        if (LastMoveIndexRow >= 0 && this.imageChessboardCells[LastMoveIndexRow][LastMoveIndexCol]) {
            this.imageChessboardCells[LastMoveIndexRow][LastMoveIndexCol].destroy();
            let lastPieceColor = this.gobangColorByID[this.sggbState.ChessBoard[LastMoveIndexRow][LastMoveIndexCol]];
            this.imageChessboardCells[LastMoveIndexRow][LastMoveIndexCol] = this.mainForm.gameScene.add.sprite(lastMoveX, lastMoveY, lastPieceColor, 0)
                .setDisplaySize(30, 30)
                .setOrigin(0.5);
            this.hiddenGamesImages.push(this.imageChessboardCells[LastMoveIndexRow][LastMoveIndexCol]);
        }

        // update current move piece
        let CurMoveIndexRow = this.sggbState.CurMove[0];
        let CurMoveIndexCol = this.sggbState.CurMove[1];
        if (this.imageChessboardCells[CurMoveIndexRow][CurMoveIndexCol]) {
            this.imageChessboardCells[CurMoveIndexRow][CurMoveIndexCol].destroy();
        }
        let moveX = this.gobangBoardOriginX + this.gobangBoardCell * CurMoveIndexCol;
        let moveY = this.gobangBoardOriginY + this.gobangBoardCell * CurMoveIndexRow;
        let curPieceColor = this.gobangColorByID[this.sggbState.ChessBoard[CurMoveIndexRow][CurMoveIndexCol]];
        this.imageChessboardCells[CurMoveIndexRow][CurMoveIndexCol] = this.mainForm.gameScene.add.sprite(moveX, moveY, `${curPieceColor}0`, 0)
            .setDisplaySize(30, 30)
            .setOrigin(0.5);
        this.hiddenGamesImages.push(this.imageChessboardCells[CurMoveIndexRow][CurMoveIndexCol]);
        if (this.mainForm.enableSound) this.mainForm.gameScene.soundclickwa.play();

        this.txtGobangPlayerMoving.setText(this.sggbState.PlayerIdMoving);
        if (this.sggbState.PlayerIdMoving === this.mainForm.tractorPlayer.MyOwnId) {
            this.imageChessboard.setInteractive({ useHandCursor: true });
        }
    }

    public cleanupUIBoardGobang() {
        this.imageChessboardCells.forEach((row: any[]) => {
            row.forEach(cell => {
                if (cell) {
                    cell.destroy();
                }
            })
        })
        this.imageChessboardCells = [];
    }

    private InitImageChessboardCellsGobang() {
        this.imageChessboardCells = [];
        for (let i = 0; i < 15; i++) {
            let row: any = [];
            this.imageChessboardCells.push(row);
        }
    }

    private DrawPiecesGobang() {
        for (let i = 0; i < this.sggbState.ChessBoard.length; i++) {
            for (let j = 0; j < this.sggbState.ChessBoard[i].length; j++) {
                let moveX = this.gobangBoardOriginX + this.gobangBoardCell * j;
                let moveY = this.gobangBoardOriginY + this.gobangBoardCell * i;
                let pieceColor = this.gobangColorByID[this.sggbState.ChessBoard[i][j]];
                if (!pieceColor) continue;
                let pieceTypeID = 0;
                if (this.sggbState.LastMove && this.sggbState.LastMove[0] && this.sggbState.LastMove[0] === i && this.sggbState.LastMove[1] === j) {
                    pieceTypeID = 1;
                }
                this.imageChessboardCells[i][j] = this.mainForm.gameScene.add.sprite(moveX, moveY, pieceColor, pieceTypeID).setOrigin(0.5);
                this.hiddenGamesImages.push(this.imageChessboardCells[i][j]);
            }
        }
    }
}
