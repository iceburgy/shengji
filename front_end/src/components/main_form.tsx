import { GameScene } from './game_scene';
import { RoomSetting } from './room_setting';
import { CurrentPoker } from './current_poker';
import { GameState } from './game_state';
import { CurrentHandState } from './current_hand_state';
import { CurrentTrickState } from './current_trick_state';
import { PlayerLocalCache } from './player_local_cache';
import { CommonMethods } from './common_methods';
import { PlayerEntity } from './player_entity';
import { TractorPlayer } from './tractor_player';
import { NONE } from 'phaser';
import { Coordinates } from './coordinates';
import { SuitEnums } from './suit_enums';
import { DrawingFormHelper } from './drawing_form_helper';
import { TractorRules } from './tractor_rules';
import { ShowingCardsValidationResult } from './showing_cards_validation_result';
import { Algorithm } from './algorithm';
import { PokerHelper } from './poker_helper';
import { RoomState } from './room_state';
import { IDBHelper } from './idb_helper';
import { ReplayEntity } from './replay_entity';
import { GameReplayScene } from './game_replay_scene';
import { FileHelper } from './file_helper';
import Cookies from 'universal-cookie';
import { SGCSPlayer } from './sg_cs_player';
import { SGDrawingHelper } from './sg_drawing_helper';
import { SGCSState } from './sg_cs_state';

const ReadyToStart_REQUEST = "ReadyToStart"
const ToggleIsRobot_REQUEST = "ToggleIsRobot"
const ObserveNext_REQUEST = "ObserveNext"
const ExitRoom_REQUEST = "ExitRoom"
const StoreDiscardedCards_REQUEST = "StoreDiscardedCards"
const PlayerShowCards_REQUEST = "PlayerShowCards"
const ValidateDumpingCards_REQUEST = "ValidateDumpingCards"
const CardsReady_REQUEST = "CardsReady"
const ResumeGameFromFile_REQUEST = "ResumeGameFromFile"
const RandomSeat_REQUEST = "RandomSeat"
const SwapSeat_REQUEST = "SwapSeat"
const PLAYER_ENTER_ROOM_REQUEST = "PlayerEnterRoom"
const PLAYER_EXIT_AND_ENTER_ROOM_REQUEST = "ExitAndEnterRoom"
const PLAYER_EXIT_AND_OBSERVE_REQUEST = "ExitAndObserve"
const cookies = new Cookies();

export class MainForm {
    public gameScene: GameScene | GameReplayScene
    public tractorPlayer: TractorPlayer
    public btnShowLastTrick: Phaser.GameObjects.Text
    public btnReady: Phaser.GameObjects.Text
    public btnRobot: Phaser.GameObjects.Text
    public btnExitRoom: Phaser.GameObjects.Text
    public btnExitAndObserve: Phaser.GameObjects.Text
    public isSendEmojiEnabled: boolean
    public btnPig: Phaser.GameObjects.Text

    public lblNickNames: Phaser.GameObjects.Text[]
    public lblStarters: Phaser.GameObjects.Text[]
    public lblObservers: Phaser.GameObjects.Text
    public roomNameText: Phaser.GameObjects.Text;
    public roomOwnerText: Phaser.GameObjects.Text;

    public PlayerPosition: any
    public PositionPlayer: any
    public myCardIsReady: boolean[]
    public SelectedCards: number[]
    public cardsOrderNumber: number

    public enableSound: boolean
    public drawingFormHelper: DrawingFormHelper
    public sgDrawingHelper: SGDrawingHelper
    public IsDebug: boolean
    public timerIntervalID: any[]
    public timerCountDown: number
    public timerImage: Phaser.GameObjects.Text
    public modalForm: any
    public firstWinNormal = 1;
    public firstWinBySha = 3;
    public chatForm: any
    public sgcsPlayer: SGCSPlayer;
    public rightSideButtonDepth = 1;

    constructor(gs: GameScene) {
        this.gameScene = gs
        this.tractorPlayer = new TractorPlayer(this)
        this.drawingFormHelper = new DrawingFormHelper(this)
        this.sgDrawingHelper = new SGDrawingHelper(this)
        this.sgcsPlayer = new SGCSPlayer(this.tractorPlayer.MyOwnId)
        this.PlayerPosition = {}
        this.PositionPlayer = {}
        this.myCardIsReady = []
        this.cardsOrderNumber = 0
        this.enableSound = true
        this.IsDebug = false
        this.SelectedCards = []
        this.timerIntervalID = []
        this.timerCountDown = 0
        this.isSendEmojiEnabled = true;

        // 房间信息
        this.roomNameText = this.gameScene.add.text(this.gameScene.coordinates.roomNameTextPosition.x, this.gameScene.coordinates.roomNameTextPosition.y, "")
            .setVisible(false)
            .setColor("orange")
            .setFontSize(20)
            .setShadow(2, 2, "#333333", 2, true, true);
        this.roomOwnerText = this.gameScene.add.text(this.gameScene.coordinates.roomOwnerTextPosition.x, this.gameScene.coordinates.roomOwnerTextPosition.y, "")
            .setVisible(false)
            .setColor("orange")
            .setFontSize(20)
            .setShadow(2, 2, "#333333", 2, true, true);
        this.gameScene.roomUIControls.texts.push(this.roomNameText)
        this.gameScene.roomUIControls.texts.push(this.roomOwnerText)

        // 回看上轮按钮
        this.btnShowLastTrick = this.gameScene.add.text(this.gameScene.coordinates.btnShowLastTrickPosition.x, this.gameScene.coordinates.btnShowLastTrickPosition.y, '上轮')
            .setDepth(this.rightSideButtonDepth)
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.HandleRightClickEmptyArea())
            .on('pointerover', () => {
                this.btnShowLastTrick.setStyle({ backgroundColor: 'lightblue' })
            })
            .on('pointerout', () => {
                this.btnShowLastTrick.setStyle({ backgroundColor: 'gray' })
            })
        this.gameScene.roomUIControls.texts.push(this.btnShowLastTrick)

        // 就绪按钮
        this.btnReady = this.gameScene.add.text(this.gameScene.coordinates.btnReadyPosition.x, this.gameScene.coordinates.btnReadyPosition.y, '就绪')
            .setDepth(this.rightSideButtonDepth)
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.btnReady_Click())
            .on('pointerover', () => {
                this.btnReady.setStyle({ backgroundColor: 'lightblue' })
            })
            .on('pointerout', () => {
                this.btnReady.setStyle({ backgroundColor: 'gray' })
            })
        this.gameScene.roomUIControls.texts.push(this.btnReady)

        // 托管按钮
        this.btnRobot = this.gameScene.add.text(this.gameScene.coordinates.btnRobotPosition.x, this.gameScene.coordinates.btnRobotPosition.y, '托管')
            .setDepth(this.rightSideButtonDepth)
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.btnRobot_Click())
            .on('pointerover', () => {
                this.btnRobot.setStyle({ backgroundColor: 'lightblue' })
            })
            .on('pointerout', () => {
                this.btnRobot.setStyle({ backgroundColor: 'gray' })
            })
        this.gameScene.roomUIControls.texts.push(this.btnRobot)

        // 退出按钮
        this.btnExitRoom = this.gameScene.add.text(this.gameScene.coordinates.btnExitRoomPosition.x, this.gameScene.coordinates.btnExitRoomPosition.y, '退出')
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.btnExitRoom_Click())
            .on('pointerover', () => {
                this.btnExitRoom.setStyle({ backgroundColor: 'lightblue' })
            })
            .on('pointerout', () => {
                this.btnExitRoom.setStyle({ backgroundColor: 'gray' })
            })

        // 上树按钮
        this.btnExitAndObserve = this.gameScene.add.text(this.gameScene.coordinates.btnExitAndObservePosition.x, this.gameScene.coordinates.btnExitAndObservePosition.y, '上树')
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setVisible(false)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.ExitAndObserve())
            .on('pointerover', () => {
                this.btnExitAndObserve.setStyle({ backgroundColor: 'lightblue' })
            })
            .on('pointerout', () => {
                this.btnExitAndObserve.setStyle({ backgroundColor: 'gray' })
            })
        this.gameScene.roomUIControls.texts.push(this.btnExitAndObserve)

        // 确定按钮
        this.btnPig = this.gameScene.add.text(this.gameScene.coordinates.btnPigPosition.x, this.gameScene.coordinates.btnPigPosition.y, '确定')
            .setColor('gray')
            .setFontSize(30)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .disableInteractive()
            .on('pointerup', () => this.btnPig_Click())
            .on('pointerover', () => {
                this.btnPig.setStyle({ backgroundColor: 'lightblue' })
            })
            .on('pointerout', () => {
                this.btnPig.setStyle({ backgroundColor: 'gray' })
            })
        this.gameScene.roomUIControls.texts.push(this.btnPig)

        // 昵称
        this.lblNickNames = []
        for (let i = 0; i < 4; i++) {
            var lblNickName = this.gameScene.add.text(this.gameScene.coordinates.playerTextPositions[i].x, this.gameScene.coordinates.playerTextPositions[i].y, "")
                .setColor('white')
                .setFontSize(30)
                .setPadding(10)
                .setShadow(2, 2, "#333333", 2, true, true)
                .setVisible(false)
            if (i == 0) {
                lblNickName.setText(this.gameScene.playerName)
                    .setVisible(true)
                    .setShadow(2, 2, "#333333", 2, true, true)
                    .setStyle({ backgroundColor: 'rgb(105,105,105)' })
                    .setInteractive({ useHandCursor: true })
                    .on('pointerover', () => {
                        this.lblNickNames[i].setStyle({ backgroundColor: 'lightblue' })
                    })
                    .on('pointerout', () => {
                        this.lblNickNames[i].setStyle({ backgroundColor: 'rgb(105,105,105)' })
                    })
                    .on('pointerup', () => this.lblNickName_Click())
            }
            if (i == 1) {
                lblNickName.setStyle({ fixedWidth: 300 })
                lblNickName.setStyle({ align: 'right' })
            }
            this.lblNickNames[i] = lblNickName
            if (i != 0) {
                this.gameScene.roomUIControls.texts.push(lblNickName)
            }
        }

        // 旁观玩家昵称
        let ox = this.gameScene.coordinates.playerTextPositions[0].x + this.lblNickNames[0].width + this.gameScene.coordinates.controlButtonOffset;
        let oy = this.gameScene.coordinates.playerTextPositions[0].y + this.lblNickNames[0].height / 2;
        this.lblObservers = this.gameScene.add.text(ox, oy, "")
            .setColor('white')
            .setFontSize(15)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setVisible(false)
        this.gameScene.roomUIControls.texts.push(this.lblObservers)

        // 状态
        this.lblStarters = []
        for (let i = 0; i < 4; i++) {
            var lblStarter = this.gameScene.add.text(this.gameScene.coordinates.playerStarterPositions[i].x, this.gameScene.coordinates.playerStarterPositions[i].y, "")
                .setColor('orange')
                .setFontSize(30)
                .setPadding(10)
                .setShadow(2, 2, "#333333", 2, true, true)
                .setVisible(false)
            if (i == 1) {
                lblStarter.setStyle({ fixedWidth: 300 })
                lblStarter.setStyle({ align: 'right' })
            } else if (i == 0 || i == 2) {
                lblStarter.setStyle({ fixedWidth: 200 })
                lblStarter.setStyle({ align: 'right' })
            }
            this.lblStarters[i] = lblStarter
            this.gameScene.roomUIControls.texts.push(lblStarter)
        }

        this.timerImage = this.gameScene.add.text(this.gameScene.coordinates.countDownPosition.x, this.gameScene.coordinates.countDownPosition.y, "")
            .setColor("orange")
            .setFontSize(this.gameScene.coordinates.countDownSzie)
            .setStyle({ fontWeight: "bold" })
            .setVisible(false)

        this.gameScene.input.on('pointerdown', (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
            // 右键点空白区
            if ((!currentlyOver || currentlyOver.length == 0) && pointer.rightButtonDown()) {
                this.HandleRightClickEmptyArea();
            }
            // 任意键
            this.resetGameRoomUI();
        });

        // 快捷键
        this.gameScene.input.keyboard.on('keydown', this.shortcutKeyDownEventhandler, this)
        this.gameScene.input.keyboard.on('keyup', this.shortcutKeyUpEventhandler, this)
    }

    public HandleRightClickEmptyArea() {
        if (this.tractorPlayer.mainForm.gameScene.isReplayMode) return;
        if (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing ||
            this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards) {
            this.tractorPlayer.ShowLastTrickCards = !this.tractorPlayer.ShowLastTrickCards;
            if (this.tractorPlayer.ShowLastTrickCards) {
                this.ShowLastTrickAndTumpMade();
            }
            else {
                this.PlayerCurrentTrickShowedCards();
            }
        }
        //一局结束时右键查看最后一轮各家所出的牌，缩小至一半，放在左下角
        else if (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Ending) {
            this.tractorPlayer.ShowLastTrickCards = !this.tractorPlayer.ShowLastTrickCards;
            if (this.tractorPlayer.ShowLastTrickCards) {
                this.ShowLastTrickAndTumpMade();
            }
            else {
                this.drawingFormHelper.DrawFinishedSendedCards()
            }
        }
        this.btnShowLastTrick.setText(this.tractorPlayer.ShowLastTrickCards ? "还原" : "上轮");
    }

    public NewPlayerReadyToStart(readyToStart: boolean) {
        if (CommonMethods.GetReadyCount(this.tractorPlayer.CurrentGameState.Players) < 4) {
            this.btnReady.setInteractive({ useHandCursor: true })
            this.btnReady.setColor('white')
            this.btnExitAndObserve.setInteractive({ useHandCursor: true })
            this.btnExitAndObserve.setColor('white')
        } else {
            this.btnReady.disableInteractive()
            this.btnReady.setColor('gray')
            this.btnExitAndObserve.disableInteractive()
            this.btnExitAndObserve.setColor('gray')
        }
        this.btnReady.setText(readyToStart ? "取消" : "就绪")
        this.setStartLabels()
    }

    public PlayerToggleIsRobot(isRobot: boolean) {
        this.btnRobot.setText(isRobot ? "取消" : "托管")
        this.setStartLabels()

        let shouldTrigger = isRobot && isRobot != this.IsDebug;
        this.IsDebug = isRobot;

        if (shouldTrigger) {
            if (!this.tractorPlayer.CurrentTrickState.IsStarted()) this.RobotPlayStarting();
            else this.RobotPlayFollowing();
        }
    }

    public PlayersTeamMade() {
        //set player position
        this.PlayerPosition = {}
        this.PositionPlayer = {}
        var nextPlayer: string = this.tractorPlayer.PlayerId;
        var postion = 1;
        this.PlayerPosition[nextPlayer] = postion;
        this.PositionPlayer[postion] = nextPlayer;
        nextPlayer = CommonMethods.GetNextPlayerAfterThePlayer(this.tractorPlayer.CurrentGameState.Players, nextPlayer).PlayerId;
        while (nextPlayer != this.tractorPlayer.PlayerId) {
            postion++;
            this.PlayerPosition[nextPlayer] = postion;
            this.PositionPlayer[postion] = nextPlayer;
            nextPlayer = CommonMethods.GetNextPlayerAfterThePlayer(this.tractorPlayer.CurrentGameState.Players, nextPlayer).PlayerId;
        }
    }

    public NewPlayerJoined(meJoined: boolean) {
        if (this.gameScene.isInGameHall()) {
            this.destroyGameHall()
            this.init();
        }

        this.sgDrawingHelper.myPlayerIndex = CommonMethods.GetPlayerIndexByID(this.tractorPlayer.CurrentGameState.Players, this.tractorPlayer.MyOwnId);
        this.sgcsPlayer.PlayerIndex = this.sgDrawingHelper.myPlayerIndex;

        this.roomNameText.setVisible(true)
        this.roomOwnerText.setVisible(true)

        this.btnExitRoom.setVisible(true)
        this.btnShowLastTrick.setVisible(true)
        this.btnReady.setVisible(!this.tractorPlayer.isObserver)
        this.btnExitAndObserve.setVisible(!this.tractorPlayer.isObserver)
        this.btnRobot.setVisible(!this.tractorPlayer.isObserver)

        var curIndex = CommonMethods.GetPlayerIndexByID(this.tractorPlayer.CurrentGameState.Players, this.tractorPlayer.PlayerId)
        this.PlayerPosition = {};
        this.PositionPlayer = {};
        this.destroyImagesChair();
        for (let i = 0; i < 4; i++) {
            let lblNickName = this.lblNickNames[i];
            lblNickName.setVisible(true)
            let p = this.tractorPlayer.CurrentGameState.Players[curIndex];
            let isEmptySeat = !p;
            if (isEmptySeat) {
                lblNickName.setText("");
                let chairImage = this.gameScene.add.image(this.gameScene.coordinates.playerTextPositions[i].x + (i == 1 ? 240 : 0), this.gameScene.coordinates.playerTextPositions[i].y, 'pokerChair')
                    .setOrigin(0, 0)
                    .setDisplaySize(60, 60)

                // 旁观：切换视角，坐下
                if (this.tractorPlayer.isObserver) {
                    chairImage.setInteractive({ useHandCursor: true })
                        .on('pointerup', () => {
                            let pos = i + 1;
                            let playerIndex = CommonMethods.GetPlayerIndexByPos(this.tractorPlayer.CurrentGameState.Players, this.tractorPlayer.PlayerId, pos);
                            this.ExitRoomAndEnter(playerIndex);
                        })
                        .on('pointerover', () => {
                            chairImage.y -= 3
                        })
                        .on('pointerout', () => {
                            chairImage.y += 3
                        })
                }
                this.gameScene.roomUIControls.imagesChair.push(chairImage)
            } else {
                //set player position
                this.PlayerPosition[p.PlayerId] = i + 1;
                this.PositionPlayer[i + 1] = p.PlayerId;

                var nickNameText = p.PlayerId;
                lblNickName.setText(`${nickNameText}`);

                if (p.Observers && p.Observers.length > 0) {
                    var obNameText = "";
                    p.Observers.forEach(ob => {
                        var newLine = i == 0 ? "" : "\n";
                        obNameText += `${newLine}【${ob}】`
                    });

                    if (i === 0) {
                        let ox = this.gameScene.coordinates.playerTextPositions[0].x + this.lblNickNames[0].width + this.gameScene.coordinates.controlButtonOffset;
                        this.lblObservers.setText(`${obNameText}`)
                            .setX(ox);
                        this.lblObservers.setVisible(true)
                    } else {
                        lblNickName.setText(`${nickNameText}${obNameText}`);
                    }
                } else {
                    if (i === 0) {
                        this.lblObservers.setText("");
                        this.lblObservers.setVisible(false);
                    }
                }

                if (this.tractorPlayer.isObserver && i !== 0) {
                    // have to clear all listeners, otherwise multiple ones will be added and triggered multiple times
                    lblNickName.removeAllListeners();
                    lblNickName.setInteractive({ useHandCursor: true })
                        .on('pointerup', () => {
                            lblNickName.setColor('white')
                                .setFontSize(30)
                            let pos = i + 1;
                            this.destroyImagesChair();
                            this.observeByPosition(pos);
                        })
                        .on('pointerover', () => {
                            lblNickName.setColor('yellow')
                                .setFontSize(40)
                        })
                        .on('pointerout', () => {
                            lblNickName.setColor('white')
                                .setFontSize(30)
                        })
                }
            }

            curIndex = (curIndex + 1) % 4
        }
        this.loadEmojiForm();

        /*
            bool isHelpSeen = FormSettings.GetSettingBool(FormSettings.KeyIsHelpSeen);
            if (!isHelpSeen && meJoined)
            {
                this.ToolStripMenuItemUserManual.PerformClick();
            }
        */
    }

    public ExitRoomAndEnter(posID: number) {
        this.destroyGameRoom();
        this.gameScene.sendMessageToServer(PLAYER_EXIT_AND_ENTER_ROOM_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify({
            roomID: -1,
            posID: posID,
        }))
    }

    public ExitAndObserve() {
        if (!this.btnExitAndObserve || !this.btnExitAndObserve.input.enabled) return;
        this.btnExitAndObserve.disableInteractive()
        this.btnExitAndObserve.setColor('gray')
        this.destroyGameRoom();
        this.gameScene.sendMessageToServer(PLAYER_EXIT_AND_OBSERVE_REQUEST, this.tractorPlayer.MyOwnId, "");
    }

    public ReenterOrResumeEvent() {
        this.drawingFormHelper.DrawSidebarFull();
        this.tractorPlayer.playerLocalCache.ShowedCardsInCurrentTrick = CommonMethods.deepCopy<any>(this.tractorPlayer.CurrentTrickState.ShowedCards);
        if (this.tractorPlayer.CurrentTrickState.ShowedCards && Object.keys(this.tractorPlayer.CurrentTrickState.ShowedCards).length == 4) {
            this.tractorPlayer.playerLocalCache.WinnderID = TractorRules.GetWinner(this.tractorPlayer.CurrentTrickState);
            this.tractorPlayer.playerLocalCache.WinResult = this.IsWinningWithTrump(this.tractorPlayer.CurrentTrickState, this.tractorPlayer.playerLocalCache.WinnderID);
        }
        this.PlayerCurrentTrickShowedCards();
        this.drawingFormHelper.ResortMyHandCards();
        this.DrawDiscardedCardsCaller();
    }

    public TrumpChanged(currentHandState: CurrentHandState) {
        if (SuitEnums.HandStep.DistributingCards <= this.tractorPlayer.CurrentHandState.CurrentHandStep &&
            this.tractorPlayer.CurrentHandState.CurrentHandStep < SuitEnums.HandStep.DistributingLast8Cards) {
            if (this.enableSound) this.gameScene.soundbiyue1.play()
        }
        this.tractorPlayer.CurrentHandState.CloneFrom(currentHandState)
        this.drawingFormHelper.DrawSidebarFull()
        if (this.tractorPlayer.CurrentHandState.CurrentHandStep < SuitEnums.HandStep.DistributingLast8Cards) {
            this.drawingFormHelper.TrumpMadeCardsShow()
        }
        this.drawingFormHelper.reDrawToolbar()
    }

    public destroyGameRoom() {
        this.tractorPlayer.PlayerId = this.tractorPlayer.MyOwnId;
        this.tractorPlayer.isObserver = false;
        this.lblNickNames[0].setText(this.tractorPlayer.MyOwnId)
        this.drawingFormHelper.destroyAllCards()
        this.drawingFormHelper.destroyAllShowedCards()
        this.tractorPlayer.destroyAllClientMessages()
        this.drawingFormHelper.destroyToolbar()
        this.drawingFormHelper.destroySidebar()
        this.drawingFormHelper.destroyScoreImageAndCards()
        this.drawingFormHelper.destroyLast8Cards()

        //重置状态
        this.tractorPlayer.CurrentGameState = new GameState();
        this.tractorPlayer.CurrentHandState = new CurrentHandState(this.tractorPlayer.CurrentGameState);

        this.gameScene.roomUIControls.images.forEach(image => {
            image.setVisible(false)
        })
        this.destroyImagesChair();
        this.gameScene.roomUIControls.texts.forEach(text => {
            text.setVisible(false)
        })
        for (let i = 1; i < 4; i++) {
            this.lblNickNames[i].removeAllListeners();
            this.lblNickNames[i].disableInteractive();
        }
        if (this.sgDrawingHelper.IsPlayingGame) {
            this.sgDrawingHelper.hitBomb(this.sgDrawingHelper.players.children.entries[this.sgDrawingHelper.myPlayerIndex], undefined);
            this.sgDrawingHelper.destroyGame(0);
        }
    }

    public destroyImagesChair() {
        if (this.gameScene.roomUIControls.imagesChair) {
            this.gameScene.roomUIControls.imagesChair.forEach(image => {
                image.destroy();
            })
        }
    }

    public PlayerOnGetCard(cardNumber: number) {

        //发牌播放提示音
        if (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DistributingCards && this.enableSound) {
            if (this.enableSound) this.gameScene.sounddraw.play()
        }

        this.drawingFormHelper.IGetCard();

        //托管代打：亮牌
        if (this.IsDebug && (this.tractorPlayer.CurrentRoomSetting.IsFullDebug || this.tractorPlayer.CurrentRoomSetting.AllowRobotMakeTrump) && !this.tractorPlayer.isObserver) {
            var availableTrump = this.tractorPlayer.AvailableTrumps();
            let trumpToExpose: number = Algorithm.TryExposingTrump(availableTrump, this.tractorPlayer.CurrentPoker, this.tractorPlayer.CurrentRoomSetting.IsFullDebug);
            if (trumpToExpose == SuitEnums.Suit.None) return;

            var next = this.tractorPlayer.CurrentHandState.TrumpExposingPoker + 1;
            if (trumpToExpose == SuitEnums.Suit.Joker) {
                if (this.tractorPlayer.CurrentPoker.BlackJoker() == 2)
                    next = SuitEnums.TrumpExposingPoker.PairBlackJoker;
                else if (this.tractorPlayer.CurrentPoker.RedJoker() == 2)
                    next = SuitEnums.TrumpExposingPoker.PairRedJoker;
            }
            this.tractorPlayer.ExposeTrump(next, trumpToExpose);
        }
    }

    public AllCardsGot() {
        this.drawingFormHelper.ResortMyHandCards()
    }
    public ShowingCardBegan() {
        this.DiscardingLast8();
        this.drawingFormHelper.destroyToolbar();
        this.drawingFormHelper.destroyAllShowedCards();
        this.tractorPlayer.destroyAllClientMessages();

        this.drawingFormHelper.DrawScoreImageAndCards();

        //出牌开始前，去掉不需要的controls
        // this.btnSurrender.Visible = false;
        // this.btnRiot.Visible = false;

    }

    public DistributingLast8Cards() {
        this.tractorPlayer.destroyAllClientMessages()
        //先去掉反牌按钮，再放发底牌动画
        this.drawingFormHelper.destroyToolbar();
        //重画手牌，从而把被提升的自己亮的牌放回去
        this.drawingFormHelper.ResortMyHandCards();

        let position = this.PlayerPosition[this.tractorPlayer.CurrentHandState.Last8Holder];
        //自己摸底不用画
        if (position > 1) {
            this.drawingFormHelper.DrawDistributingLast8Cards(position);
        }
        else {
            //播放摸底音效
            if (this.enableSound) this.gameScene.sounddrawx.play();
        }

        if (this.tractorPlayer.isObserver) {
            return;
        }

        //摸牌结束，如果处于托管状态，则取消托管
        if (this.btnRobot.text == "取消" && !this.tractorPlayer.CurrentRoomSetting.IsFullDebug) {
            this.btnRobot_Click()
        }

        //摸牌结束，如果允许投降，则显示投降按钮
        if (this.tractorPlayer.CurrentRoomSetting.AllowSurrender) {
            // this.btnSurrender.Visible = true;
        }

        //仅允许台下的玩家可以革命
        // if (!this.ThisPlayer.CurrentGameState.ArePlayersInSameTeam(this.ThisPlayer.CurrentHandState.Starter, this.ThisPlayer.PlayerId))
        // {
        //     //摸牌结束，如果允许分数革命，则判断是否该显示革命按钮
        //     int riotScoreCap = ThisPlayer.CurrentRoomSetting.AllowRiotWithTooFewScoreCards;
        //     if (ThisPlayer.CurrentPoker.GetTotalScore() <= riotScoreCap)
        //     {
        //         this.btnRiot.Visible = true;
        //     }

        //     //摸牌结束，如果允许主牌革命，则判断是否该显示革命按钮
        //     int riotTrumpCap = ThisPlayer.CurrentRoomSetting.AllowRiotWithTooFewTrumpCards;
        //     if (ThisPlayer.CurrentPoker.GetMasterCardsCount() <= riotTrumpCap && ThisPlayer.CurrentHandState.Trump != Suit.Joker)
        //     {
        //         this.btnRiot.Visible = true;
        //     }
        // }
    }

    public StartGame() {
        this.tractorPlayer.CurrentPoker = new CurrentPoker()
        this.tractorPlayer.CurrentPoker.Rank = this.tractorPlayer.CurrentHandState.Rank;

        //游戏开始前重置各种变量
        this.tractorPlayer.ShowLastTrickCards = false;
        this.tractorPlayer.playerLocalCache = new PlayerLocalCache();
        // this.btnSurrender.Visible = false;
        // this.btnRiot.Visible = false;
        this.tractorPlayer.CurrentTrickState.serverLocalCache.lastShowedCards = {}
        this.timerCountDown = 0;
        this.btnPig.setVisible(false);

        this.init();
    }

    public DiscardingLast8() {
        // Graphics g = Graphics.FromImage(bmp);

        // g.DrawImage(image, 200 + drawingFormHelper.offsetCenterHalf, 186 + drawingFormHelper.offsetCenterHalf, 85 * drawingFormHelper.scaleDividend, 96 * drawingFormHelper.scaleDividend);
        // Refresh();
        // g.Dispose();

        //托管代打：埋底
        if (this.tractorPlayer.CurrentRoomSetting.IsFullDebug && this.IsDebug && !this.tractorPlayer.isObserver) {
            if (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards &&
                this.tractorPlayer.CurrentHandState.Last8Holder == this.tractorPlayer.PlayerId) //如果等我扣牌
            {
                this.SelectedCards = []
                Algorithm.ShouldSelectedLast8Cards(this.SelectedCards, this.tractorPlayer.CurrentPoker);
                if (this.SelectedCards.length == 8) {
                    this.ToDiscard8Cards();
                }
                else {
                    alert(`failed to auto select last 8 cards: ${this.SelectedCards}, please manually select`)
                }
            }
        }
    }

    public Last8Discarded() {
        if (this.enableSound) this.gameScene.soundtie.play()

        this.drawingFormHelper.DrawDiscardedCardsBackground();

        if (this.tractorPlayer.isObserver && this.tractorPlayer.CurrentHandState.Last8Holder == this.tractorPlayer.PlayerId) {
            let tempCP = this.tractorPlayer.CurrentHandState.PlayerHoldingCards[this.tractorPlayer.PlayerId]
            this.tractorPlayer.CurrentPoker.CloneFrom(tempCP);
            this.drawingFormHelper.ResortMyHandCards();
        }
        this.DrawDiscardedCardsCaller();
    }

    public DrawDiscardedCardsCaller() {
        if (this.tractorPlayer.CurrentPoker != null && this.tractorPlayer.CurrentPoker.Count() > 0 &&
            this.tractorPlayer.CurrentHandState.Last8Holder == this.tractorPlayer.PlayerId &&
            this.tractorPlayer.CurrentHandState.DiscardedCards != null &&
            this.tractorPlayer.CurrentHandState.DiscardedCards.length == 8) {
            this.drawingFormHelper.DrawDiscardedCards();
        }
    }

    public HandEnding() {
        this.drawingFormHelper.DrawFinishedSendedCards()
    }

    public StarterChangedEvent() {
        this.setStartLabels()
    }

    public StarterFailedForTrump() {
        this.drawingFormHelper.DrawSidebarFull();

        this.drawingFormHelper.ResortMyHandCards();

        this.drawingFormHelper.reDrawToolbar();
    }

    public ObservePlayerByIDEvent() {
        let tempCP = this.tractorPlayer.CurrentHandState.PlayerHoldingCards[this.tractorPlayer.PlayerId]
        this.tractorPlayer.CurrentPoker.CloneFrom(tempCP);
        if (this.tractorPlayer.isObserverChanged) {
            this.drawingFormHelper.ResortMyHandCards();
            // DrawDiscardedCardsCaller();

            this.drawingFormHelper.DrawSidebarFull();

            this.tractorPlayer.isObserverChanged = false;
        }
    }

    //检查当前出牌者的牌是否为大牌：0 - 否；1 - 是；2 - 是且为吊主；3 - 是且为主毙牌
    private IsWinningWithTrump(trickState: CurrentTrickState, playerID: string): number {
        let isLeaderTrump = PokerHelper.IsTrump(trickState.LeadingCards()[0], this.tractorPlayer.CurrentHandState.Trump, this.tractorPlayer.CurrentHandState.Rank);
        if (playerID == trickState.Learder) {
            if (isLeaderTrump) return 2;
            else return 1;
        }
        let winnerID = TractorRules.GetWinner(trickState);
        if (playerID == winnerID) {
            let isWinnerTrump = PokerHelper.IsTrump(trickState.ShowedCards[winnerID][0], this.tractorPlayer.CurrentHandState.Trump, this.tractorPlayer.CurrentHandState.Rank);
            if (!isLeaderTrump && isWinnerTrump) return 3;
            return 1;
        }
        return 0;
    }

    public PlayerShowedCards() {
        if (!this.tractorPlayer.CurrentHandState.PlayerHoldingCards[this.tractorPlayer.CurrentTrickState.Learder]) return;

        //如果新的一轮开始，重置缓存信息
        if (this.tractorPlayer.CurrentTrickState.CountOfPlayerShowedCards() == 1) {
            this.tractorPlayer.playerLocalCache = new PlayerLocalCache();
        }

        let curPoker = new CurrentPoker()
        curPoker.CloneFrom(this.tractorPlayer.CurrentHandState.PlayerHoldingCards[this.tractorPlayer.CurrentTrickState.Learder])
        if (curPoker.Count() == 0) {
            this.tractorPlayer.playerLocalCache.isLastTrick = true;
        }

        let latestPlayer = this.tractorPlayer.CurrentTrickState.LatestPlayerShowedCard();
        this.tractorPlayer.playerLocalCache.ShowedCardsInCurrentTrick = CommonMethods.deepCopy<any>(this.tractorPlayer.CurrentTrickState.ShowedCards)

        let winResult = this.IsWinningWithTrump(this.tractorPlayer.CurrentTrickState, latestPlayer);
        let position = this.PlayerPosition[latestPlayer];
        let showedCards: number[] = this.tractorPlayer.CurrentTrickState.ShowedCards[latestPlayer]
        //如果大牌变更，更新缓存相关信息
        if (winResult >= this.firstWinNormal) {
            if (winResult < this.firstWinBySha || this.tractorPlayer.playerLocalCache.WinResult < this.firstWinBySha) {
                this.tractorPlayer.playerLocalCache.WinResult = winResult;
            }
            else {
                this.tractorPlayer.playerLocalCache.WinResult++;
            }
            this.tractorPlayer.playerLocalCache.WinnerPosition = position;
            this.tractorPlayer.playerLocalCache.WinnderID = latestPlayer;
        }

        //如果不在回看上轮出牌，才重画刚刚出的牌
        if (!this.tractorPlayer.ShowLastTrickCards) {
            //擦掉上一把
            if (this.tractorPlayer.CurrentTrickState.CountOfPlayerShowedCards() == 1) {
                this.tractorPlayer.destroyAllClientMessages()
                this.drawingFormHelper.destroyAllShowedCards()
                this.drawingFormHelper.DrawScoreImageAndCards();
            }

            //播放出牌音效
            let soundInex = winResult;
            if (winResult > 0) soundInex = this.tractorPlayer.playerLocalCache.WinResult;
            if (!this.tractorPlayer.playerLocalCache.isLastTrick &&
                !this.IsDebug &&
                !this.tractorPlayer.CurrentTrickState.serverLocalCache.muteSound) {
                if (this.enableSound) this.gameScene.soundPlayersShowCard[soundInex].play();
            }

            this.drawingFormHelper.DrawShowedCardsByPosition(showedCards, position);
        }

        //如果正在回看并且自己刚刚出了牌，则重置回看，重新画牌
        if (this.tractorPlayer.ShowLastTrickCards && latestPlayer == this.tractorPlayer.PlayerId) {
            this.HandleRightClickEmptyArea();
        }

        //即时更新旁观手牌
        if (this.tractorPlayer.isObserver && this.tractorPlayer.PlayerId == latestPlayer) {
            this.tractorPlayer.CurrentPoker.CloneFrom(this.tractorPlayer.CurrentHandState.PlayerHoldingCards[this.tractorPlayer.PlayerId])
            this.drawingFormHelper.ResortMyHandCards();
        }

        if (winResult > 0) {
            this.drawingFormHelper.DrawOverridingFlag(showedCards.length, this.PlayerPosition[this.tractorPlayer.playerLocalCache.WinnderID], this.tractorPlayer.playerLocalCache.WinResult - 1, true);

            //拖拉机动画
            let showedPoker = new CurrentPoker()
            showedPoker.Trump = this.tractorPlayer.CurrentTrickState.Trump;
            showedPoker.Rank = this.tractorPlayer.CurrentTrickState.Rank;
            showedCards.forEach(card => {
                showedPoker.AddCard(card);
            })
            let showedTractors: number[] = showedPoker.GetTractorBySuit(this.tractorPlayer.CurrentTrickState.LeadingSuit());
            if (showedTractors.length > 1) this.drawingFormHelper.DrawMovingTractorByPosition(showedCards.length, position)
        }

        this.RobotPlayFollowing();
    }

    //托管代打
    private RobotPlayFollowing() {
        if (this.tractorPlayer.isObserver) return
        //跟出
        if ((this.tractorPlayer.playerLocalCache.isLastTrick || this.IsDebug) && !this.tractorPlayer.isObserver &&
            this.tractorPlayer.CurrentTrickState.NextPlayer() == this.tractorPlayer.PlayerId &&
            this.tractorPlayer.CurrentTrickState.IsStarted()) {
            let tempSelectedCards: number[] = []
            Algorithm.MustSelectedCards(tempSelectedCards, this.tractorPlayer.CurrentTrickState, this.tractorPlayer.CurrentPoker);

            this.SelectedCards = []
            let myCardsNumber = this.gameScene.cardImages
            for (let i = 0; i < myCardsNumber.length; i++) {
                let serverCardNumber: number = myCardsNumber[i].getData("serverCardNumber")
                if (tempSelectedCards.includes(serverCardNumber)) {
                    this.SelectedCards.push(serverCardNumber);
                    tempSelectedCards = CommonMethods.ArrayRemoveOneByValue(tempSelectedCards, serverCardNumber);
                }
            }

            let showingCardsValidationResult: ShowingCardsValidationResult =
                TractorRules.IsValid(this.tractorPlayer.CurrentTrickState, this.SelectedCards, this.tractorPlayer.CurrentPoker);
            if (showingCardsValidationResult.ResultType == ShowingCardsValidationResult.ShowingCardsValidationResultType.Valid) {
                setTimeout(() => {
                    this.ToShowCards();
                }, 250);
            }
            else {

                alert(`failed to auto select cards: ${this.SelectedCards}, please manually select`)
            }
            return;
        }

        //跟选：如果玩家没有事先手动选牌，在有必选牌的情况下自动选择必选牌，方便玩家快捷出牌
        if (this.SelectedCards.length == 0 &&
            !this.tractorPlayer.isObserver &&
            this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing &&
            this.tractorPlayer.CurrentTrickState.NextPlayer() == this.tractorPlayer.PlayerId &&
            this.tractorPlayer.CurrentTrickState.IsStarted()) {
            //如果选了牌，则重画手牌，方便直接点确定出牌
            let tempSelectedCards: number[] = []
            Algorithm.MustSelectedCardsNoShow(tempSelectedCards, this.tractorPlayer.CurrentTrickState, this.tractorPlayer.CurrentPoker);
            if (tempSelectedCards.length > 0) {
                this.SelectedCards = []
                let myCardsNumber = this.gameScene.cardImages
                for (let i = 0; i < myCardsNumber.length; i++) {
                    let serverCardNumber: number = myCardsNumber[i].getData("serverCardNumber")
                    if (tempSelectedCards.includes(serverCardNumber)) {
                        this.myCardIsReady[i] = true;
                        this.SelectedCards.push(serverCardNumber);
                        tempSelectedCards = CommonMethods.ArrayRemoveOneByValue(tempSelectedCards, serverCardNumber);
                        //将选定的牌向上提升 via gameScene.cardImages
                        let toAddImage = this.gameScene.cardImages[i] as Phaser.GameObjects.Sprite;
                        if (toAddImage.data === null || !toAddImage.getData("status") || toAddImage.getData("status") === "down") {
                            toAddImage.setData("status", "up");
                            toAddImage.y -= 30;
                        }
                    }
                }
                this.gameScene.sendMessageToServer(CardsReady_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.myCardIsReady));
            }
        }
        this.drawingFormHelper.validateSelectedCards()
    }

    //托管代打，先手
    private RobotPlayStarting() {
        if (this.IsDebug && !this.tractorPlayer.isObserver &&
            (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing || this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8CardsFinished)) {
            if (!this.tractorPlayer.CurrentTrickState.Learder) return;
            if (this.tractorPlayer.CurrentTrickState.NextPlayer() != this.tractorPlayer.PlayerId) return;
            if (this.tractorPlayer.CurrentTrickState.IsStarted()) return;

            this.SelectedCards = [];
            Algorithm.ShouldSelectedCards(this.SelectedCards, this.tractorPlayer.CurrentTrickState, this.tractorPlayer.CurrentPoker);
            let showingCardsValidationResult: ShowingCardsValidationResult =
                TractorRules.IsValid(this.tractorPlayer.CurrentTrickState, this.SelectedCards, this.tractorPlayer.CurrentPoker);
            if (showingCardsValidationResult.ResultType == ShowingCardsValidationResult.ShowingCardsValidationResultType.Valid) {
                setTimeout(() => {
                    this.ToShowCards();
                }, 250);
            }
            else {
                alert(`failed to auto select cards: ${this.SelectedCards}, please manually select`)
            }
        }
    }

    public TrickFinished() {
        this.drawingFormHelper.DrawScoreImageAndCards();
    }

    public TrickStarted() {
        if (!this.IsDebug && this.tractorPlayer.CurrentTrickState.Learder == this.tractorPlayer.PlayerId) {
            this.drawingFormHelper.DrawMyPlayingCards();
        }
        this.RobotPlayStarting();
    }

    private init() {
        //每次初始化都重绘背景
        this.tractorPlayer.destroyAllClientMessages()
        this.drawingFormHelper.destroyAllCards()
        this.drawingFormHelper.destroyAllShowedCards()
        this.drawingFormHelper.destroyToolbar()
        this.drawingFormHelper.destroyScoreImageAndCards()
        this.drawingFormHelper.destroyLast8Cards()

        this.drawingFormHelper.DrawSidebarFull();
    }

    public setStartLabels() {
        let onesTurnPlayerID: string = "";
        let isShowCards: boolean = false;
        if (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards) {
            onesTurnPlayerID = this.tractorPlayer.CurrentHandState.Last8Holder;
            isShowCards = false;
        } else if (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing &&
            Object.keys(this.tractorPlayer.CurrentTrickState.ShowedCards).length > 0) {
            onesTurnPlayerID = this.tractorPlayer.CurrentTrickState.NextPlayer();
            isShowCards = true;
        }
        var curIndex = CommonMethods.GetPlayerIndexByID(this.tractorPlayer.CurrentGameState.Players, this.tractorPlayer.PlayerId)
        if (curIndex < 0) return;
        for (let i = 0; i < 4; i++) {
            this.lblStarters[i].setVisible(true)
            this.lblStarters[i].setColor("orange")

            var curPlayer = this.tractorPlayer.CurrentGameState.Players[curIndex];
            if (curPlayer && curPlayer.IsOffline) {
                this.lblStarters[i].setText("离线中")
            }
            else if (curPlayer && curPlayer.PlayingSG) {
                this.lblStarters[i].setText(curPlayer.PlayingSG)
            }
            else if (curPlayer && curPlayer.IsRobot) {
                this.lblStarters[i].setText("托管中")
            }
            else if (curPlayer && !curPlayer.IsReadyToStart) {
                this.lblStarters[i].setText("思索中")
            }
            else {
                if (curPlayer && onesTurnPlayerID && curPlayer.PlayerId === onesTurnPlayerID) {
                    this.lblStarters[i]
                        .setText(isShowCards ? "出牌中" : "埋底中")
                        .setColor("yellow")
                } else if (curPlayer && this.tractorPlayer.CurrentHandState.Starter && curPlayer.PlayerId == this.tractorPlayer.CurrentHandState.Starter) {
                    this.lblStarters[i].setText("庄家")
                }
                else {
                    this.lblStarters[i].setText(`${curIndex + 1}`)
                }
            }
            curIndex = (curIndex + 1) % 4
        }
    }

    private btnReady_Click() {
        if (!this.btnReady || !this.btnReady.input.enabled) return;
        //为防止以外连续点两下就绪按钮，造成重复发牌，点完一下就立即disable就绪按钮
        this.btnReady.disableInteractive()
        this.btnReady.setColor('gray')

        this.gameScene.sendMessageToServer(ReadyToStart_REQUEST, this.tractorPlayer.PlayerId, "")
    }

    private btnRobot_Click() {
        if (!this.btnRobot || !this.btnRobot.input.enabled) return;
        this.gameScene.sendMessageToServer(ToggleIsRobot_REQUEST, this.tractorPlayer.PlayerId, "")
    }

    // pos is 1-based
    private observeByPosition(pos: number) {
        if (this.tractorPlayer.isObserver && this.PositionPlayer[pos]) {
            this.gameScene.sendMessageToServer(ObserveNext_REQUEST, this.tractorPlayer.MyOwnId, this.PositionPlayer[pos])
        }
    }

    private btnExitRoom_Click() {
        if (this.gameScene.isReplayMode) {
            window.location.reload()
            return
        }
        if (CommonMethods.AllOnline(this.tractorPlayer.CurrentGameState.Players) && !this.tractorPlayer.isObserver && SuitEnums.HandStep.DiscardingLast8Cards <= this.tractorPlayer.CurrentHandState.CurrentHandStep && this.tractorPlayer.CurrentHandState.CurrentHandStep <= SuitEnums.HandStep.Playing) {
            var c = window.confirm("游戏进行中退出将会重启游戏，是否确定退出？");
            if (c == true) {
                window.location.reload()
            }
            return
        }
        if (this.gameScene.isInGameRoom()) {
            this.gameScene.sendMessageToServer(ExitRoom_REQUEST, this.tractorPlayer.MyOwnId, "")
            return
        }
        window.location.reload()
    }

    public loadEmojiForm() {
        if (this.chatForm && this.chatForm.visible) return;
        let chatFormWid = this.gameScene.coordinates.chatWid;
        this.chatForm = this.gameScene.add.dom(this.gameScene.coordinates.screenWid, 0)
            .setOrigin(0)
            .createFromCache('emojiForm');
        let inputForm = this.chatForm.getChildByID("input-form")
        inputForm.style.width = `${chatFormWid}px`;
        inputForm.style.height = `${this.btnExitRoom.getBottomRight().y}px`;

        let divfooter = this.chatForm.getChildByID("divfooter")
        divfooter.style.bottom = "-1px";
        if (CommonMethods.isMobile()) {
            divfooter.style.bottom = "-3px";
        }

        let fullTextDivHeight = this.gameScene.coordinates.screenHei - divfooter.offsetHeight - 10;
        let divOnlinePlayerListHeight = fullTextDivHeight * (1 - this.gameScene.coordinates.chatHeightRatio);
        let divChatHeight = fullTextDivHeight * this.gameScene.coordinates.chatHeightRatio - 5;

        let divOnlinePlayerList = this.chatForm.getChildByID("divOnlinePlayerList")
        divOnlinePlayerList.style.height = `${divOnlinePlayerListHeight}px`;

        let divChatHistory = this.chatForm.getChildByID("divChatHistory")
        divChatHistory.style.height = `${divChatHeight}px`;

        let selectPresetMsgs = this.chatForm.getChildByID("selectPresetMsgs")
        selectPresetMsgs.style.width = `${chatFormWid}px`;
        let textAreaMsg = this.chatForm.getChildByID("textAreaMsg")
        textAreaMsg.style.width = `${selectPresetMsgs.offsetWidth - 6}px`;
        selectPresetMsgs.onchange = () => {
            let selectedIndex = selectPresetMsgs.selectedIndex;
            let selectedValue = selectPresetMsgs.value;
            let args: (string | number)[] = [selectedIndex, CommonMethods.GetRandomInt(CommonMethods.winEmojiLength), selectedValue];
            this.sendEmojiWithCheck(args)
        }
    }

    private emojiSubmitEventhandler() {
        let selectPresetMsgs = this.chatForm.getChildByID("selectPresetMsgs")
        if (!selectPresetMsgs) return;
        let textAreaMsg = this.chatForm.getChildByID("textAreaMsg")
        let emojiType = -1;
        let emojiIndex = -1;
        let msgString = textAreaMsg.value;
        if (msgString) {
            msgString = msgString.trim().replace(/(\r\n|\n|\r)/gm, "");
        }
        textAreaMsg.value = "";
        if (!msgString) {
            msgString = selectPresetMsgs.value;
            emojiType = selectPresetMsgs.selectedIndex;
            emojiIndex = CommonMethods.GetRandomInt(CommonMethods.winEmojiLength);
        }
        let args: (string | number)[] = [emojiType, emojiIndex, msgString];
        this.sendEmojiWithCheck(args)
    }

    public blurChat() {
        if (!this.chatForm) return;
        let textAreaMsg = this.chatForm.getChildByID("textAreaMsg")
        if (!textAreaMsg) return;
        textAreaMsg.blur();
    }

    private shortcutKeyDownEventhandler(event: KeyboardEvent) {
        if (!event || !event.key || !this.sgDrawingHelper.IsPlayingGame) return;
        if (!this.sgDrawingHelper.sgcsState.Dudes[this.sgDrawingHelper.myPlayerIndex].Enabled) return;
        let ekey: string = event.key.toLowerCase();
        if (!['arrowup', 'arrowleft', 'arrowright'].includes(ekey)) return;

        let isUpdated = false;
        switch (ekey) {
            case 'arrowup':
                this.sgcsPlayer.PressUpKey();
                isUpdated = true;
                break;
            case 'arrowleft':
                this.sgcsPlayer.PressLeftKey();
                isUpdated = true;
                break;
            case 'arrowright':
                this.sgcsPlayer.PressRightKey();
                isUpdated = true;
                break;
            default:
                break;
        }
        if (isUpdated && this.sgcsPlayer.PlayerId === this.tractorPlayer.MyOwnId) {
            this.gameScene.sendMessageToServer(SGCSPlayer.SgcsPlayerUpdated_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.sgcsPlayer));
        }
    }

    private shortcutKeyUpEventhandler(event: KeyboardEvent) {
        if (!event || !event.key) return;
        let ekey: string = event.key.toLowerCase();
        if (this.sgDrawingHelper.IsPlayingGame) {
            if (['arrowleft', 'arrowright'].includes(ekey)) {
                if (this.sgcsPlayer.PlayerId === this.tractorPlayer.MyOwnId && this.sgDrawingHelper.sgcsState.Dudes[this.sgDrawingHelper.myPlayerIndex].Enabled) {
                    this.sgcsPlayer.ReleaseLeftOrRightKey();
                    this.gameScene.sendMessageToServer(SGCSPlayer.SgcsPlayerUpdated_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.sgcsPlayer));
                }
                return;
            }
        }
        if (this.gameScene.isReplayMode) {
            if (this.modalForm) return;
            event.preventDefault();
            switch (ekey) {
                case 'arrowup':
                    (this.gameScene as GameReplayScene).btnFirstTrick_Click();
                    return;
                case 'arrowleft':
                    (this.gameScene as GameReplayScene).btnPreviousTrick_Click();
                    return;
                case 'arrowright':
                    (this.gameScene as GameReplayScene).btnNextTrick_Click();
                    return;
                case 'arrowdown':
                    (this.gameScene as GameReplayScene).btnLastTrick_Click();
                    return;
                default:
                    break;
            }
        } else {
            if (ekey === 'escape') {
                if (this.sgDrawingHelper.IsPlayingGame) {
                    this.sgDrawingHelper.hitBomb(this.sgDrawingHelper.players.children.entries[this.sgDrawingHelper.myPlayerIndex], undefined);
                    this.sgDrawingHelper.destroyGame(2);
                }
                this.resetGameRoomUI();
                return;
            }
            if (this.chatForm && this.chatForm.getChildByID("textAreaMsg") === document.activeElement) {
                if (ekey === 'enter') {
                    this.emojiSubmitEventhandler();
                }
                return;
            }

            switch (ekey) {
                case 'z':
                    if (this.modalForm || this.tractorPlayer.isObserver) return;
                    this.btnReady_Click();
                    return;
                case 's':
                    if (this.modalForm || this.tractorPlayer.isObserver) return;
                    this.btnPig_Click();
                    return;
                case 'r':
                    if (this.modalForm || this.tractorPlayer.isObserver) return;
                    this.btnRobot_Click();
                    return;
                // case 'c':
                //     if (this.modalForm || this.tractorPlayer.isObserver || !this.sgDrawingHelper.IsPlayingGame || !this.sgDrawingHelper.gameOver) return;
                //     this.sgDrawingHelper.restartGame();
                //     return;
                // case 'p':
                //     if (this.modalForm || this.tractorPlayer.isObserver || !this.sgDrawingHelper.IsPlayingGame || this.sgDrawingHelper.gameOver) return;
                //     this.sgDrawingHelper.pauseGame();
                //     return;
                default:
                    break;
            }

            if ('1' <= ekey && ekey <= CommonMethods.emojiMsgs.length.toString() && !this.modalForm) {
                let emojiType = parseInt(ekey) - 1;
                let emojiIndex = CommonMethods.GetRandomInt(CommonMethods.winEmojiLength);
                let msgString = CommonMethods.emojiMsgs[emojiType]
                let args: (string | number)[] = [emojiType, emojiIndex, msgString];
                this.sendEmojiWithCheck(args)
            }
        }
    }

    private sendEmojiWithCheck(args: (string | number)[]) {
        if ((this.sgDrawingHelper.hiddenEffects[args[2]] || this.sgDrawingHelper.hiddenGames[args[2]])) {
            if (CommonMethods.AllOnline(this.tractorPlayer.CurrentGameState.Players) &&
                (SuitEnums.HandStep.DistributingCards <= this.tractorPlayer.CurrentHandState.CurrentHandStep && this.tractorPlayer.CurrentHandState.CurrentHandStep <= SuitEnums.HandStep.Playing)) {
                this.appendChatMsg("游戏中途不允许发隐藏技扰乱视听");
                return;
            }
            if (this.tractorPlayer.isObserver) {
                this.appendChatMsg("旁观玩家不能发动隐藏技");
                return;
            }
            if (this.sgDrawingHelper.hiddenEffectImages &&
                this.sgDrawingHelper.hiddenEffectImages.length > 0 &&
                this.sgDrawingHelper.hiddenEffectImages[0].visible ||
                this.sgDrawingHelper.hiddenGamesImages &&
                this.sgDrawingHelper.hiddenGamesImages.length > 0 &&
                this.sgDrawingHelper.hiddenGamesImages[0].visible) {
                this.appendChatMsg(CommonMethods.hiddenEffectsWarningMsg);
                return;
            }
        }
        if (!this.isSendEmojiEnabled) {
            this.appendChatMsg(CommonMethods.emojiWarningMsg);
            return;
        }
        this.isSendEmojiEnabled = false;
        setTimeout(() => {
            this.isSendEmojiEnabled = true;
        }, 1000 * CommonMethods.emojiWarningIntervalInSec);
        this.gameScene.sendMessageToServer(CommonMethods.SendEmoji_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(args))
    }

    private lblNickName_Click() {
        if (this.modalForm) return
        this.modalForm = this.gameScene.add.dom(this.gameScene.coordinates.screenWid * 0.5, this.gameScene.coordinates.screenHei * 0.5).createFromCache('settingsForm');
        if (!this.gameScene.isReplayMode) {
            this.gameScene.decadeUICanvas.style.zIndex = "-1000";
        }

        let pAppVersion = this.modalForm.getChildByID("pAppVersion")
        pAppVersion.innerText = `版本：${this.gameScene.appVersion}`

        let volumeControl = this.modalForm.getChildByID("rangeAudioVolume")
        volumeControl.value = Math.floor(this.gameScene.soundVolume * 100)
        volumeControl.onchange = () => {
            let volValue: number = volumeControl.value
            this.gameScene.soundVolume = volValue / 100.0
            this.gameScene.loadAudioFiles()
            this.gameScene.soundbiyue1.play()
        }

        let txtJoinAudioUrl = this.modalForm.getChildByID("txtJoinAudioUrl")
        txtJoinAudioUrl.value = this.gameScene.joinAudioUrl
        txtJoinAudioUrl.oninput = () => {
            this.gameScene.joinAudioUrl = txtJoinAudioUrl.value
        }

        let txtPlayerEmail = this.modalForm.getChildByID("txtPlayerEmail")
        txtPlayerEmail.value = cookies.get("playerEmail") ? cookies.get("playerEmail") : "";

        let txtMaxReplays = this.modalForm.getChildByID("txtMaxReplays")
        txtMaxReplays.value = IDBHelper.maxReplays
        txtMaxReplays.oninput = () => {
            let maxString = txtMaxReplays.value;
            let maxInt = 0;
            if (CommonMethods.IsNumber(maxString)) {
                maxInt = Math.max(maxInt, parseInt(maxString));
            }
            IDBHelper.maxReplays = maxInt
        }

        let btnCleanupReplays = this.modalForm.getChildByID("btnCleanupReplays")
        btnCleanupReplays.onclick = () => {
            var c = window.confirm("你确定要清空所有录像文件吗？");
            if (c === false) {
                return
            }
            IDBHelper.CleanupReplayEntity(() => {
                this.ReinitReplayEntities(this);
                if (this.gameScene.isReplayMode) this.tractorPlayer.NotifyMessage(["已尝试清空全部录像文件"]);
            });
            this.DesotroyModalForm();
        }

        let btnExportZipFile = this.modalForm.getChildByID("btnExportZipFile")
        btnExportZipFile.onclick = () => {
            FileHelper.ExportZipFile();
            this.DesotroyModalForm();
        }

        let inputRecordingFile = this.modalForm.getChildByID("inputRecordingFile")
        inputRecordingFile.onchange = () => {
            let fileName = inputRecordingFile.value;
            let extension = fileName.split('.').pop();
            if (!["json", "zip"].includes(extension.toLowerCase())) {
                alert("unsupported file type!");
                return;
            }
            if (!inputRecordingFile || !inputRecordingFile.files || inputRecordingFile.files.length <= 0) {
                alert("No file has been selected!");
                return;
            }
            if (extension.toLowerCase() === "json") {
                FileHelper.ImportJsonFile(inputRecordingFile.files[0], () => {
                    this.ReinitReplayEntities(this);
                    if (this.gameScene.isReplayMode) this.tractorPlayer.NotifyMessage(["已尝试加载本地录像文件"]);
                });
            } else {
                FileHelper.ImportZipFile(inputRecordingFile.files[0], () => {
                    this.ReinitReplayEntities(this);
                    if (this.gameScene.isReplayMode) this.tractorPlayer.NotifyMessage(["已尝试加载本地录像文件"]);
                });
            }
            this.DesotroyModalForm();
        }

        let noDanmu = this.modalForm.getChildByID("cbxNoDanmu")
        noDanmu.checked = this.gameScene.noDanmu.toLowerCase() === "true"
        noDanmu.onchange = () => {
            this.gameScene.noDanmu = noDanmu.checked.toString()
        }

        let cbxCutCards = this.modalForm.getChildByID("cbxCutCards")
        cbxCutCards.checked = this.gameScene.noCutCards.toLowerCase() === "true"
        cbxCutCards.onchange = () => {
            this.gameScene.noCutCards = cbxCutCards.checked.toString()
        }

        if (this.gameScene.isReplayMode || this.gameScene.isInGameHall() || this.tractorPlayer.CurrentRoomSetting.RoomOwner !== this.tractorPlayer.MyOwnId) {
            let pResumeGame = this.modalForm.getChildByID("pResumeGame")
            let pRandomSeat = this.modalForm.getChildByID("pRandomSeat")
            let pSwapSeat = this.modalForm.getChildByID("pSwapSeat")
            pResumeGame.remove()
            pRandomSeat.remove()
            pSwapSeat.remove()
        } else {
            let btnResumeGame = this.modalForm.getChildByID("btnResumeGame")
            btnResumeGame.onclick = () => {
                if (CommonMethods.AllOnline(this.tractorPlayer.CurrentGameState.Players) && !this.tractorPlayer.isObserver && this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing) {
                    alert("游戏中途不允许继续牌局,请完成此盘游戏后重试")
                } else {
                    this.gameScene.sendMessageToServer(ResumeGameFromFile_REQUEST, this.tractorPlayer.MyOwnId, "");
                }
                this.DesotroyModalForm();
            }

            let btnRandomSeat = this.modalForm.getChildByID("btnRandomSeat")
            btnRandomSeat.onclick = () => {
                if (CommonMethods.AllOnline(this.tractorPlayer.CurrentGameState.Players) && !this.tractorPlayer.isObserver && this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing) {
                    alert("游戏中途不允许随机组队,请完成此盘游戏后重试")
                } else {
                    this.gameScene.sendMessageToServer(RandomSeat_REQUEST, this.tractorPlayer.MyOwnId, "");
                }
                this.DesotroyModalForm();
            }

            let btnSwapSeat = this.modalForm.getChildByID("btnSwapSeat")
            btnSwapSeat.onclick = () => {
                if (CommonMethods.AllOnline(this.tractorPlayer.CurrentGameState.Players) && !this.tractorPlayer.isObserver && this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing) {
                    alert("游戏中途不允许互换座位,请完成此盘游戏后重试")
                } else {
                    let selectSwapSeat = this.modalForm.getChildByID("selectSwapSeat")
                    this.gameScene.sendMessageToServer(SwapSeat_REQUEST, this.tractorPlayer.MyOwnId, selectSwapSeat.value);
                }
                this.DesotroyModalForm();
            }
        }
    }

    private ReinitReplayEntities(that: any) {
        if (that.gameScene.isReplayMode) {
            let grs = that.gameScene as GameReplayScene;
            grs.InitReplayEntities(grs);
        }
    }

    private btnPig_Click() {
        if (!this.btnPig || !this.btnPig.visible || !this.btnPig.input.enabled) return;
        this.ToDiscard8Cards();
        this.ToShowCards();
    }
    private ToDiscard8Cards() {
        //判断是否处在扣牌阶段
        if (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards &&
            this.tractorPlayer.CurrentHandState.Last8Holder == this.tractorPlayer.PlayerId) //如果等我扣牌
        {
            if (this.SelectedCards.length == 8) {
                //扣牌,所以擦去小猪
                this.btnPig.setVisible(false);
                this.btnPig.disableInteractive()
                this.btnPig.setColor('gray')
                this.btnPig.setStyle({ backgroundColor: 'gray' })

                this.SelectedCards.forEach(card => {
                    this.tractorPlayer.CurrentPoker.RemoveCard(card);
                })
                this.gameScene.sendMessageToServer(StoreDiscardedCards_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.SelectedCards))
                this.drawingFormHelper.ResortMyHandCards();
            }
        }
    }
    private ToShowCards() {
        if ((this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing || this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8CardsFinished) &&
            this.tractorPlayer.CurrentTrickState.NextPlayer() == this.tractorPlayer.PlayerId) {
            var selectedCardsValidationResult = TractorRules.IsValid(this.tractorPlayer.CurrentTrickState, this.SelectedCards, this.tractorPlayer.CurrentPoker);
            //如果我准备出的牌合法
            if (selectedCardsValidationResult.ResultType == ShowingCardsValidationResult.ShowingCardsValidationResultType.Valid) {
                //擦去小猪
                this.btnPig.setVisible(false);
                this.btnPig.disableInteractive()
                this.btnPig.setColor('gray')
                this.btnPig.setStyle({ backgroundColor: 'gray' })

                this.SelectedCards.forEach(card => {
                    this.tractorPlayer.CurrentPoker.RemoveCard(card);
                })

                this.ShowCards();
                this.drawingFormHelper.ResortMyHandCards();
                this.SelectedCards = []
            }
            else if (selectedCardsValidationResult.ResultType == ShowingCardsValidationResult.ShowingCardsValidationResultType.TryToDump) {
                //擦去小猪
                this.btnPig.setVisible(false);
                this.btnPig.disableInteractive()
                this.btnPig.setColor('gray')
                this.btnPig.setStyle({ backgroundColor: 'gray' })
                this.gameScene.sendMessageToServer(ValidateDumpingCards_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.SelectedCards))
            }
        }
    }

    public ShowCards() {
        if (this.tractorPlayer.CurrentTrickState.NextPlayer() == this.tractorPlayer.PlayerId) {
            this.tractorPlayer.CurrentTrickState.ShowedCards[this.tractorPlayer.PlayerId] = CommonMethods.deepCopy<number[]>(this.SelectedCards);
            this.gameScene.sendMessageToServer(PlayerShowCards_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.tractorPlayer.CurrentTrickState));
        }
    }

    // handle failure
    public NotifyDumpingValidationResultEventHandler(result: ShowingCardsValidationResult) {

        //擦掉上一把
        if (this.tractorPlayer.CurrentTrickState.AllPlayedShowedCards() || this.tractorPlayer.CurrentTrickState.IsStarted() == false) {
            this.drawingFormHelper.destroyAllShowedCards();
            this.drawingFormHelper.DrawScoreImageAndCards();
        }

        let latestPlayer = result.PlayerId;
        let position = this.PlayerPosition[latestPlayer];
        this.drawingFormHelper.DrawShowedCardsByPosition(result.CardsToShow, position)
    }

    // handle both
    public NotifyTryToDumpResultEventHandler(result: ShowingCardsValidationResult) {
        if (result.ResultType == ShowingCardsValidationResult.ShowingCardsValidationResultType.DumpingSuccess) { //甩牌成功.
            this.SelectedCards.forEach(card => {
                this.tractorPlayer.CurrentPoker.RemoveCard(card);
            })

            this.ShowCards();
            this.drawingFormHelper.ResortMyHandCards();
            this.SelectedCards = []
        }
        //甩牌失败
        else {
            let msgs: string[] = [
                `甩牌${this.SelectedCards.length}张失败`,
                `"罚分：${this.SelectedCards.length * 10}`,
            ]
            this.tractorPlayer.NotifyMessage(msgs)

            //甩牌失败播放提示音
            // soundPlayerDumpFailure.Play(this.enableSound);

            //暂时关闭托管功能，以免甩牌失败后立即点托管，会出别的牌
            this.btnRobot.disableInteractive()
            this.btnRobot.setColor('gray')

            setTimeout(() => {
                result.MustShowCardsForDumpingFail.forEach(card => {
                    this.tractorPlayer.CurrentPoker.RemoveCard(card);
                })
                this.SelectedCards = CommonMethods.deepCopy<number[]>(result.MustShowCardsForDumpingFail)
                this.ShowCards();
                this.drawingFormHelper.ResortMyHandCards();
                this.SelectedCards = []
                this.btnRobot.setInteractive({ useHandCursor: true })
                this.btnRobot.setColor('white')
            }, 3000);
        }
    }

    public NotifyStartTimerEventHandler(timerLength: number) {
        if (timerLength == 0) {
            this.timerCountDown = 0
            this.clearTimer()
            return
        }

        this.timerCountDown = timerLength
        this.timerImage.setVisible(true)
        this.timerImage.depth = 100;
        this.timerImage.setText(this.timerCountDown.toString())
        this.timerIntervalID.push(setInterval(() => { this.timerTicker() }, 1000))
    }

    private timerTicker() {
        this.timerCountDown--
        if (this.timerCountDown >= 0) {
            this.timerImage.setVisible(true)
            this.timerImage.setText(this.timerCountDown.toString())
        }
        if (this.timerCountDown <= 0) {
            setTimeout(() => { this.clearTimer() }, 200)
        }
    }

    private clearTimer() {
        if (this.timerIntervalID.length > 0) clearInterval(this.timerIntervalID.shift())
        if (this.timerIntervalID.length == 0 && this.timerImage) this.timerImage.setVisible(false)
    }

    //绘制当前轮各家所出的牌（仅用于切换视角，断线重连，恢复牌局，当前回合大牌变更时）
    private PlayerCurrentTrickShowedCards() {
        //擦掉出牌区
        this.drawingFormHelper.destroyAllShowedCards();
        this.drawingFormHelper.DrawScoreImageAndCards();
        this.tractorPlayer.destroyAllClientMessages()
        let cardsCount = 0
        if (this.tractorPlayer.playerLocalCache.ShowedCardsInCurrentTrick != null) {
            for (const [key, value] of Object.entries(this.tractorPlayer.playerLocalCache.ShowedCardsInCurrentTrick)) {
                let cards: number[] = value as number[]
                if (!cards || cards.length == 0) continue;
                let player: string = key;
                cardsCount = cards.length
                let position = this.PlayerPosition[player];
                this.drawingFormHelper.DrawShowedCardsByPosition(cards, position)
            }
        }
        //重画亮过的牌
        if (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards) {
            this.drawingFormHelper.TrumpMadeCardsShow();
        }

        //重画大牌标记
        if (this.tractorPlayer.playerLocalCache.WinnderID && cardsCount > 0) {
            this.drawingFormHelper.DrawOverridingFlag(
                cardsCount,
                this.PlayerPosition[this.tractorPlayer.playerLocalCache.WinnderID],
                this.tractorPlayer.playerLocalCache.WinResult - 1,
                false);
        }
    }

    private resetGameRoomUI() {
        this.blurChat();
        if (this.modalForm) {
            if (this.modalForm.getChildByID("btnBapi1")) {
                let cutPoint = 0;
                let cutInfo = `取消,${cutPoint}`;
                this.CutCardShoeCardsCompleteEventHandler(cutPoint, cutInfo);
            } else {
                if (!this.gameScene.isReplayMode)
                    this.gameScene.loadAudioFiles();
                this.gameScene.saveSettings();
                this.DesotroyModalForm();
            }
        }
    }

    private DesotroyModalForm() {
        if (!this.modalForm) return;
        this.modalForm.destroy();
        this.modalForm = undefined;
        if (!this.gameScene.isReplayMode) {
            this.gameScene.decadeUICanvas.style.zIndex = "1000";
        }
    }

    private ShowLastTrickAndTumpMade() {
        //擦掉上一把
        this.drawingFormHelper.destroyAllShowedCards()
        this.tractorPlayer.destroyAllClientMessages()

        this.tractorPlayer.NotifyMessage(["回看上轮出牌"]);

        //查看谁亮过什么牌
        //need to draw this first so that we have max count for trump made cards
        this.drawingFormHelper.TrumpMadeCardsShowFromLastTrick();

        //绘制上一轮各家所出的牌，缩小至一半，放在左下角，或者重画当前轮各家所出的牌
        this.PlayerLastTrickShowedCards();
    }

    //绘制上一轮各家所出的牌，缩小一半
    private PlayerLastTrickShowedCards() {
        let lastLeader = this.tractorPlayer.CurrentTrickState.serverLocalCache.lastLeader;
        if (!lastLeader || !this.tractorPlayer.CurrentTrickState.serverLocalCache.lastShowedCards ||
            Object.keys(this.tractorPlayer.CurrentTrickState.serverLocalCache.lastShowedCards).length == 0) return;

        let trickState: CurrentTrickState = new CurrentTrickState();
        trickState.Learder = lastLeader;
        trickState.Trump = this.tractorPlayer.CurrentTrickState.Trump;
        trickState.Rank = this.tractorPlayer.CurrentTrickState.Rank;
        let cardsCount = 0
        for (const [key, value] of Object.entries(this.tractorPlayer.CurrentTrickState.serverLocalCache.lastShowedCards)) {
            trickState.ShowedCards[key] = CommonMethods.deepCopy<number[]>(value as number[])
        }

        for (const [key, value] of Object.entries(trickState.ShowedCards)) {
            let cards: number[] = value as number[]
            if (!cards || cards.length == 0) continue;
            let position = this.PlayerPosition[key];
            cardsCount = cards.length
            this.drawingFormHelper.DrawShowedCardsByPositionFromLastTrick(cards, position)
        }
        let winnerID = TractorRules.GetWinner(trickState);
        let tempIsWinByTrump = this.IsWinningWithTrump(trickState, winnerID);
        this.drawingFormHelper.DrawOverridingFlagFromLastTrick(cardsCount, this.PlayerPosition[winnerID], tempIsWinByTrump - 1);
    }

    public NotifyGameHallEventHandler(roomStateList: RoomState[], playerList: string[]) {
        this.tractorPlayer.destroyAllClientMessages();
        this.destroyGameRoom();
        this.destroyGameHall();
        this.drawGameHall(roomStateList, playerList);
        this.loadEmojiForm();
    }

    public destroyGameHall() {
        if (this.gameScene.btnJoinAudio != null) {
            this.gameScene.btnJoinAudio.destroy();
        }
        if (this.gameScene.hallPlayerHeader != null) {
            this.gameScene.hallPlayerHeader.destroy();
        }
        this.gameScene.hallPlayerNames.forEach(nameLabel => {
            nameLabel.destroy();
        });
        this.gameScene.pokerTableChairNames.forEach(tableChair => {
            tableChair.tableName.destroy();
            if (tableChair.chairNames != null) {
                tableChair.chairNames.forEach(chair => {
                    chair.myOwnName.destroy();
                    if (chair.observerNames != null) {
                        chair.observerNames.forEach(ob => {
                            ob.destroy();
                        });
                    }
                });
            }
        });
        this.gameScene.pokerTableChairImg.forEach(tableChair => {
            tableChair.tableImg.destroy();
            if (tableChair.chairImgs != null) {
                tableChair.chairImgs.forEach(chair => {
                    chair.destroy();
                });
            }
        });
    }

    public drawGameHall(roomStateList: RoomState[], playerList: string[]) {
        this.gameScene.btnJoinAudio = this.gameScene.add.text(this.gameScene.coordinates.hallPlayerHeaderPosition.x, 20, "加入语音")
            .setColor('white')
            .setFontSize(20)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setVisible(true)
            .setStyle({ backgroundColor: 'gray' })
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.gameScene.btnJoinAudio.setStyle({ backgroundColor: 'lightblue' })
            })
            .on('pointerout', () => {
                this.gameScene.btnJoinAudio.setStyle({ backgroundColor: 'gray' })
            })
            .on('pointerup', () => {
                if (this.gameScene.joinAudioUrl) {
                    window.open(this.gameScene.joinAudioUrl);
                } else {
                    alert("语音链接尚未设置，请点击屏幕正下方的自己名字进入设置界面，设置语音链接");
                }
            }, this)

        this.gameScene.hallPlayerHeader = this.gameScene.add.text(this.gameScene.coordinates.hallPlayerHeaderPosition.x, this.gameScene.coordinates.hallPlayerHeaderPosition.y, "在线").setColor('white').setFontSize(30).setShadow(2, 2, "#333333", 2, true, true)
        for (let i = 0; i < playerList.length; i++) {
            this.gameScene.hallPlayerNames[i] = this.gameScene.add.text(this.gameScene.coordinates.hallPlayerTopPosition.x, this.gameScene.coordinates.hallPlayerTopPosition.y + i * 40, playerList[i]).setColor('white').setFontSize(20).setShadow(2, 2, "#333333", 2, true, true);
        }

        for (let i = 0; i < roomStateList.length; i++) {
            var thisTableX = this.gameScene.coordinates.pokerTablePositionStart.x + this.gameScene.coordinates.pokerTableOffsets.x * (i % 2)
            var thisTableY = this.gameScene.coordinates.pokerTablePositionStart.y + this.gameScene.coordinates.pokerTableOffsets.y * Math.floor(i / 2)
            this.gameScene.pokerTableChairImg[i] = {
                tableImg: undefined,
                chairImgs: [],
            }
            this.gameScene.pokerTableChairNames[i] = {
                tableName: undefined,
                chairNames: []
            }
            this.gameScene.pokerTableChairImg[i].tableImg = this.gameScene.add.image(thisTableX, thisTableY, 'pokerTable')
                .setOrigin(0, 0)
                .setDisplaySize(160, 160)
                .setInteractive({ useHandCursor: true })
                .on('pointerup', () => {
                    if (this.modalForm) return
                    this.destroyGameHall();
                    this.gameScene.sendMessageToServer(PLAYER_ENTER_ROOM_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify({
                        roomID: i,
                        posID: -1,
                    }))
                })
                .on('pointerover', () => {
                    if (this.modalForm) return
                    this.gameScene.pokerTableChairImg[i].tableImg.y -= 5
                    this.gameScene.pokerTableChairNames[i].tableName.y -= 5
                })
                .on('pointerout', () => {
                    if (this.modalForm) return
                    this.gameScene.pokerTableChairImg[i].tableImg.y += 5
                    this.gameScene.pokerTableChairNames[i].tableName.y += 5
                })
            this.gameScene.pokerTableChairNames[i].tableName = this.gameScene.add.text(thisTableX + this.gameScene.coordinates.pokerTableLabelOffsets.x, thisTableY + this.gameScene.coordinates.pokerTableLabelOffsets.y, "加入旁观")
                .setColor('white')
                .setFontSize(20)
                .setShadow(2, 2, "#333333", 2, true, true)

            this.gameScene.pokerTableChairImg[i].chairImgs = []
            this.gameScene.pokerTableChairNames[i].chairNames = []
            for (let j = 0; j < 4; j++) {
                var thisChairX = thisTableX + this.gameScene.coordinates.pokerChairOffsets[j].x;
                var thisChairY = thisTableY + this.gameScene.coordinates.pokerChairOffsets[j].y;
                this.gameScene.pokerTableChairNames[i].chairNames[j] = {
                    myOwnName: undefined,
                    observerNames: [],
                }
                if (roomStateList[i].CurrentGameState.Players[j] != null) {
                    var obCount = roomStateList[i].CurrentGameState.Players[j].Observers.length
                    var obOffsetY = 20
                    var myOwnOffsetY = 0
                    if (j == 0) {
                        myOwnOffsetY = obOffsetY
                    }
                    this.gameScene.pokerTableChairNames[i].chairNames[j].myOwnName = this.gameScene.add.text(thisChairX + 10, thisChairY + 20 - obCount * myOwnOffsetY, roomStateList[i].CurrentGameState.Players[j].PlayerId).setColor('white').setFontSize(20).setShadow(2, 2, "#333333", 2, true, true);
                    if (obCount > 0) {
                        this.gameScene.pokerTableChairNames[i].chairNames[j].observerNames = []
                        for (let k = 0; k < roomStateList[i].CurrentGameState.Players[j].Observers.length; k++) {
                            this.gameScene.pokerTableChairNames[i].chairNames[j].observerNames[k] = this.gameScene.add.text(thisChairX + 10, thisChairY + 20 - obCount * myOwnOffsetY + (k + 1) * obOffsetY, `【${roomStateList[i].CurrentGameState.Players[j].Observers[k]}】`).setColor('white').setFontSize(20).setShadow(2, 2, "#333333", 2, true, true);
                        }
                    }
                } else {
                    this.gameScene.pokerTableChairImg[i].chairImgs[j] = this.gameScene.add.image(thisChairX, thisChairY, 'pokerChair')
                        .setOrigin(0, 0).setDisplaySize(80, 80)
                        .setInteractive({ useHandCursor: true })
                        .on('pointerup', () => {
                            if (this.modalForm) return
                            this.destroyGameHall();
                            this.gameScene.sendMessageToServer(PLAYER_ENTER_ROOM_REQUEST, this.gameScene.playerName, JSON.stringify({
                                roomID: i,
                                posID: j,
                            }))
                        })
                        .on('pointerover', () => {
                            if (this.modalForm) return
                            this.gameScene.pokerTableChairImg[i].chairImgs[j].y -= 5
                            this.gameScene.pokerTableChairNames[i].chairNames[j].myOwnName.y -= 5
                        })
                        .on('pointerout', () => {
                            if (this.modalForm) return
                            this.gameScene.pokerTableChairImg[i].chairImgs[j].y += 5
                            this.gameScene.pokerTableChairNames[i].chairNames[j].myOwnName.y += 5
                        })
                    this.gameScene.pokerTableChairNames[i].chairNames[j].myOwnName = this.gameScene.add.text(thisChairX + 35, thisChairY + 20, `${j + 1}`).setColor('yellow').setFontSize(20).setShadow(2, 2, "#333333", 2, true, true);
                }
            }
        }
    }

    public NotifyEmojiEventHandler(playerID: string, emojiType: number, emojiIndex: number, isCenter: boolean, msgString: string) {
        let isPlayerInGameHall = this.gameScene.isInGameHall();
        if (0 <= emojiType && emojiType < CommonMethods.winEmojiTypeLength && Object.keys(this.PlayerPosition).includes(playerID)) {
            msgString = CommonMethods.emojiMsgs[emojiType];
            if (!isPlayerInGameHall) {
                this.drawingFormHelper.DrawEmojiByPosition(this.PlayerPosition[playerID], emojiType, emojiIndex, isCenter);
            }
        }
        if (isCenter) return;
        let finalMsg = "";
        if (!isPlayerInGameHall && this.sgDrawingHelper.hiddenEffects[msgString]) {
            if (this.isInHiddenGames()) {
                finalMsg = `【${playerID}】发动了隐藏技：【${msgString}】，因为游戏中已屏蔽`;
            } else {
                this.sgDrawingHelper.hiddenEffects[msgString].apply(this.sgDrawingHelper);
                finalMsg = `【${playerID}】发动了隐藏技：【${msgString}】`;
            }
        } else if (!isPlayerInGameHall && this.sgDrawingHelper.hiddenGames[msgString]) {
            if (this.isInHiddenGames()) {
                finalMsg = `【${playerID}】发动了隐藏技：【${msgString}】，因为游戏中已屏蔽`;
            } else {
                finalMsg = `【${playerID}】发动了隐藏技：【${msgString}】`;
                if (this.tractorPlayer.MyOwnId === playerID) this.sgDrawingHelper.hiddenGames[msgString].apply(this.sgDrawingHelper, [true, playerID]);
            }
        } else {
            finalMsg = `【${playerID}】说：${msgString}`;
        }
        this.drawingFormHelper.DrawDanmu(finalMsg);
        this.appendChatMsg(finalMsg);
    }

    public isInHiddenGames(): boolean {
        return this.sgDrawingHelper.hiddenGamesImages &&
            this.sgDrawingHelper.hiddenGamesImages.length > 0 &&
            this.sgDrawingHelper.hiddenGamesImages[0].visible
    }

    public appendChatMsg(finalMsg: string) {
        let p = document.createElement("p");
        p.innerText = finalMsg
        let divChatHistory = this.chatForm.getChildByID("divChatHistory");
        divChatHistory.appendChild(p);
        divChatHistory.scrollTop = divChatHistory.scrollHeight;
    }

    public NotifyOnlinePlayerListEventHandler(playerID: string, isJoining: boolean, onlinePlayerList: string[]) {
        let isJoingingStr = isJoining ? "加入" : "退出";
        let chatMsg = `【${playerID}】${isJoingingStr}了游戏`;
        this.appendChatMsg(chatMsg);

        if (!this.gameScene.isInGameRoom) return;
        let divOnlinePlayerList = this.chatForm.getChildByID("divOnlinePlayerList");
        divOnlinePlayerList.innerHTML = '';
        let header = document.createElement("p");
        header.innerText = "在线玩家";
        header.style.fontWeight = 'bold';
        divOnlinePlayerList.appendChild(header);

        for (let i = 0; i < onlinePlayerList.length; i++) {
            let d = document.createElement("div");
            d.innerText = `【${onlinePlayerList[i]}】`;
            divOnlinePlayerList.appendChild(d);
        }
        divOnlinePlayerList.scrollTop = divOnlinePlayerList.scrollHeight;
    }

    public CutCardShoeCardsEventHandler() {
        let cutInfo = ""
        let cutPoint = -1;
        if (this.IsDebug || this.modalForm || this.gameScene.noCutCards.toLowerCase() === "true") {
            cutPoint = 0;
            cutInfo = `取消,${cutPoint}`;
            this.CutCardShoeCardsCompleteEventHandler(cutPoint, cutInfo);
            return;
        }

        this.modalForm = this.gameScene.add.dom(this.gameScene.coordinates.screenWid * 0.5, this.gameScene.coordinates.screenHei * 0.5).createFromCache('cutCardsForm');
        this.gameScene.decadeUICanvas.style.zIndex = "-1000";

        let btnRandom = this.modalForm.getChildByID("btnRandom")
        btnRandom.onclick = () => {
            cutPoint = CommonMethods.GetRandomInt(107) + 1;
            cutInfo = `${btnRandom.value},${cutPoint}`;
            this.CutCardShoeCardsCompleteEventHandler(cutPoint, cutInfo);
        }

        let btnCancel = this.modalForm.getChildByID("btnCancel")
        btnCancel.onclick = () => {
            cutPoint = 0;
            cutInfo = `${btnCancel.value},${cutPoint}`;
            this.CutCardShoeCardsCompleteEventHandler(cutPoint, cutInfo);
        }

        let btnBapi1 = this.modalForm.getChildByID("btnBapi1")
        btnBapi1.onclick = () => {
            cutPoint = 1;
            cutInfo = `${btnBapi1.value},${cutPoint}`;
            this.CutCardShoeCardsCompleteEventHandler(cutPoint, cutInfo);
        }

        let btnBapi3 = this.modalForm.getChildByID("btnBapi3")
        btnBapi3.onclick = () => {
            cutPoint = 3;
            cutInfo = `${btnBapi3.value},${cutPoint}`;
            this.CutCardShoeCardsCompleteEventHandler(cutPoint, cutInfo);
        }

        let btnManual = this.modalForm.getChildByID("btnManual")
        btnManual.onclick = () => {
            let txtManual = this.modalForm.getChildByID("txtManual")
            let cutPointStr = txtManual.value;
            if (CommonMethods.IsNumber(cutPointStr)) {
                cutPoint = parseInt(cutPointStr);
            }
            cutInfo = `${btnManual.value},${cutPoint}`;
            this.CutCardShoeCardsCompleteEventHandler(cutPoint, cutInfo);
        }
    }
    public CutCardShoeCardsCompleteEventHandler(cutPoint: number, cutInfo: string) {
        if (cutPoint < 0 || cutPoint > 108) {
            alert("请输入0-108之间的数字");
        } else {
            this.gameScene.sendMessageToServer(CommonMethods.PlayerHasCutCards_REQUEST, this.tractorPlayer.MyOwnId, cutInfo);
            this.DesotroyModalForm();
        }
    }
}
