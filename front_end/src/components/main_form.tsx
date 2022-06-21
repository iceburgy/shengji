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

const ReadyToStart_REQUEST = "ReadyToStart"
const ToggleIsRobot_REQUEST = "ToggleIsRobot"
const ObserveNext_REQUEST = "ObserveNext"
const ExitRoom_REQUEST = "ExitRoom"
const SendEmoji_REQUEST = "SendEmoji"
const StoreDiscardedCards_REQUEST = "StoreDiscardedCards"
const PlayerShowCards_REQUEST = "PlayerShowCards"
const ValidateDumpingCards_REQUEST = "ValidateDumpingCards"
const CardsReady_REQUEST = "CardsReady"
const ResumeGameFromFile_REQUEST = "ResumeGameFromFile"
const RandomSeat_REQUEST = "RandomSeat"
const PLAYER_ENTER_ROOM_REQUEST = "PlayerEnterRoom"

export class MainForm {
    public gameScene: GameScene
    public tractorPlayer: TractorPlayer
    public btnReady: Phaser.GameObjects.Text
    public btnRobot: Phaser.GameObjects.Text
    public btnObserveNext: Phaser.GameObjects.Text
    public btnExitRoom: Phaser.GameObjects.Text
    public btnSendEmoji: Phaser.GameObjects.Text
    public btnPig: Phaser.GameObjects.Text

    public lblNickNames: Phaser.GameObjects.Text[]
    public lblStarters: Phaser.GameObjects.Text[]

    public PlayerPosition: any
    public PositionPlayer: any
    public myCardIsReady: boolean[]
    public SelectedCards: number[]
    public cardsOrderNumber: number

    public enableSound: boolean
    public drawingFormHelper: DrawingFormHelper
    public IsDebug: boolean
    public timerIntervalID: any[]
    public timerCountDown: number
    public timerImage: Phaser.GameObjects.Text
    public modalForm: any
    public firstWinNormal = 1;
    public firstWinBySha = 3;
    constructor(gs: GameScene) {
        this.gameScene = gs
        this.tractorPlayer = new TractorPlayer(this)
        this.drawingFormHelper = new DrawingFormHelper(this)
        this.PlayerPosition = {}
        this.PositionPlayer = {}
        this.myCardIsReady = []
        this.cardsOrderNumber = 0
        this.enableSound = true
        this.IsDebug = false
        this.SelectedCards = []
        this.timerIntervalID = []
        this.timerCountDown = 0

        // 就绪按钮
        this.btnReady = this.gameScene.add.text(Coordinates.btnReadyPosition.x, Coordinates.btnReadyPosition.y, '就绪')
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
        this.btnRobot = this.gameScene.add.text(Coordinates.btnRobotPosition.x, Coordinates.btnRobotPosition.y, '托管')
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

        // 旁观下家
        this.btnObserveNext = this.gameScene.add.text(Coordinates.btnReadyPosition.x, Coordinates.btnReadyPosition.y, '旁观下家')
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.btnObserveNext_Click())
            .on('pointerover', () => {
                this.btnObserveNext.setStyle({ backgroundColor: 'lightblue' })
            })
            .on('pointerout', () => {
                this.btnObserveNext.setStyle({ backgroundColor: 'gray' })
            })
        this.gameScene.roomUIControls.texts.push(this.btnObserveNext)

        // 退出按钮
        this.btnExitRoom = this.gameScene.add.text(Coordinates.btnExitRoomPosition.x, Coordinates.btnExitRoomPosition.y, '退出')
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.btnExitRoom_Click())
            .on('pointerover', () => {
                this.btnExitRoom.setStyle({ backgroundColor: 'lightblue' })
            })
            .on('pointerout', () => {
                this.btnExitRoom.setStyle({ backgroundColor: 'gray' })
            })
        this.gameScene.roomUIControls.texts.push(this.btnExitRoom)

        // 表情包按钮
        this.btnSendEmoji = this.gameScene.add.text(Coordinates.btnSendEmojiPosition.x, Coordinates.btnSendEmojiPosition.y, '弹幕')
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.btnSendEmoji_Click())
            .on('pointerover', () => {
                this.btnSendEmoji.setStyle({ backgroundColor: 'lightblue' })
            })
            .on('pointerout', () => {
                this.btnSendEmoji.setStyle({ backgroundColor: 'gray' })
            })
        this.gameScene.roomUIControls.texts.push(this.btnSendEmoji)

        // 确定按钮
        this.btnPig = this.gameScene.add.text(Coordinates.btnPigPosition.x, Coordinates.btnPigPosition.y, '确定')
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
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
            var lblNickName = this.gameScene.add.text(Coordinates.playerTextPositions[i].x, Coordinates.playerTextPositions[i].y, "")
                .setColor('white')
                .setFontSize(30)
                .setPadding(10)
                .setShadow(2, 2, "#333333", 2, true, true)
                .setVisible(false)
            if (i == 0) {
                lblNickName.setText(this.gameScene.playerName)
                    .setVisible(true)
                    .setShadow(2, 2, "#333333", 2, true, true)
                    .setStyle({ backgroundColor: 'gray' })
                    .setInteractive({ useHandCursor: true })
                    .on('pointerover', () => {
                        this.lblNickNames[i].setStyle({ backgroundColor: 'lightblue' })
                    })
                    .on('pointerout', () => {
                        this.lblNickNames[i].setStyle({ backgroundColor: 'gray' })
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

        // 状态
        this.lblStarters = []
        for (let i = 0; i < 4; i++) {
            var lblStarter = this.gameScene.add.text(Coordinates.playerStarterPositions[i].x, Coordinates.playerStarterPositions[i].y, "")
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

        this.timerImage = this.gameScene.add.text(Coordinates.countDownPosition.x, Coordinates.countDownPosition.y, "")
            .setColor("orange")
            .setFontSize(Coordinates.countDownSzie)
            .setStyle({ fontWeight: "bold" })
            .setVisible(false)

        this.gameScene.input.on('pointerdown', (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
            // only if it is not clicking on any objects
            if (!currentlyOver || currentlyOver.length == 0) {
                this.handleGeneralClick(pointer)
            }
        });

        // 快捷键
        this.gameScene.input.keyboard.on('keyup', this.shortcutKeyEventhandler, this)
    }

    public NewPlayerReadyToStart(readyToStart: boolean) {
        if (CommonMethods.GetReadyCount(this.tractorPlayer.CurrentGameState.Players) < 4) {
            this.btnReady.setInteractive({ useHandCursor: true })
            this.btnReady.setColor('white')
        } else {
            this.btnReady.disableInteractive()
            this.btnReady.setColor('gray')
        }
        this.btnReady.setText(readyToStart ? "取消" : "就绪")
        this.setStartLabels()
    }

    public PlayerToggleIsRobot(isRobot: boolean) {
        this.btnRobot.setText(isRobot ? "取消" : "托管")
        this.setStartLabels()

        let shouldTrigger = isRobot && isRobot != this.IsDebug;
        this.IsDebug = isRobot;
        this.btnRobot.setText(isRobot ? "取消" : "托管")

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

        this.btnExitRoom.setVisible(true)
        if (!this.tractorPlayer.isObserver) {
            this.btnReady.setVisible(true)
            this.btnRobot.setVisible(true)
            this.btnSendEmoji.setVisible(true);
        }
        else {
            this.btnObserveNext.setVisible(true)
        }

        var curIndex = CommonMethods.GetPlayerIndexByID(this.tractorPlayer.CurrentGameState.Players, this.tractorPlayer.PlayerId)
        for (let i = 0; i < 4; i++) {
            this.lblNickNames[i].setVisible(true)
            var p = this.tractorPlayer.CurrentGameState.Players[curIndex]
            if (p) {
                //set player position
                this.PlayerPosition[p.PlayerId] = i + 1;
                this.PositionPlayer[i + 1] = p.PlayerId;

                var nickNameText = p.PlayerId
                p.Observers.forEach(ob => {
                    var newLine = i == 0 ? "" : "\n";
                    nickNameText += `${newLine}【${ob}】`

                })
                this.lblNickNames[i].setText(nickNameText)
            } else {
                this.lblNickNames[i].setText("")
            }
            curIndex = (curIndex + 1) % 4
        }


        /*
            bool isHelpSeen = FormSettings.GetSettingBool(FormSettings.KeyIsHelpSeen);
            if (!isHelpSeen && meJoined)
            {
                this.ToolStripMenuItemUserManual.PerformClick();
            }
        */
    }

    public ReenterOrResumeEvent() {
        this.drawingFormHelper.DrawSidebarFull();
        this.tractorPlayer.playerLocalCache.ShowedCardsInCurrentTrick = CommonMethods.deepCopy<any>(this.tractorPlayer.CurrentTrickState.ShowedCards);
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
        this.gameScene.roomUIControls.texts.forEach(text => {
            text.setVisible(false)
        })
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
            this.tractorPlayer.ShowLastTrickCards = false;
            this.PlayerCurrentTrickShowedCards();
        }

        if (!this.IsDebug && this.tractorPlayer.CurrentTrickState.NextPlayer() == this.tractorPlayer.PlayerId)
            this.drawingFormHelper.DrawMyPlayingCards();

        //即时更新旁观手牌
        if (this.tractorPlayer.isObserver && this.tractorPlayer.PlayerId == latestPlayer) {
            this.tractorPlayer.CurrentPoker.CloneFrom(this.tractorPlayer.CurrentHandState.PlayerHoldingCards[this.tractorPlayer.PlayerId])
            this.drawingFormHelper.ResortMyHandCards();
        }

        if (winResult > 0) this.drawingFormHelper.DrawOverridingFlag(showedCards.length, this.PlayerPosition[this.tractorPlayer.playerLocalCache.WinnderID], this.tractorPlayer.playerLocalCache.WinResult - 1);

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
                this.ToShowCards();
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
                        //将选定的牌向上提升 via myCardIsReady
                        this.myCardIsReady[i] = true;
                        this.SelectedCards.push(serverCardNumber);
                        tempSelectedCards = CommonMethods.ArrayRemoveOneByValue(tempSelectedCards, serverCardNumber);
                    }
                }

                this.drawingFormHelper.DrawMyPlayingCards();
                this.gameScene.sendMessageToServer(CardsReady_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.myCardIsReady));
            }
        }
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
                this.ToShowCards();
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

    private setStartLabels() {
        var curIndex = CommonMethods.GetPlayerIndexByID(this.tractorPlayer.CurrentGameState.Players, this.tractorPlayer.PlayerId)
        for (let i = 0; i < 4; i++) {
            this.lblStarters[i].setVisible(true)

            var curPlayer = this.tractorPlayer.CurrentGameState.Players[curIndex];
            if (curPlayer && curPlayer.IsOffline) {
                this.lblStarters[i].setText("离线中")
            }
            else if (curPlayer && curPlayer.IsRobot) {
                this.lblStarters[i].setText("托管中")
            }
            else if (curPlayer && !curPlayer.IsReadyToStart) {
                this.lblStarters[i].setText("思索中")
            }
            else if (curPlayer && this.tractorPlayer.CurrentHandState.Starter && curPlayer.PlayerId == this.tractorPlayer.CurrentHandState.Starter) {
                this.lblStarters[i].setText("庄家")
            }
            else {
                this.lblStarters[i].setText(`${curIndex + 1}`)
            }
            curIndex = (curIndex + 1) % 4
        }
    }

    private btnReady_Click() {
        if (this.tractorPlayer.isObserver || !this.btnReady.input.enabled) return;
        //为防止以外连续点两下就绪按钮，造成重复发牌，点完一下就立即disable就绪按钮
        this.btnReady.disableInteractive()
        this.btnReady.setColor('gray')

        this.gameScene.sendMessageToServer(ReadyToStart_REQUEST, this.tractorPlayer.PlayerId, "")
    }

    private btnRobot_Click() {
        this.gameScene.sendMessageToServer(ToggleIsRobot_REQUEST, this.tractorPlayer.PlayerId, "")
    }

    private btnObserveNext_Click() {
        if (this.tractorPlayer.isObserver) {
            this.gameScene.sendMessageToServer(ObserveNext_REQUEST, this.tractorPlayer.MyOwnId, this.PositionPlayer[2])
        }
    }

    private btnExitRoom_Click() {
        // todo && !this.tractorPlayer.isReplay
        if (CommonMethods.AllOnline(this.tractorPlayer.CurrentGameState.Players) && !this.tractorPlayer.isObserver && this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing) {
            var c = window.confirm("游戏进行中退出将会重启游戏，是否确定退出？");
            if (c == true) {
                window.location.reload()
                return
            } else {
                return
            }
        }
        this.gameScene.sendMessageToServer(ExitRoom_REQUEST, this.tractorPlayer.MyOwnId, "")
    }

    private btnSendEmoji_Click() {
        if (this.modalForm) return
        // disable shortcut keys temporarily to allow typing
        // this.gameScene.input.keyboard.removeCapture('1,2,3,Z,S,R');

        this.modalForm = this.gameScene.add.dom(Coordinates.screenWid * 0.5, Coordinates.screenHei * 0.5).createFromCache('emojiForm');
        this.modalForm.addListener('click');
        this.modalForm.setPerspective(800);
        let selectPresetMsgs = this.modalForm.getChildByID("selectPresetMsgs")
        let textAreaMsg = this.modalForm.getChildByID("textAreaMsg")
        textAreaMsg.style.width = `${selectPresetMsgs.offsetWidth}px`;
        selectPresetMsgs.onchange = () => {
            let selectedIndex = selectPresetMsgs.selectedIndex;
            let selectedValue = selectPresetMsgs.value;
            let args: (string | number)[] = [selectedIndex, CommonMethods.GetRandomInt(CommonMethods.winEmojiLength), selectedValue];
            this.gameScene.sendMessageToServer(SendEmoji_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(args))
            this.resetDanmuState();
        }
        let btnDanmuHistory = this.modalForm.getChildByID("btnDanmuHistory")
        btnDanmuHistory.onclick = () => {
            let sendEmojiContainer = this.modalForm.getChildByID("sendEmojiContainer")
            sendEmojiContainer.remove()
            let divShowDanmuHistory = this.modalForm.getChildByID("divShowDanmuHistory")
            var h2 = document.createElement("h2");
            h2.innerText = "聊天记录"
            divShowDanmuHistory.appendChild(h2);
            if (this.gameScene.danmuHistory.length == 0) {
                var pEmpty = document.createElement("p");
                pEmpty.innerText = "空"
                divShowDanmuHistory.appendChild(pEmpty);
            } else {
                var ul = document.createElement("ul");
                divShowDanmuHistory.appendChild(ul);
                this.gameScene.danmuHistory.forEach((msg: string) => {
                    var li = document.createElement("li");
                    li.innerText = msg
                    ul.appendChild(li);
                })
            }
            divShowDanmuHistory.style.display = "block";
        }
    }

    private emojiSubmitEventhandler() {
        if (!this.modalForm) return;
        let selectPresetMsgs = this.modalForm.getChildByID("selectPresetMsgs")
        if (!selectPresetMsgs) return;
        let textAreaMsg = this.modalForm.getChildByID("textAreaMsg")
        let emojiType = -1;
        let emojiIndex = -1;
        let msgString = textAreaMsg.value;
        if (msgString) {
            msgString = msgString.trim()
        }
        if (!msgString) {
            msgString = selectPresetMsgs.value;
            emojiType = selectPresetMsgs.selectedIndex;
            emojiIndex = CommonMethods.GetRandomInt(CommonMethods.winEmojiLength);
        }
        let args: (string | number)[] = [emojiType, emojiIndex, msgString];
        this.gameScene.sendMessageToServer(SendEmoji_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(args))
        this.resetDanmuState();
    }

    private shortcutKeyEventhandler(event: KeyboardEvent) {
        if (!event || !event.key) return;
        let ekey: string = event.key.toLowerCase();
        switch (ekey) {
            case 'z':
                if (this.modalForm) return;
                this.btnReady_Click();
                return;
            case 's':
                if (this.modalForm) return;
                this.btnPig_Click();
                return;
            case 'r':
                if (this.modalForm) return;
                this.btnRobot_Click();
                return;
            case 'enter':
                this.emojiSubmitEventhandler();
                return;
            default:
                break;
        }

        if ('1' <= ekey && ekey <= CommonMethods.emojiMsgs.length.toString() && !this.modalForm) {
            if (!this.btnSendEmoji.input.enabled) return;
            let emojiType = parseInt(ekey) - 1;
            let emojiIndex = CommonMethods.GetRandomInt(CommonMethods.winEmojiLength);
            let msgString = CommonMethods.emojiMsgs[emojiType]
            let args: (string | number)[] = [emojiType, emojiIndex, msgString];
            this.gameScene.sendMessageToServer(SendEmoji_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(args))
            this.resetDanmuState();
        }
    }

    private resetDanmuState() {
        this.btnSendEmoji.disableInteractive()
        this.btnSendEmoji.setColor('gray')
        this.DesotroyModalForm();
        setTimeout(() => {
            this.btnSendEmoji.setInteractive({ useHandCursor: true })
            this.btnSendEmoji.setColor('white')
        }, 5000);
    }

    private lblNickName_Click() {
        if (this.modalForm) return
        this.modalForm = this.gameScene.add.dom(Coordinates.screenWid * 0.5, Coordinates.screenHei * 0.5).createFromCache('settingsForm');
        this.modalForm.addListener('click');
        this.modalForm.setPerspective(800);

        let volumeControl = this.modalForm.getChildByID("rangeAudioVolume")
        volumeControl.value = Math.floor(this.gameScene.soundVolume * 100)
        volumeControl.onchange = () => {
            let volValue: number = volumeControl.value
            this.gameScene.soundVolume = volValue / 100.0
            this.gameScene.loadAudioFiles()
            this.gameScene.soundbiyue1.play()
        }

        let noDanmu = this.modalForm.getChildByID("cbxNoDanmu")
        noDanmu.checked = this.gameScene.noDanmu.toLowerCase() === "true"
        noDanmu.onchange = () => {
            this.gameScene.noDanmu = noDanmu.checked.toString()
        }

        if (this.gameScene.isInGameHall() || this.tractorPlayer.CurrentRoomSetting.RoomOwner !== this.tractorPlayer.MyOwnId) {
            let pResumeGame = this.modalForm.getChildByID("pResumeGame")
            let pRandomSeat = this.modalForm.getChildByID("pRandomSeat")
            pResumeGame.remove()
            pRandomSeat.remove()
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
        }
    }

    private btnPig_Click() {
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

            setTimeout(() => {
                result.MustShowCardsForDumpingFail.forEach(card => {
                    this.tractorPlayer.CurrentPoker.RemoveCard(card);
                })
                this.SelectedCards = CommonMethods.deepCopy<number[]>(result.MustShowCardsForDumpingFail)
                this.ShowCards();
                this.drawingFormHelper.ResortMyHandCards();
                this.SelectedCards = []
            }, 5000);
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
                let player: string = key;
                let cards: number[] = value as number[]
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
                this.tractorPlayer.playerLocalCache.WinResult - 1);
        }
    }

    // 点空白区
    private handleGeneralClick(pointer: Phaser.Input.Pointer) {
        if (pointer.rightButtonDown()) {
            // 右键点空白区
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
        } else {
            // 左键键点空白区
            if (this.modalForm) {
                this.gameScene.loadAudioFiles()
                this.gameScene.saveSettings()
                this.DesotroyModalForm();
            }
        }
    }

    private DesotroyModalForm() {
        if (!this.modalForm) return;
        this.modalForm.destroy();
        this.modalForm = undefined;
    }

    private ShowLastTrickAndTumpMade() {
        //擦掉上一把
        this.drawingFormHelper.destroyAllShowedCards()
        this.tractorPlayer.destroyAllClientMessages()

        this.tractorPlayer.NotifyMessage(["回看上轮出牌"]);

        //绘制上一轮各家所出的牌，缩小至一半，放在左下角，或者重画当前轮各家所出的牌
        this.PlayerLastTrickShowedCards();

        //查看谁亮过什么牌
        this.drawingFormHelper.TrumpMadeCardsShowFromLastTrick();
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
            let position = this.PlayerPosition[key];
            let cards: number[] = value as number[]
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
    }

    public destroyGameHall() {
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
        this.gameScene.hallPlayerHeader = this.gameScene.add.text(Coordinates.hallPlayerHeaderPosition.x, Coordinates.hallPlayerHeaderPosition.y, "在线").setColor('white').setFontSize(30).setShadow(2, 2, "#333333", 2, true, true)
        for (let i = 0; i < playerList.length; i++) {
            this.gameScene.hallPlayerNames[i] = this.gameScene.add.text(Coordinates.hallPlayerTopPosition.x, Coordinates.hallPlayerTopPosition.y + i * 40, playerList[i]).setColor('white').setFontSize(20).setShadow(2, 2, "#333333", 2, true, true);
        }

        for (let i = 0; i < roomStateList.length; i++) {
            var thisTableX = Coordinates.pokerTablePositionStart.x + Coordinates.pokerTableOffsets.x * (i % 2)
            var thisTableY = Coordinates.pokerTablePositionStart.y + Coordinates.pokerTableOffsets.y * Math.floor(i / 2)
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
            this.gameScene.pokerTableChairNames[i].tableName = this.gameScene.add.text(thisTableX + Coordinates.pokerTableLabelOffsets.x, thisTableY + Coordinates.pokerTableLabelOffsets.y, roomStateList[i].roomSetting.RoomName)
                .setColor('white')
                .setFontSize(20)
                .setShadow(2, 2, "#333333", 2, true, true)

            this.gameScene.pokerTableChairImg[i].chairImgs = []
            this.gameScene.pokerTableChairNames[i].chairNames = []
            for (let j = 0; j < 4; j++) {
                var thisChairX = thisTableX + Coordinates.pokerChairOffsets[j].x;
                var thisChairY = thisTableY + Coordinates.pokerChairOffsets[j].y;
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
        if (!msgString && 0 <= emojiType && emojiType < CommonMethods.winEmojiTypeLength) {
            msgString = CommonMethods.emojiMsgs[emojiType];
        }
        let finalMsg = `【${playerID}】说：${msgString}`;
        this.gameScene.danmuHistory.push(finalMsg);
        this.drawingFormHelper.DrawDanmu(playerID, finalMsg);
    }
}
