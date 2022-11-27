// @ts-nocheck
import Phaser from "phaser";
import bgimage from "../assets/bg2.jpg"
import packageJson from '../../package.json';
import pokerImage from "../assets/poker.png"
import suitsImage from "../assets/suits.png"
import suitsbarImage from "../assets/suitsbar.png"
import settingsForm from '../assets/text/settings_form.htm';
import replayForm from '../assets/text/replay_form.htm';

import { Match } from './match';
import { MainForm } from "./main_form";
import { Coordinates } from "./coordinates";
import Cookies from 'universal-cookie';
import { ReplayEntity } from "./replay_entity";
import { CommonMethods } from "./common_methods";
import { IDBHelper } from "./idb_helper";
import { PlayerEntity } from "./player_entity";
import { GameState } from "./game_state";
import { CurrentHandState } from "./current_hand_state";
import { CurrentPoker } from "./current_poker";
import { CurrentTrickState } from "./current_trick_state";
import { UndoRounded } from "@mui/icons-material";

const cookies = new Cookies();

interface Player {
    name: string
    prepare: boolean
}

export class GameReplayScene extends Phaser.Scene {
    public isReplayMode: boolean
    public appVersion: string
    public playerName
    public players: Player[]
    public prepareBtn: Phaser.GameObjects.Image
    public prepareOkImg: Phaser.GameObjects.Image[]
    public pokerTableChairImg: { tableImg: any, chairImgs: Phaser.GameObjects.Image[] }[]
    public pokerTableChairNames: { tableName: any, chairNames: { myOwnName: any, observerNames: Phaser.GameObjects.Text[] }[] }[]
    public match: Match
    public mainForm: MainForm
    public cardImages: Phaser.GameObjects.GameObject[]
    public cardImageSequence: Phaser.GameObjects.Text[]
    public toolbarImages: Phaser.GameObjects.GameObject[]
    public sidebarImages: Phaser.GameObjects.GameObject[]
    public scoreCardsImages: Phaser.GameObjects.GameObject[]
    public last8CardsImages: Phaser.GameObjects.GameObject[]
    public showedCardImages: Phaser.GameObjects.GameObject[]
    public OverridingFlagImage: Phaser.GameObjects.Image
    public overridingLabelImages: string[]
    public overridingLabelAnims: string[]
    public hallPlayerHeader: Phaser.GameObjects.Text
    public hallPlayerNames: Phaser.GameObjects.Text[]
    public btnJoinAudio: Phaser.GameObjects.Text
    public joinAudioUrl: string
    public nickNameOverridePass: string
    public clientMessages: Phaser.GameObjects.Text[]
    public danmuMessages: any[]
    public roomUIControls: { images: Phaser.GameObjects.Image[], texts: Phaser.GameObjects.Text[], imagesChair: Phaser.GameObjects.Image[] }
    public soundbiyue1: Phaser.Sound.BaseSound;
    public soundRecoverhp: Phaser.Sound.BaseSound;
    public sounddraw: Phaser.Sound.BaseSound;
    public sounddrawx: Phaser.Sound.BaseSound;
    public soundPlayersShowCard: Phaser.Sound.BaseSound[];
    public soundfankui2: Phaser.Sound.BaseSound;
    public soundtie: Phaser.Sound.BaseSound;
    public soundwin: Phaser.Sound.BaseSound;
    public soundVolume: number
    public noDanmu: string
    public noCutCards: string
    public decadeUICanvas: HTMLElement
    public currentReplayEntities: any[]
    public selectDates: Element
    public selectTimes: Element
    public btnFirstTrick: Phaser.GameObjects.Text
    public btnPreviousTrick: Phaser.GameObjects.Text
    public btnNextTrick: Phaser.GameObjects.Text
    public btnLastTrick: Phaser.GameObjects.Text
    public coordinates: Coordinates

    constructor() {
        super("GameReplayScene")
        this.isReplayMode = true;
        this.appVersion = packageJson.version
        this.playerName = cookies.get("playerName");
        this.cardImages = [];
        this.cardImageSequence = [];
        this.toolbarImages = [];
        this.sidebarImages = [];
        this.scoreCardsImages = [];
        this.last8CardsImages = [];
        this.showedCardImages = [];
        this.clientMessages = [];
        this.roomUIControls = { images: [], texts: [], imagesChair: [] };
        this.soundVolume = cookies.get("soundVolume");
        if (this.soundVolume === undefined) this.soundVolume = 0.5
        this.noDanmu = cookies.get("noDanmu");
        if (this.noDanmu === undefined) this.noDanmu = 'false'
        this.noCutCards = cookies.get("noCutCards");
        if (this.noCutCards === undefined) this.noCutCards = 'false'

        this.joinAudioUrl = cookies.get("joinAudioUrl") ? cookies.get("joinAudioUrl") : "";
        IDBHelper.maxReplays = cookies.get("maxReplays") ? parseInt(cookies.get("maxReplays")) : IDBHelper.maxReplays;
        this.currentReplayEntities = [];
        IDBHelper.InitIDB();

        this.coordinates = new Coordinates(this.isReplayMode);
    }

    preload() {
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x999999, 0.7);
        this.progressBox.fillRect(
            this.coordinates.centerX - this.coordinates.progressBarWidth / 2, this.coordinates.centerY - this.coordinates.progressBarHeight / 2, this.coordinates.progressBarWidth, this.coordinates.progressBarHeight);

        this.loadingText = this.make.text({
            x: this.coordinates.centerX,
            y: this.coordinates.centerY - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5);

        this.percentText = this.make.text({
            x: this.coordinates.centerX,
            y: this.coordinates.centerY,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5);

        this.assetText = this.make.text({
            x: this.coordinates.centerX,
            y: this.coordinates.centerY + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            if (value == 0) return;
            this.progressBar.clear();
            this.progressBar.fillStyle(0xffffff, 1);
            this.progressBar.fillRect(
                this.coordinates.centerX - this.coordinates.progressBarWidth / 2, this.coordinates.centerY - this.coordinates.progressBarHeight / 2, this.coordinates.progressBarWidth * value, this.coordinates.progressBarHeight);
            this.percentText.setText(parseInt(value * 100) + '%');
        }, this);

        this.load.on('load', function (file) {
            this.assetText.setText('Loaded asset: ' + file.key);
        }, this);

        this.load.image("bg2", bgimage)
        this.load.spritesheet('poker', pokerImage, {
            frameWidth: this.coordinates.cardWidth,
            frameHeight: this.coordinates.cardHeigh
        });
        this.load.spritesheet('suitsImage', suitsImage, {
            frameWidth: this.coordinates.toolbarSize,
            frameHeight: this.coordinates.toolbarSize
        });
        this.load.spritesheet('suitsbarImage', suitsbarImage, {
            frameWidth: this.coordinates.toolbarSize,
            frameHeight: this.coordinates.toolbarSize
        });
        this.load.html('settingsForm', settingsForm);
        this.load.html('replayForm', replayForm);
    }

    create() {
        window.addEventListener("keydown", function (e) {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
                e.preventDefault();
            }
        }, false);

        this.input.mouse.disableContextMenu();
        this.progressBar.destroy();
        this.progressBox.destroy();
        this.loadingText.destroy();
        this.percentText.destroy();
        this.assetText.destroy();

        this.add.image(0, 0, 'bg2').setOrigin(0).setDisplaySize(this.coordinates.screenWid, this.coordinates.screenHei);
        this.mainForm = new MainForm(this)
        CommonMethods.BuildCardNumMap()

        this.loadReplayForm();

        this.btnFirstTrick = this.add.text(this.coordinates.btnFirstTrickPosition.x, this.coordinates.btnFirstTrickPosition.y, '|←')
            .setColor('white')
            .setFontSize(20)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.btnFirstTrick_Click())
            .on('pointerover', (pointer: Phaser.Input.Pointer) => {
                this.btnFirstTrick.setStyle({ backgroundColor: 'lightblue' })
                // tooltip
                this.btnTT = this.createTooltip(pointer.x, pointer.y, "快捷键：↑ 上箭头")
            })
            .on('pointerout', () => {
                this.btnFirstTrick.setStyle({ backgroundColor: 'gray' });
                // tooltip
                this.btnTT.destroy();
            })
        this.btnFirstTrick.displayWidth = this.coordinates.replayControlButtonWidth;
        this.roomUIControls.texts.push(this.btnFirstTrick)

        this.btnPreviousTrick = this.add.text(this.coordinates.btnFirstTrickPosition.x + this.coordinates.controlButtonOffset + this.coordinates.replayControlButtonWidth, this.coordinates.btnFirstTrickPosition.y, '←')
            .setColor('white')
            .setFontSize(20)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.btnPreviousTrick_Click())
            .on('pointerover', (pointer: Phaser.Input.Pointer) => {
                this.btnPreviousTrick.setStyle({ backgroundColor: 'lightblue' })
                // tooltip
                this.btnTT = this.createTooltip(pointer.x, pointer.y, "快捷键：← 左箭头")
            })
            .on('pointerout', () => {
                this.btnPreviousTrick.setStyle({ backgroundColor: 'gray' })
                // tooltip
                this.btnTT.destroy();
            })
        this.btnPreviousTrick.displayWidth = this.coordinates.replayControlButtonWidth;
        this.roomUIControls.texts.push(this.btnPreviousTrick)

        this.btnNextTrick = this.add.text(this.coordinates.btnFirstTrickPosition.x + (this.coordinates.controlButtonOffset + this.coordinates.replayControlButtonWidth) * 2, this.coordinates.btnFirstTrickPosition.y, '→')
            .setColor('white')
            .setFontSize(20)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.btnNextTrick_Click())
            .on('pointerover', (pointer: Phaser.Input.Pointer) => {
                this.btnNextTrick.setStyle({ backgroundColor: 'lightblue' })
                // tooltip
                this.btnTT = this.createTooltip(pointer.x, pointer.y, "快捷键：→ 右箭头")
            })
            .on('pointerout', () => {
                this.btnNextTrick.setStyle({ backgroundColor: 'gray' })
                // tooltip
                this.btnTT.destroy();
            })
        this.btnNextTrick.displayWidth = this.coordinates.replayControlButtonWidth;
        this.roomUIControls.texts.push(this.btnNextTrick)

        this.btnLastTrick = this.add.text(this.coordinates.btnFirstTrickPosition.x + (this.coordinates.controlButtonOffset + this.coordinates.replayControlButtonWidth) * 3, this.coordinates.btnFirstTrickPosition.y, '→|')
            .setColor('white')
            .setFontSize(20)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.btnLastTrick_Click())
            .on('pointerover', (pointer: Phaser.Input.Pointer) => {
                this.btnLastTrick.setStyle({ backgroundColor: 'lightblue' })
                // tooltip
                this.btnTT = this.createTooltip(pointer.x, pointer.y, "快捷键：↓ 下箭头")
            })
            .on('pointerout', () => {
                this.btnLastTrick.setStyle({ backgroundColor: 'gray' })
                // tooltip
                this.btnTT.destroy();
            })
        this.btnLastTrick.displayWidth = this.coordinates.replayControlButtonWidth;
        this.roomUIControls.texts.push(this.btnLastTrick)
    }
    private loadReplayForm() {
        let replayForm = this.add.dom(this.coordinates.replayBarPosition.x, this.coordinates.replayBarPosition.y).setOrigin(0).createFromCache('replayForm');
        this.selectDates = replayForm.getChildByID("selectDates")
        this.selectTimes = replayForm.getChildByID("selectTimes")
        let btnLoadReplay = replayForm.getChildByID("btnLoadReplay")

        this.selectDates.onchange = () => {
            this.onDatesSelectChange(true, 0)
        }

        this.InitReplayEntities(this);
        btnLoadReplay.onclick = () => {
            if (this.selectTimes.selectedIndex < 0) return;
            this.loadReplayEntity(this.currentReplayEntities[1][this.selectTimes.selectedIndex], true);
            this.btnFirstTrick.setVisible(true);
            this.btnPreviousTrick.setVisible(true);
            this.btnNextTrick.setVisible(true);
            this.btnLastTrick.setVisible(true);

            // 切换视角
            for (let i = 1; i < 4; i++) {
                let lblNickName = this.mainForm.lblNickNames[i];
                // have to clear all listeners, otherwise multiple ones will be added and triggered multiple times
                lblNickName.removeAllListeners();
                lblNickName.setInteractive({ useHandCursor: true })
                    .on('pointerup', () => {
                        lblNickName.setColor('white')
                            .setFontSize(30)
                        let pos = i + 1;
                        this.replayAngleByPosition(pos);
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
    }

    public InitReplayEntities(that: GameReplayScene) {
        this.removeOptions(this.selectDates);
        IDBHelper.ReadReplayEntityAll((dtList: string[]) => {
            let dates: string[] = [];
            for (let i = 0; i < dtList.length; i++) {
                let dt: ReplayEntity = dtList[i];
                let datetimes: string[] = dt.split(IDBHelper.replaySeparator);
                let dateString = datetimes[0];
                if (!dates.includes(dateString)) {
                    dates.push(dateString);
                    var option = document.createElement("option");
                    option.text = dateString;
                    that.selectDates.add(option);
                }
            }
            that.selectDates.selectedIndex = selectDates.options.length - 1;
            that.onDatesSelectChange(true, 0);
        });
    }

    private loadReplayEntity(re: ReplayEntity, shouldDraw: boolean) {
        this.mainForm.tractorPlayer.replayEntity.CloneFrom(re);
        this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates.push(null); // use null to indicate end of tricks, so that to show ending scores
        this.mainForm.tractorPlayer.replayedTricks = [];
        this.mainForm.tractorPlayer.replayEntity.Players = CommonMethods.RotateArray(this.mainForm.tractorPlayer.replayEntity.Players, this.mainForm.tractorPlayer.replayAngle);
        if (this.mainForm.tractorPlayer.replayEntity.PlayerRanks != null) {
            this.mainForm.tractorPlayer.replayEntity.PlayerRanks = CommonMethods.RotateArray(this.mainForm.tractorPlayer.replayEntity.PlayerRanks, this.mainForm.tractorPlayer.replayAngle);
        }

        this.StartReplay(shouldDraw);
    }

    private StartReplay(shouldDraw: bool) {
        this.mainForm.drawingFormHelper.resetReplay();
        let players: string[] = this.mainForm.tractorPlayer.replayEntity.Players;
        let playerRanks: int[] = new Array(4);
        if (this.mainForm.tractorPlayer.replayEntity.PlayerRanks != null) {
            playerRanks = this.mainForm.tractorPlayer.replayEntity.PlayerRanks;
        }
        else {
            let tempRank: number = this.mainForm.tractorPlayer.replayEntity.CurrentHandState.Rank;
            playerRanks = [tempRank, tempRank, tempRank, tempRank];
        }
        this.mainForm.tractorPlayer.PlayerId = players[0];
        this.mainForm.lblNickNames[0].setText(players[0])
        this.mainForm.lblNickNames[1].setText(players[1])
        let tempWid = this.coordinates.playerText1MaxWid * players[1].length / 10;
        this.mainForm.lblNickNames[1].setStyle({ fixedWidth: tempWid })
        this.mainForm.lblNickNames[1].setX(this.coordinates.playerTextPositions[1].x - tempWid)
        this.mainForm.lblNickNames[2].setText(players[2])
        this.mainForm.lblNickNames[3].setText(players[3])
        for (let i = 0; i < this.mainForm.lblNickNames.length; i++) {
            this.mainForm.lblNickNames[i].setVisible(true);
        }

        this.mainForm.lblStarters[0].setText(players[0] == this.mainForm.tractorPlayer.replayEntity.CurrentHandState.Starter ? "庄家" : "1");
        this.mainForm.lblStarters[1].setText(players[1] == this.mainForm.tractorPlayer.replayEntity.CurrentHandState.Starter ? "庄家" : "2");
        this.mainForm.lblStarters[2].setText(players[2] == this.mainForm.tractorPlayer.replayEntity.CurrentHandState.Starter ? "庄家" : "3");
        this.mainForm.lblStarters[3].setText(players[3] == this.mainForm.tractorPlayer.replayEntity.CurrentHandState.Starter ? "庄家" : "4");
        for (let i = 0; i < this.mainForm.lblStarters.length; i++) {
            this.mainForm.lblStarters[i].setVisible(true);
        }

        this.mainForm.tractorPlayer.CurrentGameState = new GameState();
        for (let i = 0; i < this.mainForm.lblStarters.length; i++) {
            let temp = new PlayerEntity();
            temp.PlayerId = players[i];
            temp.Rank = playerRanks[i];
            temp.Team = (i % 2) + 1;

            this.mainForm.tractorPlayer.CurrentGameState.Players[i] = temp;
        }
        //set player position
        this.mainForm.PlayerPosition = {};
        this.mainForm.PositionPlayer = {};
        let nextPlayer: string = players[0];
        let postion = 1;
        this.mainForm.PlayerPosition[nextPlayer] = postion;
        this.mainForm.PositionPlayer[postion] = nextPlayer;
        nextPlayer = CommonMethods.GetNextPlayerAfterThePlayer(this.mainForm.tractorPlayer.CurrentGameState.Players, nextPlayer).PlayerId;
        while (nextPlayer != players[0]) {
            postion++;
            this.mainForm.PlayerPosition[nextPlayer] = postion;
            this.mainForm.PositionPlayer[postion] = nextPlayer;
            nextPlayer = CommonMethods.GetNextPlayerAfterThePlayer(this.mainForm.tractorPlayer.CurrentGameState.Players, nextPlayer).PlayerId;
        }

        this.mainForm.tractorPlayer.CurrentHandState = new CurrentHandState();
        this.mainForm.tractorPlayer.CurrentHandState.CloneFrom(this.mainForm.tractorPlayer.replayEntity.CurrentHandState);
        for (const [key, value] of Object.entries(this.mainForm.tractorPlayer.CurrentHandState.PlayerHoldingCards)) {
            let tempcp = new CurrentPoker();
            tempcp.CloneFrom(value)
            this.mainForm.tractorPlayer.CurrentHandState.PlayerHoldingCards[key] = tempcp;
            this.mainForm.tractorPlayer.replayEntity.CurrentHandState.PlayerHoldingCards[key] = tempcp;
        }


        this.mainForm.tractorPlayer.CurrentHandState.Score = 0;
        this.mainForm.tractorPlayer.CurrentHandState.ScoreCards = [];
        this.mainForm.tractorPlayer.CurrentPoker = this.mainForm.tractorPlayer.replayEntity.CurrentHandState.PlayerHoldingCards[players[0]];

        this.mainForm.drawingFormHelper.DrawSidebarFull();
        this.mainForm.drawingFormHelper.DrawDiscardedCards();

        if (shouldDraw) {
            this.drawAllPlayerHandCards();
            this.mainForm.drawingFormHelper.TrumpMadeCardsShowFromLastTrick();
        }
    }

    private drawAllPlayerHandCards() {
        for (let i = 1; i <= 4; i++) {
            this.mainForm.drawingFormHelper.DrawHandCardsByPosition(i, this.mainForm.tractorPlayer.replayEntity.CurrentHandState.PlayerHoldingCards[this.mainForm.PositionPlayer[i]], i == 1 ? 1 : this.coordinates.replayHandCardScale);
        }
    }

    private replayNextTrick() {
        if (this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates.Count == 0) {
            return;
        }
        let trick: CurrentTrickState = this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates[0];
        this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates.shift(0);
        this.mainForm.tractorPlayer.replayedTricks.push(trick);
        if (trick == null) {
            this.mainForm.tractorPlayer.CurrentHandState.ScoreCards = CommonMethods.deepCopy<number[]>(this.mainForm.tractorPlayer.replayEntity.CurrentHandState.ScoreCards);
            this.mainForm.tractorPlayer.CurrentHandState.Score = this.mainForm.tractorPlayer.replayEntity.CurrentHandState.Score;

            this.mainForm.drawingFormHelper.resetReplay();
            this.mainForm.drawingFormHelper.DrawFinishedSendedCards();
            return;
        }
        this.mainForm.drawingFormHelper.resetReplay();

        if (Object.keys(trick.ShowedCards).length == 1 && this.mainForm.PlayerPosition[trick.Learder] == 1) {
            this.DrawDumpFailureMessage(trick);
        }

        this.mainForm.tractorPlayer.CurrentTrickState = trick;
        let curPlayer: string = trick.Learder;
        let drawDelay = 100;
        let i = 1;
        for (; i <= Object.keys(trick.ShowedCards).length; i++) {
            let position = this.mainForm.PlayerPosition[curPlayer];
            if (Object.keys(trick.ShowedCards).length == 4) {
                trick.ShowedCards[curPlayer].forEach(card => {
                    this.mainForm.tractorPlayer.replayEntity.CurrentHandState.PlayerHoldingCards[curPlayer].RemoveCard(card);
                })
            }

            let cardsList: number[] = CommonMethods.deepCopy<number[]>(trick.ShowedCards[curPlayer]);
            setTimeout(() => {
                this.mainForm.drawingFormHelper.DrawShowedCardsByPosition(cardsList, position)
            }, i * drawDelay);
            curPlayer = CommonMethods.GetNextPlayerAfterThePlayer(this.mainForm.tractorPlayer.CurrentGameState.Players, curPlayer).PlayerId;
        }

        if (Object.keys(trick.ShowedCards).length == 1 && this.mainForm.PlayerPosition[trick.Learder] != 1) {
            this.DrawDumpFailureMessage(trick);
        }

        setTimeout(() => {
            this.drawAllPlayerHandCards();
        }, i * drawDelay);

        if (trick.Winner) {
            if (!this.mainForm.tractorPlayer.CurrentGameState.ArePlayersInSameTeam(
                this.mainForm.tractorPlayer.CurrentHandState.Starter, trick.Winner)) {
                this.mainForm.tractorPlayer.CurrentHandState.Score += trick.Points();
                //收集得分牌
                this.mainForm.tractorPlayer.CurrentHandState.ScoreCards = this.mainForm.tractorPlayer.CurrentHandState.ScoreCards.concat(trick.ScoreCards());
            }
        }
        this.mainForm.drawingFormHelper.DrawScoreImageAndCards();
    }

    private DrawDumpFailureMessage(trick: CurrentTrickState) {
        this.mainForm.tractorPlayer.NotifyMessage([
            `玩家【${trick.Learder}】`,
            `甩牌${trick.ShowedCards[trick.Learder].length}张失败`,
            `罚分：${trick.ShowedCards[trick.Learder].length * 10}`,
            "",
            "",
            "",
            ""
        ]);
    }

    public btnFirstTrick_Click() {
        if (this.mainForm.tractorPlayer.replayedTricks.length > 0) this.loadReplayEntity(this.currentReplayEntities[1][this.selectTimes.selectedIndex], true);
        else {
            if (this.replayPreviousFile()) this.btnLastTrick_Click();
        }
    }

    public btnPreviousTrick_Click() {
        if (this.mainForm.tractorPlayer.replayedTricks.length > 1) {
            this.mainForm.drawingFormHelper.resetReplay();
            this.revertReplayTrick();
            this.revertReplayTrick();
            this.replayNextTrick();
        }
        else if (this.mainForm.tractorPlayer.replayedTricks.length == 1) {
            this.btnFirstTrick_Click();
        }
        else {
            if (this.replayPreviousFile()) this.btnLastTrick_Click();
        }
    }

    public btnNextTrick_Click() {
        if (this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates.length == 0) {
            this.replayNextFile();
            return;
        }
        this.replayNextTrick();
    }

    public btnLastTrick_Click() {
        if (this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates.length > 0) {
            while (this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates.length > 1) {
                let trick: CurrentTrickState = this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates[0];
                this.mainForm.tractorPlayer.replayedTricks.push(trick);
                this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates.shift();

                // 甩牌失败
                if (Object.keys(trick.ShowedCards).length == 1) continue;

                let curPlayer: string = trick.Learder;
                for (let i = 0; i < Object.keys(trick.ShowedCards).length; i++) {
                    trick.ShowedCards[curPlayer].forEach(card => {
                        this.mainForm.tractorPlayer.replayEntity.CurrentHandState.PlayerHoldingCards[curPlayer].RemoveCard(card);
                    })
                    curPlayer = CommonMethods.GetNextPlayerAfterThePlayer(this.mainForm.tractorPlayer.CurrentGameState.Players, curPlayer).PlayerId;
                }
            }
            this.mainForm.drawingFormHelper.DrawHandCardsByPosition(1, this.mainForm.tractorPlayer.CurrentPoker, 1);
            this.replayNextTrick();
        }
        else this.replayNextFile();
    }

    private replayPreviousFile(): boolean {
        if (this.selectTimes.selectedIndex > 0) {
            this.selectTimes.selectedIndex = this.selectTimes.selectedIndex - 1;
            this.loadReplayEntity(this.currentReplayEntities[1][this.selectTimes.selectedIndex], false);
            return true;
        }
        else if (this.selectDates.selectedIndex > 0) {
            this.selectDates.selectedIndex = this.selectDates.selectedIndex - 1;
            this.onDatesSelectChange(false, -1);
            if (this.selectTimes.options && this.selectTimes.options.length > 0) {
                this.selectTimes.selectedIndex = this.selectTimes.options.length - 1;
                this.loadReplayEntity(this.currentReplayEntities[1][this.selectTimes.selectedIndex], false);
                return true;
            }
        }
        return false;
    }

    private replayNextFile() {
        if (this.selectTimes.selectedIndex < this.selectTimes.options.length - 1) {
            this.selectTimes.selectedIndex = this.selectTimes.selectedIndex + 1;
            this.loadReplayEntity(this.currentReplayEntities[1][this.selectTimes.selectedIndex], true);
        }
        else if (this.selectDates.selectedIndex < this.selectDates.options.length - 1) {
            this.selectDates.selectedIndex = this.selectDates.selectedIndex + 1;
            this.onDatesSelectChange(false, 1);
            if (this.selectTimes.options && this.selectTimes.options.length > 0) {
                this.loadReplayEntity(this.currentReplayEntities[1][this.selectTimes.selectedIndex], true);
            }
        }
    }

    private revertReplayTrick() {
        let trick: CurrentTrickState = this.mainForm.tractorPlayer.replayedTricks.pop();
        this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates.unshift(trick);
        if (trick == null) {
            this.mainForm.tractorPlayer.CurrentHandState.Score -= this.mainForm.tractorPlayer.CurrentHandState.ScorePunishment + this.mainForm.tractorPlayer.CurrentHandState.ScoreLast8CardsBase * this.mainForm.tractorPlayer.CurrentHandState.ScoreLast8CardsMultiplier;
            this.mainForm.drawingFormHelper.DrawDiscardedCards();
        }
        else if (Object.keys(trick.ShowedCards).length == 4) {
            for (const [key, value] of Object.entries(trick.ShowedCards)) {
                (value as number[]).forEach(card => {
                    this.mainForm.tractorPlayer.replayEntity.CurrentHandState.PlayerHoldingCards[key].AddCard(card);
                })
            }
            if (trick.Winner) {
                if (!this.mainForm.tractorPlayer.CurrentGameState.ArePlayersInSameTeam(this.mainForm.tractorPlayer.CurrentHandState.Starter, trick.Winner)) {
                    this.mainForm.tractorPlayer.CurrentHandState.Score -= trick.Points();
                    //收集得分牌
                    trick.ScoreCards().forEach(sc => {
                        this.mainForm.tractorPlayer.CurrentHandState.ScoreCards = CommonMethods.ArrayRemoveOneByValue(this.mainForm.tractorPlayer.CurrentHandState.ScoreCards, sc)
                    })
                }
            }
            this.mainForm.drawingFormHelper.DrawScoreImageAndCards();
        }
    }

    // pos is 1-based
    public replayAngleByPosition(pos: number) {
        let angleOffset = pos - 1;
        this.mainForm.tractorPlayer.replayAngle = (this.mainForm.tractorPlayer.replayAngle + angleOffset) % 4;
        this.mainForm.tractorPlayer.replayEntity.Players = CommonMethods.RotateArray(this.mainForm.tractorPlayer.replayEntity.Players, angleOffset);
        if (this.mainForm.tractorPlayer.replayEntity.PlayerRanks != null) {
            this.mainForm.tractorPlayer.replayEntity.PlayerRanks = CommonMethods.RotateArray(this.mainForm.tractorPlayer.replayEntity.PlayerRanks, angleOffset);
        }
        this.StartReplay(true);
    }

    private onDatesSelectChange(isFromClick: boolean, direction: number) {
        if (isFromClick) {
            this.currentReplayEntities = [undefined, undefined, undefined];
            IDBHelper.ReadReplayEntityByDate(this.selectDates.value, (reList: ReplayEntity[]) => {
                this.currentReplayEntities[1] = reList;
                this.removeOptions(this.selectTimes);
                for (let i = 0; i < reList.length; i++) {
                    let re: ReplayEntity = reList[i];
                    let datetimes: string[] = re.ReplayId.split(IDBHelper.replaySeparator);
                    let timeString = datetimes[1];
                    var option = document.createElement("option");
                    option.text = timeString;
                    this.selectTimes.add(option);
                }
            });
            let prevDatesIndex = this.selectDates.selectedIndex - 1;
            if (prevDatesIndex >= 0) {
                IDBHelper.ReadReplayEntityByDate(this.selectDates.options[prevDatesIndex].value, (reList: ReplayEntity[]) => {
                    this.currentReplayEntities[0] = reList;
                });
            }
            let nextDatesIndex = this.selectDates.selectedIndex + 1;
            if (nextDatesIndex < this.selectDates.options.length) {
                IDBHelper.ReadReplayEntityByDate(this.selectDates.options[nextDatesIndex].value, (reList: ReplayEntity[]) => {
                    this.currentReplayEntities[2] = reList;
                });
            }
        } else {
            this.removeOptions(this.selectTimes);
            let reList: ReplayEntity[] = this.currentReplayEntities[1 + direction];
            for (let i = 0; i < reList.length; i++) {
                let re: ReplayEntity = reList[i];
                let datetimes: string[] = re.ReplayId.split(IDBHelper.replaySeparator);
                let timeString = datetimes[1];
                var option = document.createElement("option");
                option.text = timeString;
                this.selectTimes.add(option);
            }
            let newDatesIndex = this.selectDates.selectedIndex + direction;
            if (direction < 0) {
                this.currentReplayEntities.pop();
                this.currentReplayEntities.unshift(undefined);
                if (newDatesIndex >= 0) {
                    IDBHelper.ReadReplayEntityByDate(this.selectDates.options[newDatesIndex].value, (reList: ReplayEntity[]) => {
                        this.currentReplayEntities[0] = reList;
                    });
                }
            } else {
                this.currentReplayEntities.shift();
                this.currentReplayEntities.push(undefined);
                if (newDatesIndex < this.selectDates.options.length) {
                    IDBHelper.ReadReplayEntityByDate(this.selectDates.options[newDatesIndex].value, (reList: ReplayEntity[]) => {
                        this.currentReplayEntities[2] = reList;
                    });
                }
            }
        }
    }

    public saveSettings() {
        cookies.set('soundVolume', this.soundVolume, { path: '/', expires: CommonMethods.GetCookieExpires() });
        cookies.set('noDanmu', this.noDanmu, { path: '/', expires: CommonMethods.GetCookieExpires() });
        cookies.set('noCutCards', this.noCutCards, { path: '/', expires: CommonMethods.GetCookieExpires() });

        if (this.joinAudioUrl && !this.joinAudioUrl.match(/^https?:\/\//i)) {
            this.joinAudioUrl = 'http://' + this.joinAudioUrl;
        }
        cookies.set('joinAudioUrl', this.joinAudioUrl, { path: '/', expires: CommonMethods.GetCookieExpires() });
        cookies.set('maxReplays', IDBHelper.maxReplays, { path: '/', expires: CommonMethods.GetCookieExpires() });
    }

    public isInGameHall() {
        return this.hallPlayerHeader && this.hallPlayerHeader.visible
    }

    public isInGameRoom() {
        return this.mainForm.roomNameText && this.mainForm.roomNameText.visible
    }

    public removeOptions(selectElement) {
        var i, L = selectElement.options.length - 1;
        for (i = L; i >= 0; i--) {
            selectElement.remove(i);
        }
    }

    public createTooltip(x: number, y: number, content: string): Phaser.GameObjects.Text {
        let temptt = this.add.text(x, y, content)
            .setColor('white')
            .setFontSize(20)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setVisible(false);

        y = y - (temptt.getBottomLeft().y - y);
        temptt.setY(y);

        this.tweens.add({
            targets: temptt,
            x: x,
            y: y,
            delay: 500,
            duration: 3000,
            onStart: () => {
                temptt.setVisible(true);
            },
            onComplete: () => {
                temptt.destroy();
            }
        });

        return temptt;
    }

    public sendMessageToServer(messageType: string, playerID: string, content: string) { }
    public loadAudioFiles() { }
    public drawSgsAni(effectName: string, effectNature: string, wid: number, hei: number) { }
    public savePlayerLoginInfo(nnorp: string[]) { }
}