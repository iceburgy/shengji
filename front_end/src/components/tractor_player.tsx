
import { GameScene } from './game_scene';
import { RoomSetting } from './room_setting';
import { CurrentPoker } from './current_poker';
import { GameState } from './game_state';
import { CurrentHandState } from './current_hand_state';
import { CurrentTrickState } from './current_trick_state';
import { PlayerLocalCache } from './player_local_cache';
import { CommonMethods } from './common_methods';
import { PlayerEntity } from './player_entity';
import { MainForm } from './main_form';
import { SuitEnums } from './suit_enums';
import { TractorRules } from './tractor_rules';
import { ShowingCardsValidationResult } from './showing_cards_validation_result';
import { Coordinates } from './coordinates';
import { RoomState } from './room_state';
import { ReplayEntity } from './replay_entity';
import { IDBHelper } from './idb_helper';

const PlayerMakeTrump_REQUEST = "PlayerMakeTrump"
const NotifyPong_REQUEST = "NotifyPong"

export class TractorPlayer {
    public mainForm: MainForm
    public CurrentRoomSetting: RoomSetting
    public CurrentPoker: CurrentPoker
    public PlayerId: string
    public MyOwnId: string
    public isObserver: boolean
    public isObserverChanged: boolean
    public IsTryingReenter: boolean
    public IsOtherTryingReenter: boolean
    public IsTryingResumeGame: boolean
    public ShowLastTrickCards: boolean

    public CurrentGameState: GameState;
    public CurrentHandState: CurrentHandState
    public CurrentTrickState: CurrentTrickState;
    public playerLocalCache: PlayerLocalCache;
    public replayEntity: ReplayEntity;
    public replayedTricks: CurrentTrickState[];
    public replayAngle: number;
    public PingInterval = 12000;
    public PingStatus = 0; // 0: uninitialized; -1: unhealthy; 1: healthy

    constructor(mf: MainForm) {
        this.mainForm = mf
        this.CurrentRoomSetting = new RoomSetting()
        this.CurrentPoker = new CurrentPoker()
        this.PlayerId = mf.gameScene.playerName
        this.MyOwnId = mf.gameScene.playerName
        this.isObserver = false
        this.isObserverChanged = false
        this.IsTryingReenter = false
        this.IsOtherTryingReenter = false
        this.IsTryingResumeGame = false
        this.ShowLastTrickCards = false
        this.CurrentGameState = new GameState()
        this.CurrentHandState = new CurrentHandState(this.CurrentGameState)
        this.CurrentTrickState = new CurrentTrickState()
        this.playerLocalCache = new PlayerLocalCache()
        this.replayEntity = new ReplayEntity()
        this.replayedTricks = []
        this.replayAngle = 0
    }

    public destroyAllClientMessages() {
        if (this.mainForm.gameScene.clientMessages == null || this.mainForm.gameScene.clientMessages.length == 0) return
        this.mainForm.gameScene.clientMessages.forEach(msg => {
            msg.destroy();
        });
        this.mainForm.gameScene.clientMessages = []
    }

    public NotifyMessage(msgs: string[]) {
        if (msgs == null || msgs.length == 0) {
            return
        }
        else if (msgs.length > 0 && msgs[0] === CommonMethods.loginSuccessFlag) {
            this.mainForm.gameScene.savePlayerLoginInfo(msgs);
            return;
        }

        this.destroyAllClientMessages()
        let posX = this.mainForm.gameScene.coordinates.clientMessagePosition.x;
        let posY = this.mainForm.gameScene.coordinates.clientMessagePosition.y - (msgs.length - 1) / 2 * this.mainForm.gameScene.coordinates.lineOffsetY
        if (msgs.length >= 2 && msgs[1].includes("获胜！")) {
            posX = this.mainForm.gameScene.coordinates.totalPointsPosition.x;
            posY = this.mainForm.gameScene.coordinates.totalPointsPosition.y + 30;
        }
        for (let i = 0; i < msgs.length; i++) {
            let m = msgs[i]
            if (m.includes("获胜！")) {
                if (this.mainForm.enableSound) this.mainForm.gameScene.soundwin.play()

                // 播放烟花
                if (this.CurrentRoomSetting.RoomOwner == this.MyOwnId) {
                    let emojiType = 5;
                    let emojiIndex = CommonMethods.GetRandomInt(CommonMethods.winEmojiLength);
                    let msgString = CommonMethods.emojiMsgs[emojiType]
                    let args: (string | number | boolean)[] = [emojiType, emojiIndex, msgString, true];
                    this.mainForm.gameScene.sendMessageToServer(CommonMethods.SendEmoji_REQUEST, this.MyOwnId, JSON.stringify(args))
                }
            }
            else if (m.includes(CommonMethods.reenterRoomSignal)) {
                if (m.includes(`【${this.MyOwnId}】`)) {
                    this.IsTryingReenter = true;
                    // this.btnEnterHall.Hide();
                    // this.btnReplay.Hide();
                } else {
                    this.IsOtherTryingReenter = true;
                }
            }
            else if (m == CommonMethods.resumeGameSignal) {
                this.IsTryingResumeGame = true;
            }
            else if (m.includes("新游戏即将开始")) {
                //新游戏开始前播放提示音，告诉玩家要抢庄
                if (this.mainForm.enableSound) this.mainForm.gameScene.soundwin.play()
            }
            else if (m.includes("罚分") && !this.mainForm.gameScene.isReplayMode) {
                //甩牌失败播放提示音
                if (this.mainForm.enableSound) this.mainForm.gameScene.soundfankui2.play()
            }

            this.mainForm.gameScene.clientMessages.push(this.mainForm.gameScene.add.text(posX, posY + i * this.mainForm.gameScene.coordinates.lineOffsetY, m)
                .setColor("yellow")
                .setFontSize(28)
                .setShadow(2, 2, "#333333", 2, true, true))
        }
    }

    public NotifyRoomSetting(roomSetting: RoomSetting, showMessage: boolean) {
        this.CurrentRoomSetting = roomSetting
        this.mainForm.roomNameText.setText(`房间：${roomSetting.RoomName}`);
        this.mainForm.roomOwnerText.setText(`房主：${roomSetting.RoomOwner}`);

        if (showMessage) {
            var msgs = []
            if (roomSetting.DisplaySignalCardInfo) {
                msgs.push("信号牌机制声明：")
                msgs.push("8、9、J、Q代表本门有进手张")
                msgs.push("级牌调主代表寻求对家帮忙清主")
                msgs.push("")
            }

            msgs.push("房间设置：")
            msgs.push(`允许投降：${roomSetting.AllowSurrender ? "是" : "否"}`)
            msgs.push(`允许J到底：${roomSetting.AllowJToBottom ? "是" : "否"}`)
            msgs.push(`允许托管自动亮牌：${roomSetting.AllowRobotMakeTrump ? "是" : "否"}`)
            msgs.push(`允许分数小于等于X时革命：${roomSetting.AllowRiotWithTooFewScoreCards >= 0 ? roomSetting.AllowRiotWithTooFewScoreCards : "否"}`)
            msgs.push(`允许主牌小于等于X张时革命：${roomSetting.AllowRiotWithTooFewTrumpCards >= 0 ? roomSetting.AllowRiotWithTooFewTrumpCards : "否"}`)
            msgs.push(`断线重连等待时长：${roomSetting.secondsToWaitForReenter}秒`)

            var mandRanksString = "没有必打牌"
            if (roomSetting.ManditoryRanks.length > 0) {
                var mandRanks = []
                for (let i = 0; i < roomSetting.ManditoryRanks.length; i++) {
                    mandRanks.push(CommonMethods.cardNumToValue[roomSetting.ManditoryRanks[i]])
                }

                mandRanksString = `必打：${mandRanks[0]}`
                for (let i = 1; i < mandRanks.length; i++) {
                    mandRanksString += `,${mandRanks[i]}`
                }
            }
            msgs.push(mandRanksString)
            this.NotifyMessage(msgs)
        }
    }

    public NotifyGameState(gameState: GameState) {
        //bug修复：如果所有人都就绪了，然后来自服务器的新消息就绪人数既不是0又不是4（由于网络延迟导致有一人未就绪的来自服务器的消息滞后到达），那么不处理这条消息
        var isCurrentAllReady = CommonMethods.GetReadyCount(this.CurrentGameState.Players) == 4
        var newReadyCount = CommonMethods.GetReadyCount(gameState.Players);
        if (isCurrentAllReady && 0 < newReadyCount && newReadyCount < 4) {
            return
        }

        var teamMade = false;
        var playerChanged = false;
        var ObserverChanged = false;
        for (let i = 0; i < gameState.Players.length; i++) {
            var p = gameState.Players[i]
            if (p != null && p.Observers.includes(this.MyOwnId, 0)) {
                if (this.PlayerId != p.PlayerId) {
                    this.isObserver = true;
                    this.isObserverChanged = true;
                    this.PlayerId = p.PlayerId;
                }
                break;
            }
        }

        var totalPlayers = 0;
        for (let i = 0; i < 4; i++) {
            playerChanged = playerChanged || !(this.CurrentGameState.Players[i] != null && gameState.Players[i] != null && this.CurrentGameState.Players[i].PlayerId == gameState.Players[i].PlayerId);
            ObserverChanged = ObserverChanged || !(this.CurrentGameState.Players[i] != null && gameState.Players[i] != null && CommonMethods.ArrayIsEqual(this.CurrentGameState.Players[i].Observers, gameState.Players[i].Observers));

            if (gameState.Players[i] != null && gameState.Players[i].Team != 0 &&
                (this.CurrentGameState.Players[i] == null || this.CurrentGameState.Players[i].PlayerId != gameState.Players[i].PlayerId || this.CurrentGameState.Players[i].Team != gameState.Players[i].Team)) {
                teamMade = true;
            }
            if (gameState.Players[i] != null) {
                totalPlayers++;
            }
        }
        var meJoined = !CommonMethods.IncludesByPlayerID(this.CurrentGameState.Players, this.MyOwnId) && CommonMethods.IncludesByPlayerID(gameState.Players, this.MyOwnId)
        var anyBecomesReady = CommonMethods.SomeoneBecomesReady(this.CurrentGameState.Players, gameState.Players)

        this.CurrentGameState.CloneFrom(gameState);

        for (let i = 0; i < gameState.Players.length; i++) {
            var p = gameState.Players[i]
            if (p == null) continue;
            if (p.PlayerId == this.PlayerId) {
                this.mainForm.NewPlayerReadyToStart(p.IsReadyToStart)
                this.mainForm.PlayerToggleIsRobot(p.IsRobot)
                if (anyBecomesReady &&
                    (this.CurrentHandState.CurrentHandStep <= SuitEnums.HandStep.BeforeDistributingCards || this.CurrentHandState.CurrentHandStep >= SuitEnums.HandStep.SpecialEnding)) {
                    if (CommonMethods.AllReady(this.CurrentGameState.Players)) this.mainForm.gameScene.soundtie.play()
                    else this.mainForm.gameScene.soundRecoverhp.play()
                }
                break;
            }
        }

        if (teamMade || ObserverChanged && totalPlayers == 4) {
            this.mainForm.PlayersTeamMade()
        }

        if ((playerChanged || ObserverChanged)) {
            this.mainForm.NewPlayerJoined(meJoined)
        }

        if (this.IsTryingReenter || this.IsTryingResumeGame) {
            this.mainForm.ReenterOrResumeEvent()
            this.IsTryingReenter = false;
            this.IsTryingResumeGame = false;
        }
        if (this.IsOtherTryingReenter) {
            this.IsOtherTryingReenter = false;
        }
    }
    public NotifyCurrentHandState(currentHandState: CurrentHandState) {

        var trumpChanged = false;
        var newHandStep = false;
        var starterChanged = false;
        trumpChanged = this.CurrentHandState.Trump != currentHandState.Trump || (this.CurrentHandState.Trump == currentHandState.Trump && this.CurrentHandState.TrumpExposingPoker < currentHandState.TrumpExposingPoker);
        newHandStep = this.CurrentHandState.CurrentHandStep != currentHandState.CurrentHandStep;
        starterChanged = this.CurrentHandState.Starter != currentHandState.Starter;

        this.CurrentHandState.CloneFrom(currentHandState);

        //埋底中
        if (currentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards) {
            if (currentHandState.Last8Holder == this.MyOwnId) {
                this.mainForm.btnPig.setVisible(true);
            }
            this.mainForm.setStartLabels();
        }

        //断线重连后重画手牌
        if (this.IsTryingReenter || this.IsTryingResumeGame) {
            this.CurrentPoker.CloneFrom(this.CurrentHandState.PlayerHoldingCards[this.PlayerId] as CurrentPoker)
            this.CurrentPoker.Rank = this.CurrentHandState.Rank;
            this.CurrentPoker.Trump = this.CurrentHandState.Trump;
            this.mainForm.AllCardsGot();

            if (currentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8CardsFinished) {
                this.mainForm.Last8Discarded()
            }
            return;
        }

        this.CurrentPoker.Trump = this.CurrentHandState.Trump;

        if (trumpChanged) {
            this.mainForm.TrumpChanged(currentHandState)

            // //resort cards
            if (currentHandState.CurrentHandStep > SuitEnums.HandStep.DistributingCards) {
                this.mainForm.AllCardsGot();
            }
        }
        if (currentHandState.CurrentHandStep == SuitEnums.HandStep.BeforeDistributingCards) {
            this.mainForm.StartGame()
        }
        else if (newHandStep) {
            if (currentHandState.CurrentHandStep == SuitEnums.HandStep.DistributingCardsFinished) {
                this.mainForm.AllCardsGot();
            }
            else if (currentHandState.CurrentHandStep == SuitEnums.HandStep.DistributingLast8Cards) {
                this.mainForm.DistributingLast8Cards()
            }
            else if (currentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards) {
                this.mainForm.DiscardingLast8()
            }
            else if (currentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8CardsFinished) {
                this.mainForm.Last8Discarded()
            }
            //player begin to showing card
            //开始出牌
            else if (currentHandState.CurrentHandStep == SuitEnums.HandStep.Playing) {
                this.mainForm.AllCardsGot();
                this.mainForm.ShowingCardBegan();
            }
            else if (currentHandState.CurrentHandStep == SuitEnums.HandStep.Ending) {
                this.mainForm.HandEnding();
            }
            // else if (currentHandState.CurrentHandStep == SuitEnums.HandStep.SpecialEnding)
            // {
            //     if (SpecialEndingEvent != null)
            //         SpecialEndingEvent();
            // }
        }

        //显示庄家
        if (starterChanged || this.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Ending || currentHandState.CurrentHandStep == SuitEnums.HandStep.SpecialEnding) {
            this.mainForm.StarterChangedEvent()
        }

        //摸完牌，庄家亮不起主，所以换庄家
        if (currentHandState.CurrentHandStep == SuitEnums.HandStep.DistributingCardsFinished && starterChanged) {
            this.CurrentPoker.Rank = this.CurrentHandState.Rank;
            this.mainForm.StarterFailedForTrump()
        }

        if (this.isObserver &&
            this.CurrentHandState.PlayerHoldingCards != undefined &&
            this.CurrentHandState.PlayerHoldingCards[this.PlayerId] != undefined) {
            //即时更新旁观手牌
            this.CurrentPoker = new CurrentPoker()
            this.CurrentPoker.CloneFrom(this.CurrentHandState.PlayerHoldingCards[this.PlayerId])
            this.mainForm.ObservePlayerByIDEvent()
        }
    }
    public NotifyCurrentTrickState(currentTrickState: CurrentTrickState) {

        this.CurrentTrickState.CloneFrom(currentTrickState);
        // 显示确定按钮，提示当前回合玩家出牌
        let isMeNextPlayer = this.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing &&
            Object.keys(this.CurrentTrickState.ShowedCards).length > 0 &&
            this.CurrentTrickState.NextPlayer() == this.MyOwnId;
        if (!this.isObserver && isMeNextPlayer) {
            this.mainForm.btnPig.setVisible(true);
        }
        // 出牌中
        if (this.CurrentHandState.CurrentHandStep >= SuitEnums.HandStep.Playing) {
            this.mainForm.setStartLabels();
        }
        if (this.IsOtherTryingReenter || this.IsTryingReenter || this.IsTryingResumeGame) return;

        if (this.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Ending || this.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.SpecialEnding) {
            return;
        }
        if (this.CurrentTrickState.LatestPlayerShowedCard() != "") {
            this.mainForm.PlayerShowedCards();
        }

        if (this.CurrentTrickState.Winner) {
            this.mainForm.TrickFinished();
        }

        if (!this.CurrentTrickState.IsStarted()) {
            this.mainForm.TrickStarted();
        }
    }
    public GetDistributedCard(cardNumber: number) {
        this.CurrentPoker.AddCard(cardNumber)

        if (this.CurrentHandState.CurrentHandStep != SuitEnums.HandStep.DistributingLast8Cards) {
            this.mainForm.PlayerOnGetCard(cardNumber);
        }

        if (this.CurrentPoker.Count() == TractorRules.GetCardNumberofEachPlayer(this.CurrentGameState.Players.length) && this.PlayerId != this.CurrentHandState.Last8Holder) {
            this.mainForm.AllCardsGot();
        }
        else if (this.CurrentPoker.Count() == TractorRules.GetCardNumberofEachPlayer(this.CurrentGameState.Players.length) + 8) {
            this.mainForm.AllCardsGot();
        }
    }
    public NotifyCardsReady(mcir: boolean[]) {
        for (let i = 0; i < mcir.length; i++) {
            this.mainForm.myCardIsReady[i] = mcir[i];
        }
        this.mainForm.drawingFormHelper.DrawMyPlayingCards()
    }

    //我是否可以亮主
    public AvailableTrumps(): number[] {
        let availableTrumps: number[] = []
        let rank = this.CurrentHandState.Rank;

        if (this.CurrentHandState.CurrentHandStep >= SuitEnums.HandStep.DistributingLast8Cards) {
            availableTrumps = []
            return availableTrumps;
        }

        //当前是自己亮的单张主，只能加固
        if (this.CurrentHandState.TrumpMaker == this.PlayerId) {
            if (this.CurrentHandState.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.SingleRank) {
                if (rank != 53) {
                    if (this.CurrentPoker.Clubs()[rank] > 1) {
                        if (this.CurrentHandState.Trump == SuitEnums.Suit.Club)
                            availableTrumps.push(SuitEnums.Suit.Club);
                    }
                    if (this.CurrentPoker.Diamonds()[rank] > 1) {
                        if (this.CurrentHandState.Trump == SuitEnums.Suit.Diamond)
                            availableTrumps.push(SuitEnums.Suit.Diamond);
                    }
                    if (this.CurrentPoker.Spades()[rank] > 1) {
                        if (this.CurrentHandState.Trump == SuitEnums.Suit.Spade)
                            availableTrumps.push(SuitEnums.Suit.Spade);
                    }
                    if (this.CurrentPoker.Hearts()[rank] > 1) {
                        if (this.CurrentHandState.Trump == SuitEnums.Suit.Heart)
                            availableTrumps.push(SuitEnums.Suit.Heart);
                    }
                }
            }
            return availableTrumps;
        }

        //如果目前无人亮主
        if (this.CurrentHandState.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.None) {
            if (rank != 53) {
                if (this.CurrentPoker.Clubs()[rank] > 0) {
                    availableTrumps.push(SuitEnums.Suit.Club);
                }
                if (this.CurrentPoker.Diamonds()[rank] > 0) {
                    availableTrumps.push(SuitEnums.Suit.Diamond);
                }
                if (this.CurrentPoker.Spades()[rank] > 0) {
                    availableTrumps.push(SuitEnums.Suit.Spade);
                }
                if (this.CurrentPoker.Hearts()[rank] > 0) {
                    availableTrumps.push(SuitEnums.Suit.Heart);
                }
            }
        }
        //亮了单张
        else if (this.CurrentHandState.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.SingleRank) {

            if (rank != 53) {
                if (this.CurrentPoker.Clubs()[rank] > 1) {
                    availableTrumps.push(SuitEnums.Suit.Club);
                }
                if (this.CurrentPoker.Diamonds()[rank] > 1) {
                    availableTrumps.push(SuitEnums.Suit.Diamond);
                }
                if (this.CurrentPoker.Spades()[rank] > 1) {
                    availableTrumps.push(SuitEnums.Suit.Spade);
                }
                if (this.CurrentPoker.Hearts()[rank] > 1) {
                    availableTrumps.push(SuitEnums.Suit.Heart);
                }
            }
        }

        if (this.CurrentHandState.TrumpExposingPoker != SuitEnums.TrumpExposingPoker.PairRedJoker) {
            if (rank != 53) {
                if (this.CurrentPoker.BlackJoker() == 2) {
                    availableTrumps.push(SuitEnums.Suit.Joker);
                }
            }
        }

        if (rank != 53) {
            if (this.CurrentPoker.RedJoker() == 2) {
                availableTrumps.push(SuitEnums.Suit.Joker);
            }
        }
        return availableTrumps;
    }
    public ExposeTrump(trumpExposingPoker: number, trump: number) {
        let params: number[] = [trumpExposingPoker, trump]
        this.mainForm.gameScene.sendMessageToServer(PlayerMakeTrump_REQUEST, this.PlayerId, JSON.stringify(params))
    }

    // handle failure
    public NotifyDumpingValidationResult(result: ShowingCardsValidationResult) {
        this.mainForm.NotifyDumpingValidationResultEventHandler(result)
    }

    // handle both
    public NotifyTryToDumpResult(result: ShowingCardsValidationResult) {
        this.mainForm.NotifyTryToDumpResultEventHandler(result)
    }

    public NotifyStartTimer(timerLength: number) {
        this.mainForm.NotifyStartTimerEventHandler(timerLength)
    }

    public NotifyGameHall(roomStateList: RoomState[], playerList: string[]) {
        this.mainForm.NotifyGameHallEventHandler(roomStateList, playerList)
    }

    public NotifyOnlinePlayerList(playerID: string, isJoining: boolean, onlinePlayerList: string[]) {
        this.mainForm.NotifyOnlinePlayerListEventHandler(playerID, isJoining, onlinePlayerList)
    }

    public NotifyGameRoomPlayerList(playerID: string, isJoining: boolean, roomName: string) {
        this.mainForm.NotifyGameRoomPlayerListEventHandler(playerID, isJoining, roomName)
    }

    public NotifyEmoji(playerID: string, emojiType: number, emojiIndex: number, isCenter: boolean, msgString: string) {
        this.mainForm.NotifyEmojiEventHandler(playerID, emojiType, emojiIndex, isCenter, msgString)
    }

    public CutCardShoeCards() {
        this.mainForm.CutCardShoeCardsEventHandler()
    }

    public NotifyReplayState(replayState: ReplayEntity) {
        IDBHelper.SaveReplayEntity(replayState, () => { void (0); })
    }

    public NotifyPing() {
        this.mainForm.gameScene.sendMessageToServer(NotifyPong_REQUEST, this.MyOwnId, "");
        // during initial login after a new release, it'll take more than 5 seconds to fully load
        // and it tends to time out. 
        // hence don't trigger health check if it is not fully loaded
        if (!(this.mainForm.gameScene.isInGameHall() || this.mainForm.gameScene.isInGameRoom())) return;

        this.PingStatus = 1;
        setTimeout(() => {
            if (this.PingStatus < 0) {
                this.NotifyMessage(["您已离线，请尝试刷新页面重连"]);
            } else {
                this.PingStatus = -1;
            }
        }, this.PingInterval + this.PingInterval / 2);
    }
}