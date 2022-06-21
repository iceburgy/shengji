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
import emojiForm from '../assets/text/emoji_form.htm';
import emGoodjob from "../assets/sprites/goodjob.png"
import emGoodjob2 from "../assets/sprites/goodjob2.png"
import emGoodjob3 from "../assets/sprites/goodjob3.png"
import emGoodjob4 from "../assets/sprites/goodjob4.png"
import emBadjob from "../assets/sprites/badjob.png"
import emBadjob2 from "../assets/sprites/badjob2.png"
import emBadjob3 from "../assets/sprites/badjob3.png"
import emBadjob4 from "../assets/sprites/badjob4.png"
import emHappy from "../assets/sprites/happy.png"
import emHappy2 from "../assets/sprites/happy2.png"
import emHappy3 from "../assets/sprites/happy3.png"
import emHappy4 from "../assets/sprites/happy4.png"
import emSad from "../assets/sprites/sad.png"
import emSad2 from "../assets/sprites/sad2.png"
import emSad3 from "../assets/sprites/sad3.png"
import emSad4 from "../assets/sprites/sad4.png"
import emHurryup from "../assets/sprites/hurryup.png"
import emHurryup2 from "../assets/sprites/hurryup2.png"
import emHurryup3 from "../assets/sprites/hurryup3.png"
import emHurryup4 from "../assets/sprites/hurryup4.png"
import emFireworks from "../assets/sprites/fireworks.png"
import emFireworks2 from "../assets/sprites/fireworks2.png"
import emFireworks3 from "../assets/sprites/fireworks3.png"
import emFireworks4 from "../assets/sprites/fireworks4.png"

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
import { EmojiUtil } from "./emoji_util";

const cookies = new Cookies();
const SET_PLAYER_NAME_REQUEST = "set_player_name"
const PLAYER_ENTER_HALL_REQUEST = "PlayerEnterHall"
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
const NotifyEmoji_RESPONSE = "NotifyEmoji"

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
    public hallPlayerHeader: Phaser.GameObjects.Text
    public hallPlayerNames: Phaser.GameObjects.Text[]
    public clientMessages: Phaser.GameObjects.Text[]
    public danmuMessages: any[]
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
    public noDanmu: string
    public danmuHistory: string[]

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
        this.danmuMessages = [];
        this.roomUIControls = { images: [], texts: [] };
        this.soundVolume = cookies.get("soundVolume");
        if (this.soundVolume === undefined) this.soundVolume = 0.5
        this.noDanmu = cookies.get("noDanmu");
        if (this.noDanmu === undefined) this.noDanmu = 'false'

        if (!IPPort.exec(this.hostName)) {
            this.processAuth();
        }
        this.danmuHistory = [];
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
        this.load.html('emojiForm', emojiForm);

        this.load.atlas('walker', walkerpng, walkerjson);
        this.load.atlas('sf2ryu', sf2ryupng, sf2ryujson);
        this.load.spritesheet('emGoodjob', emGoodjob, { frameWidth: EmojiUtil.emojiFrameSize[0][0].x, frameHeight: EmojiUtil.emojiFrameSize[0][0].y });
        this.load.spritesheet('emGoodjob2', emGoodjob2, { frameWidth: EmojiUtil.emojiFrameSize[0][1].x, frameHeight: EmojiUtil.emojiFrameSize[0][1].y });
        this.load.spritesheet('emGoodjob3', emGoodjob3, { frameWidth: EmojiUtil.emojiFrameSize[0][2].x, frameHeight: EmojiUtil.emojiFrameSize[0][2].y });
        this.load.spritesheet('emGoodjob4', emGoodjob4, { frameWidth: EmojiUtil.emojiFrameSize[0][3].x, frameHeight: EmojiUtil.emojiFrameSize[0][3].y });
        this.load.spritesheet('emBadjob', emBadjob, { frameWidth: EmojiUtil.emojiFrameSize[1][0].x, frameHeight: EmojiUtil.emojiFrameSize[1][0].y });
        this.load.spritesheet('emBadjob2', emBadjob2, { frameWidth: EmojiUtil.emojiFrameSize[1][1].x, frameHeight: EmojiUtil.emojiFrameSize[1][1].y });
        this.load.spritesheet('emBadjob3', emBadjob3, { frameWidth: EmojiUtil.emojiFrameSize[1][2].x, frameHeight: EmojiUtil.emojiFrameSize[1][2].y });
        this.load.spritesheet('emBadjob4', emBadjob4, { frameWidth: EmojiUtil.emojiFrameSize[1][3].x, frameHeight: EmojiUtil.emojiFrameSize[1][3].y });
        this.load.spritesheet('emHappy', emHappy, { frameWidth: EmojiUtil.emojiFrameSize[2][0].x, frameHeight: EmojiUtil.emojiFrameSize[2][0].y });
        this.load.spritesheet('emHappy2', emHappy2, { frameWidth: EmojiUtil.emojiFrameSize[2][1].x, frameHeight: EmojiUtil.emojiFrameSize[2][1].y });
        this.load.spritesheet('emHappy3', emHappy3, { frameWidth: EmojiUtil.emojiFrameSize[2][2].x, frameHeight: EmojiUtil.emojiFrameSize[2][2].y });
        this.load.spritesheet('emHappy4', emHappy4, { frameWidth: EmojiUtil.emojiFrameSize[2][3].x, frameHeight: EmojiUtil.emojiFrameSize[2][3].y });
        this.load.spritesheet('emSad', emSad, { frameWidth: EmojiUtil.emojiFrameSize[3][0].x, frameHeight: EmojiUtil.emojiFrameSize[3][0].y });
        this.load.spritesheet('emSad2', emSad2, { frameWidth: EmojiUtil.emojiFrameSize[3][1].x, frameHeight: EmojiUtil.emojiFrameSize[3][1].y });
        this.load.spritesheet('emSad3', emSad3, { frameWidth: EmojiUtil.emojiFrameSize[3][2].x, frameHeight: EmojiUtil.emojiFrameSize[3][2].y });
        this.load.spritesheet('emSad4', emSad4, { frameWidth: EmojiUtil.emojiFrameSize[3][3].x, frameHeight: EmojiUtil.emojiFrameSize[3][3].y });
        this.load.spritesheet('emHurryup', emHurryup, { frameWidth: EmojiUtil.emojiFrameSize[4][0].x, frameHeight: EmojiUtil.emojiFrameSize[4][0].y });
        this.load.spritesheet('emHurryup2', emHurryup2, { frameWidth: EmojiUtil.emojiFrameSize[4][1].x, frameHeight: EmojiUtil.emojiFrameSize[4][1].y });
        this.load.spritesheet('emHurryup3', emHurryup3, { frameWidth: EmojiUtil.emojiFrameSize[4][2].x, frameHeight: EmojiUtil.emojiFrameSize[4][2].y });
        this.load.spritesheet('emHurryup4', emHurryup4, { frameWidth: EmojiUtil.emojiFrameSize[4][3].x, frameHeight: EmojiUtil.emojiFrameSize[4][3].y });
        this.load.spritesheet('emFireworks', emFireworks, { frameWidth: EmojiUtil.emojiFrameSize[5][0].x, frameHeight: EmojiUtil.emojiFrameSize[5][0].y });
        this.load.spritesheet('emFireworks2', emFireworks2, { frameWidth: EmojiUtil.emojiFrameSize[5][1].x, frameHeight: EmojiUtil.emojiFrameSize[5][1].y });
        this.load.spritesheet('emFireworks3', emFireworks3, { frameWidth: EmojiUtil.emojiFrameSize[5][2].x, frameHeight: EmojiUtil.emojiFrameSize[5][2].y });
        this.load.spritesheet('emFireworks4', emFireworks4, { frameWidth: EmojiUtil.emojiFrameSize[5][3].x, frameHeight: EmojiUtil.emojiFrameSize[5][3].y });
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
        EmojiUtil.CreateAllAnimations(this);
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
        } else if (messageType === NotifyEmoji_RESPONSE) {
            this.handleNotifyEmoji(objList);
        }
        // } catch (e) {
        //     // alert("error")
        //     document.body.innerHTML = `<div>!!! onmessage Error: ${e}</div>`
        // }
    }

    private handleNotifyEmoji(objList: []) {
        this.mainForm.tractorPlayer.NotifyEmoji(...objList)
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
        var roomStateList: RoomState[] = objList[0];
        var playerList: string[] = objList[1];
        this.mainForm.tractorPlayer.NotifyGameHall(roomStateList, playerList)
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

    public saveSettings() {
        cookies.set('soundVolume', this.soundVolume, { path: '/' });
        cookies.set('noDanmu', this.noDanmu, { path: '/' });
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