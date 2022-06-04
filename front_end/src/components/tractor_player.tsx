
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

const screenWidth = document.documentElement.clientWidth;
const screenHeight = document.documentElement.clientHeight;
const roomNameTextPosition = { x: screenWidth - 240, y: 10 }

const clientMessagePosition = { x: 400, y: 240 }
const lineOffsetY = 40

const hallPlayerHeaderPosition = { x: 50, y: 160 }
const hallPlayerTopPosition = { x: 50, y: 240 }

const PlayerMakeTrump_REQUEST = "PlayerMakeTrump"

export class TractorPlayer {
    public mainForm: MainForm
    public CurrentRoomSetting: RoomSetting
    public CurrentPoker: CurrentPoker
    public PlayerId: string
    public MyOwnId: string
    public isObserver: boolean
    public isObserverChanged: boolean
    public IsTryingReenter: boolean
    public IsTryingResumeGame: boolean
    public ShowLastTrickCards: boolean

    public CurrentGameState: GameState;
    public CurrentHandState: CurrentHandState
    public CurrentTrickState: CurrentTrickState;
    public playerLocalCache: PlayerLocalCache;

    constructor(mf: MainForm) {
        this.mainForm = mf
        this.CurrentRoomSetting = new RoomSetting()
        this.CurrentPoker = new CurrentPoker()
        this.PlayerId = mf.gameScene.playerName
        this.MyOwnId = mf.gameScene.playerName
        this.isObserver = false
        this.isObserverChanged = false
        this.IsTryingReenter = false
        this.IsTryingResumeGame = false
        this.ShowLastTrickCards = false
        this.CurrentGameState = new GameState()
        this.CurrentHandState = new CurrentHandState(this.CurrentGameState)
        this.CurrentTrickState = new CurrentTrickState()
        this.playerLocalCache = new PlayerLocalCache()
    }

    public destroyAllClientMessages(gameScene: GameScene) {
        if (gameScene.clientMessages == null || gameScene.clientMessages.length == 0) return
        gameScene.clientMessages.forEach(msg => {
            msg.destroy();
        });
    }

    public NotifyMessage(gameScene: GameScene, msgs: string[]) {
        this.destroyAllClientMessages(gameScene)
        if (msgs == null || msgs.length == 0) {
            return
        }

        for (let i = 0; i < msgs.length; i++) {
            gameScene.clientMessages.push(gameScene.add.text(clientMessagePosition.x, clientMessagePosition.y + i * lineOffsetY, msgs[i]).setColor("yellow").setFontSize(28).setShadow(2, 2, "#333333", 2, true, true))
        }
    }

    public NotifyRoomSetting(gameScene: GameScene, roomSetting: RoomSetting, showMessage: boolean) {
        this.CurrentRoomSetting = roomSetting
        gameScene.roomUIControls.texts.push(gameScene.add.text(roomNameTextPosition.x, roomNameTextPosition.y, roomSetting.RoomName).setColor("orange").setFontSize(20).setShadow(2, 2, "#333333", 2, true, true))

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
            msgs.push(`允许分数小于等于X时革命：${roomSetting.AllowRiotWithTooFewScoreCards ? "是" : "否"}`)
            msgs.push(`允许主牌小于等于X张时革命：${roomSetting.AllowRiotWithTooFewTrumpCards ? "是" : "否"}`)
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
            this.NotifyMessage(gameScene, msgs)
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

        this.CurrentGameState.CloneFrom(gameState);

        for (let i = 0; i < gameState.Players.length; i++) {
            var p = gameState.Players[i]
            if (p == null) continue;
            if (p.PlayerId == this.PlayerId) {
                this.mainForm.NewPlayerReadyToStart(p.IsReadyToStart)
                this.mainForm.PlayerToggleIsRobot(p.IsRobot)
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
    }
    public NotifyCurrentHandState(currentHandState: CurrentHandState) {

        var trumpChanged = false;
        var newHandStep = false;
        var starterChanged = false;
        trumpChanged = this.CurrentHandState.Trump != currentHandState.Trump || (this.CurrentHandState.Trump == currentHandState.Trump && this.CurrentHandState.TrumpExposingPoker < currentHandState.TrumpExposingPoker);
        newHandStep = this.CurrentHandState.CurrentHandStep != currentHandState.CurrentHandStep;
        starterChanged = this.CurrentHandState.Starter != currentHandState.Starter;

        this.CurrentHandState.CloneFrom(currentHandState);

        //断线重连后重画手牌
        if (this.IsTryingReenter || this.IsTryingResumeGame) {
            this.CurrentPoker.CloneFrom(this.CurrentHandState.PlayerHoldingCards[this.MyOwnId] as CurrentPoker)
            this.CurrentPoker.Rank = this.CurrentHandState.Rank;
            this.CurrentPoker.Trump = this.CurrentHandState.Trump;
            this.mainForm.AllCardsGot();

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

            // else if (currentHandState.CurrentHandStep == SuitEnums.HandStep.Ending)
            // {
            //     if (HandEnding != null)
            //         HandEnding();
            // }
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
            let tempCP = new CurrentPoker()
            tempCP.CloneFrom(this.CurrentHandState.PlayerHoldingCards[this.PlayerId])
            this.CurrentPoker.CloneFrom(tempCP)
            this.mainForm.ObservePlayerByIDEvent()
        }
    }
    public NotifyCurrentTrickState(currentTrickState: CurrentTrickState) {

        this.CurrentTrickState.CloneFrom(currentTrickState);
        if (this.IsTryingReenter || this.IsTryingResumeGame) return;

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
}