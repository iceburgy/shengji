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

const ReadyToStart_REQUEST = "ReadyToStart"
const ToggleIsRobot_REQUEST = "ToggleIsRobot"
const ObserveNext_REQUEST = "ObserveNext"
const ExitRoom_REQUEST = "ExitRoom"
const StoreDiscardedCards_REQUEST = "StoreDiscardedCards"
const PlayerShowCards_REQUEST = "PlayerShowCards"
const ValidateDumpingCards_REQUEST = "ValidateDumpingCards"
const CardsReady_REQUEST = "CardsReady"

const screenWidth = document.documentElement.clientWidth;
const screenHeight = document.documentElement.clientHeight;

const btnLowerSize = 100
const btnReadyPosition = { x: 10, y: screenHeight - 60 }
const btnRobotPosition = { x: btnReadyPosition.x + btnLowerSize, y: screenHeight - 60 }
const btnExitRoomPosition = { x: screenWidth - 110, y: btnReadyPosition.y }
const btnSendEmojiPosition = { x: btnExitRoomPosition.x - btnLowerSize, y: btnReadyPosition.y }

export class MainForm {
    public gameScene: GameScene
    public tractorPlayer: TractorPlayer
    public btnReady: Phaser.GameObjects.Text
    public btnRobot: Phaser.GameObjects.Text
    public btnObserveNext: Phaser.GameObjects.Text
    public btnExitRoom: Phaser.GameObjects.Text
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

        // 就绪按钮
        this.btnReady = this.gameScene.add.text(btnReadyPosition.x, btnReadyPosition.y, '就绪')
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.btnReady_Click(this))
            .on('pointerover', () => {
                this.btnReady.setStyle({ backgroundColor: 'lightblue' })
            })
            .on('pointerout', () => {
                this.btnReady.setStyle({ backgroundColor: 'gray' })
            })
        this.gameScene.roomUIControls.texts.push(this.btnReady)

        // 托管按钮
        this.btnRobot = this.gameScene.add.text(btnRobotPosition.x, btnRobotPosition.y, '托管')
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.btnRobot_Click(this))
            .on('pointerover', () => {
                this.btnRobot.setStyle({ backgroundColor: 'lightblue' })
            })
            .on('pointerout', () => {
                this.btnRobot.setStyle({ backgroundColor: 'gray' })
            })
        this.gameScene.roomUIControls.texts.push(this.btnRobot)

        // 旁观下家
        this.btnObserveNext = this.gameScene.add.text(btnReadyPosition.x, btnReadyPosition.y, '旁观下家')
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.btnObserveNext_Click(this))
            .on('pointerover', () => {
                this.btnObserveNext.setStyle({ backgroundColor: 'lightblue' })
            })
            .on('pointerout', () => {
                this.btnObserveNext.setStyle({ backgroundColor: 'gray' })
            })
        this.gameScene.roomUIControls.texts.push(this.btnObserveNext)

        // todo: 表情包按钮
        // this.btnExitRoom = this.gameScene.add.text(btnExitRoomPosition.x, btnExitRoomPosition.y, '退出')
        //     .setColor('white')
        //     .setFontSize(30)
        //     .setPadding(10)
        //     .setShadow(2, 2, "#333333", 2, true, true)
        //     .setStyle({ backgroundColor: 'gray' })
        //     .setVisible(false)
        //     .setInteractive({ useHandCursor: true })
        //     .on('pointerup', () => this.btnExitRoom_Click(this))
        //     .on('pointerover', () => {
        //         this.btnExitRoom.setStyle({ backgroundColor: 'lightblue' })
        //     })
        //     .on('pointerout', () => {
        //         this.btnExitRoom.setStyle({ backgroundColor: 'gray' })
        //     })
        // this.gameScene.roomUIControls.texts.push(this.btnExitRoom)

        // 退出按钮
        this.btnExitRoom = this.gameScene.add.text(btnExitRoomPosition.x, btnExitRoomPosition.y, '退出')
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.btnExitRoom_Click(this))
            .on('pointerover', () => {
                this.btnExitRoom.setStyle({ backgroundColor: 'lightblue' })
            })
            .on('pointerout', () => {
                this.btnExitRoom.setStyle({ backgroundColor: 'gray' })
            })
        this.gameScene.roomUIControls.texts.push(this.btnExitRoom)

        // 确定按钮
        this.btnPig = this.gameScene.add.text(Coordinates.btnPigPosition.x, Coordinates.btnPigPosition.y, '确定')
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.btnPig_Click(this))
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
                lblNickName.setText(this.gameScene.playerName).setVisible(true)
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
        if (this.gameScene.hallPlayerHeader.visible) {
            this.gameScene.destroyGameHall()
            this.init();
        }

        this.btnExitRoom.setVisible(true)
        if (!this.tractorPlayer.isObserver) {
            this.btnReady.setVisible(true)
            this.btnRobot.setVisible(true)


            // this.btnSendEmoji.Show();
            // this.cbbEmoji.Show();
            // this.ToolStripMenuItemInRoom.Visible = true;
        }
        else {
            this.btnObserveNext.setVisible(true)
            // this.ToolStripMenuItemObserve.Visible = true;
        }
        // this.btnRoomSetting.Show();

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
        // this.tractorPlayer.playerLocalCache.ShowedCardsInCurrentTrick = this.tractorPlayer.CurrentTrickState.ShowedCards.ToDictionary(entry => entry.Key, entry => entry.Value.ToList());
        // this.ThisPlayer_PlayerCurrentTrickShowedCards();
        // drawingFormHelper.DrawMyPlayingCards(ThisPlayer.CurrentPoker);

        // DrawDiscardedCardsCaller();

    }

    public TrumpChanged(currentHandState: CurrentHandState) {
        if (SuitEnums.HandStep.DistributingCards <= this.tractorPlayer.CurrentHandState.CurrentHandStep &&
            this.tractorPlayer.CurrentHandState.CurrentHandStep < SuitEnums.HandStep.DistributingLast8Cards) {
            if (this.enableSound) {
                // this.gameScene.soundbiyue1.play()
            }
        }
        this.tractorPlayer.CurrentHandState.CloneFrom(currentHandState)
        // drawingFormHelper.Trump();
        if (this.tractorPlayer.CurrentHandState.CurrentHandStep < SuitEnums.HandStep.DistributingLast8Cards) {
            this.drawingFormHelper.TrumpMadeCardsShow();
        }
        this.drawingFormHelper.reDrawToolbar()
        if (this.tractorPlayer.CurrentHandState.IsFirstHand) {
            // drawingFormHelper.Rank();
            // drawingFormHelper.Starter();
        }
    }

    public destroyGameRoom() {
        this.tractorPlayer.PlayerId = this.tractorPlayer.MyOwnId;
        this.tractorPlayer.isObserver = false;
        this.lblNickNames[0].setText(this.tractorPlayer.MyOwnId)
        this.drawingFormHelper.destroyAllCards()
        this.drawingFormHelper.destroyAllShowedCards()

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
            // this.gameScene.sounddraw.play()
        }

        this.drawingFormHelper.IGetCard();

        // //托管代打：亮牌
        // if (gameConfig.IsDebug && (ThisPlayer.CurrentRoomSetting.IsFullDebug || ThisPlayer.CurrentRoomSetting.AllowRobotMakeTrump) && !ThisPlayer.isObserver)
        // {
        //     var availableTrump = ThisPlayer.AvailableTrumps();
        //     Suit trumpToExpose = Algorithm.TryExposingTrump(availableTrump, this.ThisPlayer.CurrentPoker, ThisPlayer.CurrentRoomSetting.IsFullDebug);
        //     if (trumpToExpose == Suit.None) return;

        //     var next =
        //         (TrumpExposingPoker)
        //             (Convert.ToInt32(ThisPlayer.CurrentHandState.TrumpExposingPoker) + 1);
        //     if (trumpToExpose == Suit.Joker)
        //     {
        //         if (ThisPlayer.CurrentPoker.BlackJoker == 2)
        //             next = TrumpExposingPoker.PairBlackJoker;
        //         else if (ThisPlayer.CurrentPoker.RedJoker == 2)
        //             next = TrumpExposingPoker.PairRedJoker;
        //     }
        //     ThisPlayer.ExposeTrump(next, trumpToExpose);
        // }
    }

    public AllCardsGot() {
        this.drawingFormHelper.DrawMyHandCards()
    }
    public ShowingCardBegan() {
        this.DiscardingLast8();
        this.drawingFormHelper.destroyToolbar();
        this.drawingFormHelper.destroyAllShowedCards();

        // drawingFormHelper.DrawScoreImageAndCards();

        //出牌开始前，去掉不需要的controls
        // this.btnSurrender.Visible = false;
        // this.btnRiot.Visible = false;

    }

    public DistributingLast8Cards() {
        //先去掉反牌按钮，再放发底牌动画
        // drawingFormHelper.ReDrawToolbar();
        //重画手牌，从而把被提升的自己亮的牌放回去
        this.drawingFormHelper.DrawMyPlayingCards();

        let position = this.PlayerPosition[this.tractorPlayer.CurrentHandState.Last8Holder];
        //自己摸底不用画
        if (position > 1) {
            // drawingFormHelper.DrawDistributingLast8Cards(position);
        }
        else {
            //播放摸底音效
            // if (this.enableSound) this.gameScene.sounddrawx.play();
        }

        if (this.tractorPlayer.isObserver) {
            return;
        }

        //摸牌结束，如果处于托管状态，则取消托管
        if (this.btnRobot.text == "取消" && !this.tractorPlayer.CurrentRoomSetting.IsFullDebug) {
            this.btnRobot_Click(this)
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
        // this.timerCountDown = 0;

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
                    this.ToDiscard8Cards(this);
                }
                else {
                    alert(`failed to auto select last 8 cards: ${this.SelectedCards}, please manually select`)
                }
            }
        }
    }

    public Last8Discarded() {
        // if (this.enableSound) this.gameScene.soundtie.play()

        if (this.tractorPlayer.isObserver && this.tractorPlayer.CurrentHandState.Last8Holder == this.tractorPlayer.PlayerId) {
            let tempCP = this.tractorPlayer.CurrentHandState.PlayerHoldingCards[this.tractorPlayer.PlayerId]
            this.tractorPlayer.CurrentPoker.CloneFrom(tempCP);
            this.drawingFormHelper.ResortMyHandCards();
        }
        // DrawDiscardedCardsCaller();
    }

    public StarterChangedEvent() {
        this.setStartLabels()
    }

    public StarterFailedForTrump() {
        // DrawSidebarFull(g);

        this.drawingFormHelper.ResortMyHandCards();

        this.drawingFormHelper.reDrawToolbar();
    }

    public ObservePlayerByIDEvent() {
        let tempCP = this.tractorPlayer.CurrentHandState.PlayerHoldingCards[this.tractorPlayer.PlayerId]
        this.tractorPlayer.CurrentPoker.CloneFrom(tempCP);
        if (this.tractorPlayer.isObserverChanged) {
            this.drawingFormHelper.DrawMyPlayingCards();
            // DrawDiscardedCardsCaller();

            // DrawSidebarFull(g);

            this.tractorPlayer.isObserverChanged = false;
        }
    }

    public PlayerShowedCards() {
        if (!this.tractorPlayer.CurrentHandState.PlayerHoldingCards[this.tractorPlayer.CurrentTrickState.Learder]) return;

        //如果新的一轮开始，重置缓存信息
        if (this.tractorPlayer.CurrentTrickState.CountOfPlayerShowedCards() == 1) {
            this.tractorPlayer.playerLocalCache = new PlayerLocalCache();
        }

        if (this.tractorPlayer.CurrentHandState.PlayerHoldingCards[this.tractorPlayer.CurrentTrickState.Learder].length == 0) {
            this.tractorPlayer.playerLocalCache.isLastTrick = true;
        }

        let latestPlayer = this.tractorPlayer.CurrentTrickState.LatestPlayerShowedCard();
        this.tractorPlayer.playerLocalCache.ShowedCardsInCurrentTrick = CommonMethods.deepCopy<any>(this.tractorPlayer.CurrentTrickState.ShowedCards)

        // let winResult = this.IsWinningWithTrump(this.tractorPlayer.CurrentTrickState, latestPlayer);
        let position = this.PlayerPosition[latestPlayer];
        let showedCards = this.tractorPlayer.CurrentTrickState.ShowedCards[latestPlayer]
        //如果大牌变更，更新缓存相关信息
        // if (winResult >= firstWinNormal)
        // {
        //     if (winResult < firstWinBySha || this.tractorPlayer.playerLocalCache.WinResult < firstWinBySha)
        //     {
        //         this.tractorPlayer.playerLocalCache.WinResult = winResult;
        //     }
        //     else
        //     {
        //         this.tractorPlayer.playerLocalCache.WinResult++;
        //     }
        //     this.tractorPlayer.playerLocalCache.WinnerPosition = position;
        //     this.tractorPlayer.playerLocalCache.WinnderID = latestPlayer;
        // }

        //如果不在回看上轮出牌，才重画刚刚出的牌
        if (!this.tractorPlayer.ShowLastTrickCards) {
            //擦掉上一把
            if (this.tractorPlayer.CurrentTrickState.CountOfPlayerShowedCards() == 1) {
                this.drawingFormHelper.destroyAllShowedCards()
                // drawingFormHelper.DrawScoreImageAndCards();
            }

            //播放出牌音效
            // int soundInex = winResult;
            // if (winResult > 0) soundInex = this.tractorPlayer.playerLocalCache.WinResult;
            // if (!this.tractorPlayer.playerLocalCache.isLastTrick &&
            //     !gameConfig.IsDebug &&
            //     !ThisPlayer.CurrentTrickState.serverLocalCache.muteSound)
            // {
            //     soundPlayersShowCard[soundInex].Play(this.enableSound);
            // }

            this.drawingFormHelper.DrawShowedCardsByPosition(showedCards, position);
        }

        // //如果正在回看并且自己刚刚出了牌，则重置回看，重新画牌
        // if (this.tractorPlayer.ShowLastTrickCards && latestPlayer == ThisPlayer.PlayerId)
        // {
        //     this.tractorPlayer.ShowLastTrickCards = false;
        //     ThisPlayer_PlayerCurrentTrickShowedCards();
        // }

        // if (!gameConfig.IsDebug && this.tractorPlayer.CurrentTrickState.NextPlayer() == this.tractorPlayer.PlayerId)
        //     this.drawingFormHelper.DrawMyPlayingCards(this.tractorPlayer.CurrentPoker);

        //即时更新旁观手牌
        if (this.tractorPlayer.isObserver && this.tractorPlayer.PlayerId == latestPlayer) {
            this.tractorPlayer.CurrentPoker.CloneFrom(this.tractorPlayer.CurrentHandState.PlayerHoldingCards[this.tractorPlayer.PlayerId])
            this.drawingFormHelper.ResortMyHandCards();
        }

        // if (winResult > 0) this.drawingFormHelper.DrawOverridingFlag(this.PlayerPosition[this.tractorPlayer.playerLocalCache.WinnderID], this.tractorPlayer.playerLocalCache.WinResult - 1, 1);

        this.RobotPlayFollowing();
    }

    //托管代打
    private RobotPlayFollowing() {
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
                this.ToShowCards(this);
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
                this.ToShowCards(this);
            }
            else {
                alert(`failed to auto select cards: ${this.SelectedCards}, please manually select`)
            }
        }
    }

    public TrickFinished() {
    }

    public TrickStarted() {
        if (!this.IsDebug && this.tractorPlayer.CurrentTrickState.Learder == this.tractorPlayer.PlayerId) {
            this.drawingFormHelper.DrawMyPlayingCards();
        }
        this.RobotPlayStarting();
    }

    private init() {
        //每次初始化都重绘背景
        this.drawingFormHelper.destroyAllCards()
        this.drawingFormHelper.destroyAllShowedCards()
        this.drawingFormHelper.destroyToolbar()

        // DrawSidebarFull(g);
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

    private btnReady_Click(mf: MainForm) {
        if (mf.tractorPlayer.isObserver) return;
        //为防止以外连续点两下就绪按钮，造成重复发牌，点完一下就立即disable就绪按钮
        mf.btnReady.disableInteractive()
        mf.btnReady.setColor('gray')

        mf.gameScene.sendMessageToServer(ReadyToStart_REQUEST, this.tractorPlayer.PlayerId, "")
    }

    private btnRobot_Click(mf: MainForm) {
        mf.gameScene.sendMessageToServer(ToggleIsRobot_REQUEST, this.tractorPlayer.PlayerId, "")
    }

    private btnObserveNext_Click(mf: MainForm) {
        if (this.tractorPlayer.isObserver) {
            mf.gameScene.sendMessageToServer(ObserveNext_REQUEST, this.tractorPlayer.MyOwnId, this.PositionPlayer[2])
        }
    }

    private btnExitRoom_Click(mf: MainForm) {
        mf.gameScene.sendMessageToServer(ExitRoom_REQUEST, this.tractorPlayer.MyOwnId, "")
    }

    private btnPig_Click(mf: MainForm) {

        this.ToDiscard8Cards(mf);
        this.ToShowCards(mf);
    }
    private ToDiscard8Cards(mf: MainForm) {
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
                mf.gameScene.sendMessageToServer(StoreDiscardedCards_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.SelectedCards))
                this.drawingFormHelper.ResortMyHandCards();
            }
        }
    }
    private ToShowCards(mf: MainForm) {
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

                this.ShowCards(mf);
                this.drawingFormHelper.DrawMyHandCards();
                this.SelectedCards = []
            }
            else if (selectedCardsValidationResult.ResultType == ShowingCardsValidationResult.ShowingCardsValidationResultType.TryToDump) {
                //擦去小猪
                this.btnPig.setVisible(false);
                mf.gameScene.sendMessageToServer(ValidateDumpingCards_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.SelectedCards))
            }
        }
    }

    public ShowCards(mf: MainForm) {
        if (this.tractorPlayer.CurrentTrickState.NextPlayer() == this.tractorPlayer.PlayerId) {
            this.tractorPlayer.CurrentTrickState.ShowedCards[this.tractorPlayer.PlayerId] = CommonMethods.deepCopy<number[]>(this.SelectedCards);
            mf.gameScene.sendMessageToServer(PlayerShowCards_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.tractorPlayer.CurrentTrickState));
        }
    }
    public NotifyDumpingValidationResultEventHandler(result: ShowingCardsValidationResult) {

        //擦掉上一把
        if (this.tractorPlayer.CurrentTrickState.AllPlayedShowedCards() || this.tractorPlayer.CurrentTrickState.IsStarted() == false) {
            this.drawingFormHelper.destroyAllShowedCards();
            //  drawingFormHelper.DrawScoreImageAndCards();
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

            this.ShowCards(this);
            this.drawingFormHelper.DrawMyHandCards();
            this.SelectedCards = []
        }
        //甩牌失败
        else {
            let msgs: string[] = [
                `甩牌${this.SelectedCards.length}张失败`,
                `"罚分：${this.SelectedCards.length * 10}`,
            ]
            this.tractorPlayer.NotifyMessage(this.gameScene, msgs)

            //甩牌失败播放提示音
            // soundPlayerDumpFailure.Play(this.enableSound);

            setTimeout(() => {
                result.MustShowCardsForDumpingFail.forEach(card => {
                    this.tractorPlayer.CurrentPoker.RemoveCard(card);
                })
                this.SelectedCards = CommonMethods.deepCopy<number[]>(result.MustShowCardsForDumpingFail)
                this.ShowCards(this);
                this.drawingFormHelper.DrawMyHandCards();
                this.SelectedCards = []
            }, 5000);
        }
    }
}
