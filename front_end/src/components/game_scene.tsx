// @ts-nocheck
import Phaser from "phaser";
import bgimage from "../assets/bg2.jpg"
import pokerImage from "../assets/poker.png"
import suitsImage from "../assets/suits.png"
import suitsbarImage from "../assets/suitsbar.png"
import beginGame from "../assets/btn/begin.png"
import prepareOk from "../assets/btn/prepare_ok.png"
import pokerTable from "../assets/btn/poker_table.png"
import pokerChair from "../assets/btn/poker_chair.png"
import bagua from "../assets/bagua.png"
import huosha from "../assets/huosha.png"
import leisha from "../assets/leisha.png"
import pusha from "../assets/sha.png"
import zhugong from "../assets/zhugong.png"
import biyue1 from '../assets/music/biyue1.mp3';
import draw from '../assets/music/draw.mp3';
import drawx from '../assets/music/drawx.mp3';
import equip1 from '../assets/music/equip1.mp3';
import equip2 from '../assets/music/equip2.mp3';
import fankui2 from '../assets/music/fankui2.mp3';
import sha_fire from '../assets/music/sha_fire.mp3';
import sha_thunder from '../assets/music/sha_thunder.mp3';
import sha from '../assets/music/sha.mp3';
import tie from '../assets/music/tie.mp3';
import win from '../assets/music/win.mp3';
import zhu_junlve from '../assets/music/zhu_junlve.mp3';
import recoverhp from '../assets/music/recover.mp3';
import walkerjson from '../assets/animations/walker.json';
import walkerpng from '../assets/animations/walker.png';
import sf2ryujson from '../assets/animations/sf2ryu.json';
import sf2ryupng from '../assets/animations/sf2ryu.png';
import settingsForm from '../assets/text/settings_form.txt';

import { nanoid } from 'nanoid'
import { Match } from './match';
import { RoomState } from './room_state';
import { count } from "console";
import { imageListClasses } from "@mui/material";
import { ObjectFlags } from "typescript";
import { RoomSetting } from "./room_setting";
import { GameState } from "./game_state";
import { CurrentHandState } from "./current_hand_state";
import { CurrentTrickState } from "./current_trick_state";
import { TractorPlayer } from "./tractor_player";
import { MainForm } from "./main_form";
import { Coordinates } from "./coordinates";
import { CommonMethods } from "./common_methods";
import { ShowingCardsValidationResult } from "./showing_cards_validation_result";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const SET_PLAYER_NAME_REQUEST = "set_player_name"
const PLAYER_ENTER_HALL_REQUEST = "PlayerEnterHall"
const PLAYER_ENTER_ROOM_REQUEST = "PlayerEnterRoom"
const JOIN_ROOM_REQUEST = "join_room"
const PREPARE_REQUEST = "prepare"

const ROOM_LIST_RESPONSE = "room_list"
const EXISTS_PLAYERS_RESPONSE = "exists_players"
const DEAL_POKER_RESPONSE = "deal_poker"
const NotifyGameHall_RESPONSE = "NotifyGameHall"
const NotifyMessage_RESPONSE = "NotifyMessage"
const NotifyRoomSetting_RESPONSE = "NotifyRoomSetting"
const NotifyGameState_RESPONSE = "NotifyGameState"
const NotifyCurrentHandState_RESPONSE = "NotifyCurrentHandState"
const NotifyCurrentTrickState_RESPONSE = "NotifyCurrentTrickState"
const GetDistributedCard_RESPONSE = "GetDistributedCard"
const NotifyCardsReady_RESPONSE = "NotifyCardsReady"
const NotifyDumpingValidationResult_RESPONSE = "NotifyDumpingValidationResult" // failure
const NotifyTryToDumpResult_RESPONSE = "NotifyTryToDumpResult" // both
const NotifyStartTimer_RESPONSE = "NotifyStartTimer" // both

const screenWidth = document.documentElement.clientWidth;
const screenHeight = document.documentElement.clientHeight;
const dummyValue = "dummyValue"
const IPPort = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):(6553[0-5]|655[0-2][0-9]|65[0-4][0-9][0-9]|6[0-4][0-9][0-9][0-9][0-9]|[1-5](\d){4}|[1-9](\d){0,3})$/;

interface Player {
    name: string
    prepare: boolean
}

export class GameScene extends Phaser.Scene {
    public hostName
    public hostNameOriginal
    public playerName
    public websocket: WebSocket | null
    public players: Player[]
    public prepareBtn: Phaser.GameObjects.Image
    public prepareOkImg: Phaser.GameObjects.Image[]
    public pokerTableChairImg: { tableImg: Phaser.GameObjects.Image, chairImgs: Phaser.GameObjects.Image[] }[]
    public pokerTableChairNames: { tableName: Phaser.GameObjects.Text, chairNames: { myOwnName: Phaser.GameObjects.Text, observerNames: Phaser.GameObjects.Text[] }[] }[]
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
    public hallPlayerHeader: Phaser.GameObjects.Text
    public hallPlayerNames: Phaser.GameObjects.Text[]
    public clientMessages: Phaser.GameObjects.Text[]
    public roomUIControls: { images: Phaser.GameObjects.Image[], texts: ser.GameObjects.Text[] }
    public soundbiyue1: Phaser.Sound.BaseSound;
    public soundRecoverhp: Phaser.Sound.BaseSound;
    public sounddraw: Phaser.Sound.BaseSound;
    public sounddrawx: Phaser.Sound.BaseSound;
    public soundPlayersShowCard: Phaser.Sound.BaseSound[];
    public soundfankui2: Phaser.Sound.BaseSound;
    public soundtie: Phaser.Sound.BaseSound;
    public soundwin: Phaser.Sound.BaseSound;
    public soundVolume: number

    constructor(hostName, playerName: string) {
        super("GameScene")
        this.hostName = hostName
        this.hostNameOriginal = hostName
        this.playerName = playerName
        this.existPlayers = [1]
        this.players = [{ name: playerName, prepare: false }, null, null, null]
        this.websocket = null
        this.getPlayerMsgCnt = 0
        this.prepareOkImg = [null, null, null, null]
        this.pokerTableChairImg = []
        this.pokerTableChairNames = []
        this.match = new Match()
        this.cardImages = [];
        this.cardImageSequence = [];
        this.toolbarImages = [];
        this.sidebarImages = [];
        this.scoreCardsImages = [];
        this.last8CardsImages = [];
        this.showedCardImages = [];
        this.overridingLabelImages = [];
        this.hallPlayerNames = [];
        this.clientMessages = [];
        this.roomUIControls = { images: [], texts: [] };
        this.soundVolume = cookies.get("soundVolume");
        if (this.soundVolume === undefined) this.soundVolume = 0.5

        if (!IPPort.exec(this.hostName)) {
            this.processAuth();
        }
    }

    preload() {
        this.load.image("bg2", bgimage)
        this.load.image("beginGame", beginGame)
        this.load.image("prepareOk", prepareOk)
        this.load.image("pokerTable", pokerTable)
        this.load.image("pokerChair", pokerChair)
        this.load.image("bagua", bagua)
        this.load.image("huosha", huosha)
        this.load.image("leisha", leisha)
        this.load.image("pusha", pusha)
        this.load.image("zhugong", zhugong)
        this.overridingLabelImages = [
            "bagua",
            "zhugong",
            "pusha",
            "huosha",
            "leisha",
        ]
        this.load.spritesheet('poker', pokerImage, {
            frameWidth: Coordinates.cardWidth,
            frameHeight: Coordinates.cardHeigh
        });
        this.load.spritesheet('suitsImage', suitsImage, {
            frameWidth: Coordinates.toolbarSize,
            frameHeight: Coordinates.toolbarSize
        });
        this.load.spritesheet('suitsbarImage', suitsbarImage, {
            frameWidth: Coordinates.toolbarSize,
            frameHeight: Coordinates.toolbarSize
        });
        this.load.audio("biyue1", biyue1);
        this.load.audio("draw", draw);
        this.load.audio("drawx", drawx);
        this.load.audio("equip1", equip1);
        this.load.audio("equip2", equip2);
        this.load.audio("fankui2", fankui2);
        this.load.audio("sha", sha);
        this.load.audio("sha_fire", sha_fire);
        this.load.audio("sha_thunder", sha_thunder);
        this.load.audio("tie", tie);
        this.load.audio("win", win);
        this.load.audio("zhu_junlve", zhu_junlve);
        this.load.audio("recoverhp", recoverhp);
        this.load.html('settingsForm', settingsForm);

        this.load.atlas('walker', walkerpng, walkerjson);
        this.load.atlas('sf2ryu', sf2ryupng, sf2ryujson);
    }

    create() {
        this.add.image(0, 0, 'bg2').setOrigin(0).setDisplaySize(screenWidth, screenHeight);
        try {
            this.websocket = new WebSocket(`ws://${this.hostName}`)
            this.websocket.onerror = this.onerror.bind(this)
            this.websocket.onopen = this.onopen.bind(this)
            this.websocket.onmessage = this.onmessage.bind(this)
        } catch (e) {
            let errString = e.toString()
            if (errString.toLowerCase().includes(CommonMethods.wsErrorType_Insecure)) {
                document.body.innerHTML = `<div>检测到您的浏览器尚未设置，请参照<a href="#" onclick="javascript:{window.open('https://bit.ly/chromstep')}">此图解</a>先进行相应设置</div>`
            } else {
                document.body.innerHTML = `<div>!!! 尝试链接服务器失败，错误信息：${errString}</div>`
                console.log(e);
            }
        }
    }
    onerror(e) {
        document.body.innerHTML = `<div>!!! 尝试链接服务器失败，请确认输入信息无误：${this.hostNameOriginal}</div>`
        console.error(JSON.stringify(e));
    }
    onopen() {
        // try {
        console.log("连接成功")
        cookies.set('showNotice', 'none', { path: '/' });

        this.sendMessageToServer(PLAYER_ENTER_HALL_REQUEST, this.playerName, JSON.stringify({
            playerName: this.playerName,
        }))
        this.mainForm = new MainForm(this)
        this.loadAudioFiles()
        this.input.mouse.disableContextMenu();
        CommonMethods.BuildCardNumMap()
        // } catch (e) {
        //     // alert("error")
        //     document.body.innerHTML = `<div>!!! onopen Error: ${e}</div>`
        // }
    }

    onmessage(message) {
        // try {
        const data = JSON.parse(message.data)
        const messageType = data["messageType"]
        const playerID = data["playerID"]
        const content = data["content"]
        // console.log(messageType)
        // console.log(content)

        const objList = JSON.parse(content)
        if (objList == null || objList.length == 0) return

        if (messageType === NotifyGameHall_RESPONSE) {
            this.handleNotifyGameHall(objList);
        } else if (messageType === NotifyMessage_RESPONSE) {
            this.handleNotifyMessage(objList);
        } else if (messageType === NotifyRoomSetting_RESPONSE) {
            this.handleNotifyRoomSetting(objList);
        } else if (messageType === NotifyGameState_RESPONSE) {
            this.handleNotifyGameState(objList);
        } else if (messageType === NotifyCurrentHandState_RESPONSE) {
            this.handleNotifyCurrentHandState(objList);
        } else if (messageType === NotifyCurrentTrickState_RESPONSE) {
            this.handleNotifyCurrentTrickState(objList);
        } else if (messageType === GetDistributedCard_RESPONSE) {
            this.handleGetDistributedCard(objList);
        } else if (messageType === NotifyCardsReady_RESPONSE) {
            this.handleNotifyCardsReady(objList);
        } else if (messageType === NotifyDumpingValidationResult_RESPONSE) {
            this.handleNotifyDumpingValidationResult(objList);
        } else if (messageType === NotifyTryToDumpResult_RESPONSE) {
            this.handleNotifyTryToDumpResult(objList);
        } else if (messageType === NotifyStartTimer_RESPONSE) {
            this.handleNotifyStartTimer(objList);
        }
        // } catch (e) {
        //     // alert("error")
        //     document.body.innerHTML = `<div>!!! onmessage Error: ${e}</div>`
        // }
    }

    private handleNotifyStartTimer(objList: []) {
        var result: number = objList[0];
        this.mainForm.tractorPlayer.NotifyStartTimer(result)
    }

    private handleNotifyDumpingValidationResult(objList: []) {
        var result: ShowingCardsValidationResult = objList[0];
        this.mainForm.tractorPlayer.NotifyDumpingValidationResult(result)
    }

    private handleNotifyTryToDumpResult(objList: []) {
        var result: ShowingCardsValidationResult = objList[0];
        this.mainForm.tractorPlayer.NotifyTryToDumpResult(result)
    }

    private handleNotifyCardsReady(objList: []) {
        var cardsReady: boolean[] = objList[0];
        this.mainForm.tractorPlayer.NotifyCardsReady(cardsReady)
    }

    private handleGetDistributedCard(objList: []) {
        var cardNumber: number = objList[0];
        this.mainForm.tractorPlayer.GetDistributedCard(cardNumber)
    }

    private handleNotifyGameHall(objList: []) {
        this.mainForm.tractorPlayer.destroyAllClientMessages();
        this.mainForm.destroyGameRoom();
        this.destroyGameHall();
        this.drawGameHall(objList);
    }

    private handleNotifyMessage(objList: []) {
        var msgs = objList[0];
        this.mainForm.tractorPlayer.NotifyMessage(msgs)
    }

    private handleNotifyRoomSetting(objList: []) {
        var roomSetting: RoomSetting = objList[0];
        var showMessage: boolean = objList[1];
        this.mainForm.tractorPlayer.NotifyRoomSetting(this, roomSetting, showMessage)
    }

    private handleNotifyGameState(objList: []) {
        var gameState: GameState = objList[0];
        this.mainForm.tractorPlayer.NotifyGameState(gameState)
    }

    private handleNotifyCurrentHandState(objList: []) {
        var currentHandState: CurrentHandState = objList[0];
        this.mainForm.tractorPlayer.NotifyCurrentHandState(currentHandState)
    }

    private handleNotifyCurrentTrickState(objList: []) {
        var currentTrickState: CurrentTrickState = objList[0];
        this.mainForm.tractorPlayer.NotifyCurrentTrickState(currentTrickState)
    }

    private processAuth() {
        var CryptoJS = require("crypto-js");
        var bytes = CryptoJS.AES.decrypt(this.hostName, dummyValue);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (bytes && bytes.sigBytes > 0 > 0 && originalText) {
            this.hostName = originalText
        }
    }

    public loadAudioFiles() {
        this.mainForm.enableSound = this.soundVolume > 0
        this.soundbiyue1 = this.sound.add("biyue1", { volume: this.soundVolume });
        this.soundRecoverhp = this.sound.add("recoverhp", { volume: this.soundVolume });
        this.sounddraw = this.sound.add("draw", { volume: this.soundVolume });
        this.sounddrawx = this.sound.add("drawx", { volume: this.soundVolume });
        this.soundPlayersShowCard = [
            this.sound.add("equip1", { volume: this.soundVolume }),
            this.sound.add("equip2", { volume: this.soundVolume }),
            this.sound.add("zhu_junlve", { volume: this.soundVolume }),
            this.sound.add("sha", { volume: this.soundVolume }),
            this.sound.add("sha_fire", { volume: this.soundVolume }),
            this.sound.add("sha_thunder", { volume: this.soundVolume }),
        ]
        this.soundfankui2 = this.sound.add("fankui2", { volume: this.soundVolume });
        this.soundtie = this.sound.add("tie", { volume: this.soundVolume });
        this.soundwin = this.sound.add("win", { volume: this.soundVolume });
    }

    public saveAudioVolume() {
        cookies.set('soundVolume', this.soundVolume, { path: '/' });
    }

    public drawGameHall(objList: []) {
        var roomStateList: RoomState[] = objList[0];
        var playerList: string[] = objList[1];

        this.hallPlayerHeader = this.add.text(Coordinates.hallPlayerHeaderPosition.x, Coordinates.hallPlayerHeaderPosition.y, "在线").setColor('white').setFontSize(30).setShadow(2, 2, "#333333", 2, true, true)
        for (let i = 0; i < playerList.length; i++) {
            this.hallPlayerNames[i] = this.add.text(Coordinates.hallPlayerTopPosition.x, Coordinates.hallPlayerTopPosition.y + i * 40, playerList[i]).setColor('white').setFontSize(20).setShadow(2, 2, "#333333", 2, true, true);
        }

        var pokerTablePositionStart = { x: 320, y: 160 }
        var pokerTableOffsets = { x: 400, y: 320 }
        var tableSize = 160
        var chairSize = 80
        var pokerTableLabelOffsets = { x: 40, y: 20 }

        var pokerChairOffsets = [
            { x: 40, y: -80 },
            { x: -80, y: 40 },
            { x: 40, y: 120 },
            { x: 160, y: 40 },
        ]
        for (let i = 0; i < roomStateList.length; i++) {
            var thisTableX = pokerTablePositionStart.x + pokerTableOffsets.x * (i % 2)
            var thisTableY = pokerTablePositionStart.y + pokerTableOffsets.y * Math.floor(i / 2)
            this.pokerTableChairImg[i] = {}
            this.pokerTableChairNames[i] = {}
            this.pokerTableChairImg[i].tableImg = this.add.image(thisTableX, thisTableY, 'pokerTable')
                .setOrigin(0, 0)
                .setDisplaySize(160, 160)
                .setInteractive({ useHandCursor: true })
                .on('pointerup', () => {
                    if (this.mainForm.settingsForm) return
                    this.sendMessageToServer(PLAYER_ENTER_ROOM_REQUEST, this.playerName, JSON.stringify({
                        roomID: i,
                        posID: -1,
                    }))
                })
                .on('pointerover', () => {
                    if (this.mainForm.settingsForm) return
                    this.pokerTableChairImg[i].tableImg.y -= 5
                    this.pokerTableChairNames[i].tableName.y -= 5
                })
                .on('pointerout', () => {
                    if (this.mainForm.settingsForm) return
                    this.pokerTableChairImg[i].tableImg.y += 5
                    this.pokerTableChairNames[i].tableName.y += 5
                })
            this.pokerTableChairNames[i].tableName = this.add.text(thisTableX + pokerTableLabelOffsets.x, thisTableY + pokerTableLabelOffsets.y, roomStateList[i].roomSetting.RoomName)
                .setColor('white')
                .setFontSize(20)
                .setShadow(2, 2, "#333333", 2, true, true)

            this.pokerTableChairImg[i].chairImgs = []
            this.pokerTableChairNames[i].chairNames = []
            for (let j = 0; j < 4; j++) {
                var thisChairX = thisTableX + pokerChairOffsets[j].x;
                var thisChairY = thisTableY + pokerChairOffsets[j].y;
                this.pokerTableChairNames[i].chairNames[j] = {}
                if (roomStateList[i].CurrentGameState.Players[j] != null) {
                    var obCount = roomStateList[i].CurrentGameState.Players[j].Observers.length
                    var obOffsetY = 20
                    var myOwnOffsetY = 0
                    if (j == 0) {
                        myOwnOffsetY = obOffsetY
                    }
                    this.pokerTableChairNames[i].chairNames[j].myOwnName = this.add.text(thisChairX + 10, thisChairY + 20 - obCount * myOwnOffsetY, roomStateList[i].CurrentGameState.Players[j].PlayerId).setColor('white').setFontSize(20).setShadow(2, 2, "#333333", 2, true, true);
                    if (obCount > 0) {
                        this.pokerTableChairNames[i].chairNames[j].observerNames = []
                        for (let k = 0; k < roomStateList[i].CurrentGameState.Players[j].Observers.length; k++) {
                            this.pokerTableChairNames[i].chairNames[j].observerNames[k] = this.add.text(thisChairX + 10, thisChairY + 20 - obCount * myOwnOffsetY + (k + 1) * obOffsetY, `【${roomStateList[i].CurrentGameState.Players[j].Observers[k]}】`).setColor('white').setFontSize(20).setShadow(2, 2, "#333333", 2, true, true);
                        }
                    }
                } else {
                    this.pokerTableChairImg[i].chairImgs[j] = this.add.image(thisChairX, thisChairY, 'pokerChair')
                        .setOrigin(0, 0).setDisplaySize(80, 80)
                        .setInteractive({ useHandCursor: true })
                        .on('pointerup', () => {
                            if (this.mainForm.settingsForm) return
                            this.sendMessageToServer(PLAYER_ENTER_ROOM_REQUEST, this.playerName, JSON.stringify({
                                roomID: i,
                                posID: j,
                            }))
                        })
                        .on('pointerover', () => {
                            if (this.mainForm.settingsForm) return
                            this.pokerTableChairImg[i].chairImgs[j].y -= 5
                            this.pokerTableChairNames[i].chairNames[j].myOwnName.y -= 5
                        })
                        .on('pointerout', () => {
                            if (this.mainForm.settingsForm) return
                            this.pokerTableChairImg[i].chairImgs[j].y += 5
                            this.pokerTableChairNames[i].chairNames[j].myOwnName.y += 5
                        })
                    this.pokerTableChairNames[i].chairNames[j].myOwnName = this.add.text(thisChairX + 35, thisChairY + 20, j + 1).setColor('yellow').setFontSize(20).setShadow(2, 2, "#333333", 2, true, true);
                }
            }
        }
    }

    public destroyGameHall() {
        if (this.hallPlayerHeader != null) {
            this.hallPlayerHeader.destroy();
        }
        this.hallPlayerNames.forEach(nameLabel => {
            nameLabel.destroy();
        });
        this.pokerTableChairNames.forEach(tableChair => {
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
        this.pokerTableChairImg.forEach(tableChair => {
            tableChair.tableImg.destroy();
            if (tableChair.chairImgs != null) {
                tableChair.chairImgs.forEach(chair => {
                    chair.destroy();
                });
            }
        });
    }

    sendMessageToServer(messageType: string, playerID: string, content: string) {
        this.websocket.send(JSON.stringify({
            "messageType": messageType, "playerID": playerID, "content": content
        }))
    }

    public isInGameHall() {
        return this.hallPlayerHeader && this.hallPlayerHeader.visible
    }
}