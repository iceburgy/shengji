// @ts-nocheck
import Phaser from "phaser";
import bgimage from "../assets/bg2.jpg"
import packageJson from '../../package.json';
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

// gobang
import chatPanel from "../assets/gobang/chatPanel.webp"
import chessboard from "../assets/gobang/chessboard.webp"
import gobangStartBtn from "../assets/gobang/startBtn.webp"
import gobangQuitBtn from "../assets/gobang/quitBtn.webp"
import gobangPieceBlackPlain from "../assets/gobang/blackNew.webp"
import gobangPieceWhitePlain from "../assets/gobang/whiteNew.webp"
import gobangPieceBlack0 from "../assets/gobang/black00a.png"
import gobangPieceBlack from "../assets/gobang/black01a.png"
import gobangPieceWhite0 from "../assets/gobang/white00a.png"
import gobangPieceWhite from "../assets/gobang/white01a.png"

// skin
import skin_frame from "../assets/skin/frame.webp"
import skin_questionmark from "../assets/skin/questionmark.webp"
import skin_basicmale from "../assets/skin/basicmale.webp"
import skin_basicfemale from "../assets/skin/basicfemale.webp"

//boys and girls
import skin_girl_mask from "../assets/skin/skin_girl_mask.webp"
import skin_girl_moyu from "../assets/skin/skin_girl_moyu.webp"
import skin_girl_1 from "../assets/skin/skin_girl_1.webp"
import skin_girl_2 from "../assets/skin/skin_girl_2.webp"
import skin_girl_3 from "../assets/skin/skin_girl_3.webp"
import skin_girl_4 from "../assets/skin/skin_girl_4.webp"
import skin_girl_5 from "../assets/skin/skin_girl_5.webp"
import skin_girl_6 from "../assets/skin/skin_girl_6.webp"
import skin_girl_7 from "../assets/skin/skin_girl_7.webp"
import skin_girl_8 from "../assets/skin/skin_girl_8.webp"
import skin_girl_9 from "../assets/skin/skin_girl_9.webp"
import skin_boy_mask from "../assets/skin/skin_boy_mask.webp"
import skin_boy_moyu from "../assets/skin/skin_boy_moyu.webp"
import skin_boy_1 from "../assets/skin/skin_boy_1.webp"
import skin_boy_2 from "../assets/skin/skin_boy_2.webp"
import skin_boy_3 from "../assets/skin/skin_boy_3.webp"
import skin_boy_4 from "../assets/skin/skin_boy_4.webp"
import skin_boy_5 from "../assets/skin/skin_boy_5.webp"
import skin_boy_6 from "../assets/skin/skin_boy_6.webp"
import skin_boy_7 from "../assets/skin/skin_boy_7.webp"
import skin_boy_8 from "../assets/skin/skin_boy_8.webp"
import skin_boy_9 from "../assets/skin/skin_boy_9.webp"

import skin_noname_gjqt_bailitusu from "../assets/skin/gjqt_bailitusu.webp"
import skin_noname_gjqt_yinqianshang from "../assets/skin/gjqt_yinqianshang.webp"
import skin_noname_gw_luobo from "../assets/skin/gw_luobo.webp"
import skin_noname_key_haruko from "../assets/skin/key_haruko.webp"
import skin_noname_key_hinata from "../assets/skin/key_hinata.webp"
import skin_noname_key_kotori from "../assets/skin/key_kotori.webp"
import skin_noname_key_yui from "../assets/skin/key_yui.webp"
import skin_noname_pal_linyueru from "../assets/skin/pal_linyueru.webp"
import skin_noname_pal_lixiaoyao from "../assets/skin/pal_lixiaoyao.webp"
import skin_noname_pal_wangxiaohu from "../assets/skin/pal_wangxiaohu.webp"
import skin_noname_yxs_wangzhaojun from "../assets/skin/yxs_wangzhaojun.webp"
import skin_noname_yxs_wuzetian from "../assets/skin/yxs_wuzetian.webp"

import skin_ry_diaochan from "../assets/skin/ry_diaochan.webp"
import skin_ry_luna from "../assets/skin/ry_luna.webp"
import skin_ry_sunwukong from "../assets/skin/ry_sunwukong.webp"
import skin_ry_zhaoyun from "../assets/skin/ry_zhaoyun.webp"
// skin dong
import skin_dong_caiwenji_jinxiudaimei from "../assets/skin/dong_caiwenji_jinxiudaimei.webp"
import skin_dong_jiangwei_fenghuoluanshi from "../assets/skin/dong_jiangwei_fenghuoluanshi.webp"
import skin_dong_liubei_liuxingyaodi from "../assets/skin/dong_liubei_liuxingyaodi.webp"
import skin_dong_machao_xunitiantuan from "../assets/skin/dong_machao_xunitiantuan.webp"
import skin_dong_pangde_guoganshanzhan from "../assets/skin/dong_pangde_guoganshanzhan.webp"
import skin_dong_shenlvmeng_baiyidujiang from "../assets/skin/dong_shenlvmeng_baiyidujiang.webp"
import skin_dong_shenzhouyu_honglianyehuo from "../assets/skin/dong_shenzhouyu_honglianyehuo.webp"
import skin_dong_sunshangxiang_huahaoyueyuan from "../assets/skin/dong_sunshangxiang_huahaoyueyuan.webp"
import skin_dong_zhenji_duanruiluoshui from "../assets/skin/dong_zhenji_duanruiluoshui.webp"

// audio
import soundMaleLiangpai from '../assets/music/male/shelie1.mp3';
import soundFemaleLiangpai from '../assets/music/female/biyue1.mp3';
import soundMaleShuaicuo from '../assets/music/male/fankui2.mp3';
import soundFemaleShuaicuo from '../assets/music/female/guose2.mp3';
import soundMaleDiaozhu from '../assets/music/male/zhu_junlve.mp3';
import soundFemaleDiaozhu from '../assets/music/female/lijian2.mp3';
import soundMaleSha from '../assets/music/male/sha.mp3';
import soundFemaleSha from '../assets/music/female/sha.mp3';
import soundMaleShafire from '../assets/music/male/sha_fire.mp3';
import soundFemaleShafire from '../assets/music/female/sha_fire.mp3';
import soundMaleShathunder from '../assets/music/male/sha_thunder.mp3';
import soundFemaleShathunder from '../assets/music/female/sha_thunder.mp3';

import recoverhp from '../assets/music/recover.mp3';
import draw from '../assets/music/draw.mp3';
import drawx from '../assets/music/drawx.mp3';
import equip1 from '../assets/music/equip1.mp3';
import equip2 from '../assets/music/equip2.mp3';
import tie from '../assets/music/tie.mp3';
import win from '../assets/music/win.mp3';
import clickwa from '../assets/music/click.wav';

import walkerjson from '../assets/animations/walker.json';
import walkerpng from '../assets/animations/walker.png';
import sf2ryujson from '../assets/animations/sf2ryu.json';
import sf2ryupng from '../assets/animations/sf2ryu.png';
import settingsForm from '../assets/text/settings_form.htm';
import emojiForm from '../assets/text/emoji_form.htm';
import cutCardsForm from '../assets/text/cutcards_form.htm';
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
import emMovingTractor from "../assets/sprites/movingtractor.png"

// collectstar
import cssky from "../assets/collectstar/sky.png"
import csground from "../assets/collectstar/ground.png"
import csground2 from "../assets/collectstar/ground2.png"
import csstar from "../assets/collectstar/star.png"
import csbomb from "../assets/collectstar/bomb.png"
import csdude from "../assets/collectstar/dude.png"

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
import { ReplayEntity } from "./replay_entity";
import { IDBHelper } from "./idb_helper";
import { SGCSPlayer } from "./sg_cs_player";
import { SGCSState } from "./sg_cs_state";
import { EnterHallInfo } from "./enter_hall_info";

const cookies = new Cookies();
const SET_PLAYER_NAME_REQUEST = "set_player_name"
const PLAYER_ENTER_HALL_REQUEST = "PlayerEnterHall"
const JOIN_ROOM_REQUEST = "join_room"
const PREPARE_REQUEST = "prepare"

const ROOM_LIST_RESPONSE = "room_list"
const EXISTS_PLAYERS_RESPONSE = "exists_players"
const DEAL_POKER_RESPONSE = "deal_poker"
const NotifyGameHall_RESPONSE = "NotifyGameHall"
const NotifyOnlinePlayerList_RESPONSE = "NotifyOnlinePlayerList";
const NotifyDaojuInfo_RESPONSE = "NotifyDaojuInfo";
const NotifyGameRoomPlayerList_RESPONSE = "NotifyGameRoomPlayerList";
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
const CutCardShoeCards_RESPONSE = "CutCardShoeCards"
const NotifyReplayState_RESPONSE = "NotifyReplayState"
const NotifyPing_RESPONSE = "NotifyPing"
const NotifySgcsPlayerUpdated_RESPONSE = "NotifySgcsPlayerUpdated"
const NotifyCreateCollectStar_RESPONSE = "NotifyCreateCollectStar"
const NotifyEndCollectStar_RESPONSE = "NotifyEndCollectStar"
const NotifyGrabStar_RESPONSE = "NotifyGrabStar"
const NotifyUpdateGobang_RESPONSE = "NotifyUpdateGobang"

const dummyValue = "dummyValue"
const IPPort = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):(6553[0-5]|655[0-2][0-9]|65[0-4][0-9][0-9]|6[0-4][0-9][0-9][0-9][0-9]|[1-5](\d){4}|[1-9](\d){0,3})$/;

interface Player {
    name: string
    prepare: boolean
}

export class GameScene extends Phaser.Scene {
    public isReplayMode: boolean
    public appVersion: string
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
    public overridingLabelAnims: string[]
    public hallPlayerHeader: Phaser.GameObjects.Text
    public hallPlayerNames: Phaser.GameObjects.Text[]
    public btnJoinAudio: Phaser.GameObjects.Text
    public btnQiandao: Phaser.GameObjects.Text
    public joinAudioUrl: string
    public nickNameOverridePass: string
    public playerEmail: string
    public clientMessages: Phaser.GameObjects.Text[]
    public danmuMessages: any[]
    public roomUIControls: { images: any[], texts: Phaser.GameObjects.Text[], imagesChair: Phaser.GameObjects.Image[] }
    public soundPool: any
    public soundMaleLiangpai: Phaser.Sound.BaseSound;
    public soundFemaleLiangpai: Phaser.Sound.BaseSound;
    public soundMaleShuaicuo: Phaser.Sound.BaseSound;
    public soundFemaleShuaicuo: Phaser.Sound.BaseSound;

    public soundRecoverhp: Phaser.Sound.BaseSound;
    public sounddraw: Phaser.Sound.BaseSound;
    public sounddrawx: Phaser.Sound.BaseSound;
    public soundPlayersShowCard: any[];
    public soundtie: Phaser.Sound.BaseSound;
    public soundclickwa: Phaser.Sound.BaseSound;
    public soundwin: Phaser.Sound.BaseSound;
    public soundVolume: number
    public noDanmu: string
    public noCutCards: string
    public yesDragSelect: string
    public yesFirstPersonView: string
    public qiangliangMin: string
    public skinInUse: string;
    public decadeUICanvas: HTMLElement
    public coordinates: Coordinates
    public wsprotocal: string = "wss"

    constructor(hostName, playerName, nickNameOverridePass, playerEmail: string) {
        super("GameScene")
        this.isReplayMode = false;
        this.appVersion = packageJson.version
        this.hostName = hostName.trim()
        this.hostNameOriginal = this.hostName
        this.playerName = playerName.trim()
        if (this.playerName && CommonMethods.IsNumber(this.playerName)) {
            document.body.innerHTML = `<div>!!! 昵称不能以数字开头结尾：${this.playerName}</div>`
            this.hostName = "";
            return;
        }
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
        this.overridingLabelAnims = [];
        this.hallPlayerNames = [];
        this.clientMessages = [];
        this.danmuMessages = [];
        this.roomUIControls = { images: [], texts: [], imagesChair: [] };
        this.soundVolume = cookies.get("soundVolume");
        if (this.soundVolume === undefined) this.soundVolume = 0.5
        this.noDanmu = cookies.get("noDanmu");
        if (this.noDanmu === undefined) this.noDanmu = 'false'
        this.noCutCards = cookies.get("noCutCards");
        if (this.noCutCards === undefined) this.noCutCards = 'false'
        this.yesDragSelect = cookies.get("yesDragSelect");
        if (this.yesDragSelect === undefined) this.yesDragSelect = 'false'
        this.yesFirstPersonView = cookies.get("yesFirstPersonView");
        if (this.yesFirstPersonView === undefined) this.yesFirstPersonView = 'false'
        this.qiangliangMin = cookies.get("qiangliangMin");
        if (this.qiangliangMin === undefined) this.qiangliangMin = '5'

        let isIPPort = IPPort.test(this.hostName);
        if (isIPPort) {
            this.wsprotocal = "ws";
        } else {
            if (!(/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)$)/gi.test(this.hostName)) && !this.processAuth()) {
                document.body.innerHTML = `<div>!!! 解析服务器地址失败，请确认输入信息无误：${this.hostNameOriginal}</div>`
                this.hostName = "";
                return;
            }
            this.resolveUrl()
        }
        this.joinAudioUrl = cookies.get("joinAudioUrl") ? cookies.get("joinAudioUrl") : "";
        IDBHelper.maxReplays = cookies.get("maxReplays") ? parseInt(cookies.get("maxReplays")) : IDBHelper.maxReplays;
        this.nickNameOverridePass = nickNameOverridePass;
        this.playerEmail = playerEmail;

        this.coordinates = new Coordinates(this.isReplayMode);

        this.soundPool = {};
    }

    preload() {
        if (!this.hostName) return;
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x999999, 0.7);
        this.progressBox.fillRect(
            this.coordinates.centerXReal - this.coordinates.progressBarWidth / 2, this.coordinates.centerY - this.coordinates.progressBarHeight / 2, this.coordinates.progressBarWidth, this.coordinates.progressBarHeight);

        this.loadingText = this.make.text({
            x: this.coordinates.centerXReal,
            y: this.coordinates.centerY - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5);

        this.percentText = this.make.text({
            x: this.coordinates.centerXReal,
            y: this.coordinates.centerY,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5);

        this.assetText = this.make.text({
            x: this.coordinates.centerXReal,
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
                this.coordinates.centerXReal - this.coordinates.progressBarWidth / 2, this.coordinates.centerY - this.coordinates.progressBarHeight / 2, this.coordinates.progressBarWidth * value, this.coordinates.progressBarHeight);
            this.percentText.setText(parseInt(value * 100) + '%');
        }, this);

        this.load.on('load', function (file) {
            this.assetText.setText('Loaded asset: ' + file.key);
        }, this);

        this.load.image("bg2", bgimage)
        this.load.image("beginGame", beginGame)
        this.load.image("prepareOk", prepareOk)
        this.load.image("pokerTable", pokerTable)
        this.load.image("pokerChair", pokerChair)
        this.load.image("bagua", bagua)
        this.load.image("skin_girl_mask", skin_girl_mask)
        this.load.image("skin_girl_moyu", skin_girl_moyu)
        this.load.image("skin_girl_1", skin_girl_1)
        this.load.image("skin_girl_2", skin_girl_2)
        this.load.image("skin_girl_3", skin_girl_3)
        this.load.image("skin_girl_4", skin_girl_4)
        this.load.image("skin_girl_5", skin_girl_5)
        this.load.image("skin_girl_6", skin_girl_6)
        this.load.image("skin_girl_7", skin_girl_7)
        this.load.image("skin_girl_8", skin_girl_8)
        this.load.image("skin_girl_9", skin_girl_9)
        this.load.image("skin_boy_mask", skin_boy_mask)
        this.load.image("skin_boy_moyu", skin_boy_moyu)
        this.load.image("skin_boy_1", skin_boy_1)
        this.load.image("skin_boy_2", skin_boy_2)
        this.load.image("skin_boy_3", skin_boy_3)
        this.load.image("skin_boy_4", skin_boy_4)
        this.load.image("skin_boy_5", skin_boy_5)
        this.load.image("skin_boy_6", skin_boy_6)
        this.load.image("skin_boy_7", skin_boy_7)
        this.load.image("skin_boy_8", skin_boy_8)
        this.load.image("skin_boy_9", skin_boy_9)
        this.load.image("skin_noname_gjqt_bailitusu", skin_noname_gjqt_bailitusu)
        this.load.image("skin_noname_gjqt_yinqianshang", skin_noname_gjqt_yinqianshang)
        this.load.image("skin_noname_gw_luobo", skin_noname_gw_luobo)
        this.load.image("skin_noname_key_haruko", skin_noname_key_haruko)
        this.load.image("skin_noname_key_hinata", skin_noname_key_hinata)
        this.load.image("skin_noname_key_kotori", skin_noname_key_kotori)
        this.load.image("skin_noname_key_yui", skin_noname_key_yui)
        this.load.image("skin_noname_pal_linyueru", skin_noname_pal_linyueru)
        this.load.image("skin_noname_pal_lixiaoyao", skin_noname_pal_lixiaoyao)
        this.load.image("skin_noname_pal_wangxiaohu", skin_noname_pal_wangxiaohu)
        this.load.image("skin_noname_yxs_wangzhaojun", skin_noname_yxs_wangzhaojun)
        this.load.image("skin_noname_yxs_wuzetian", skin_noname_yxs_wuzetian)
        this.load.image("skin_questionmark", skin_questionmark)
        this.load.image("skin_basicmale", skin_basicmale)
        this.load.image("skin_basicfemale", skin_basicfemale)
        this.load.image("skin_frame", skin_frame)
        this.load.image("huosha", huosha)
        this.load.image("leisha", leisha)
        this.load.image("pusha", pusha)
        this.load.image("zhugong", zhugong)

        // gobang
        this.load.image("chatPanel", chatPanel)
        this.load.image("chessboard", chessboard)
        this.load.image("gobangStartBtn", gobangStartBtn)
        this.load.image("gobangQuitBtn", gobangQuitBtn)
        this.load.spritesheet('gobangPieceBlackPlain', gobangPieceBlackPlain, { frameWidth: 30, frameHeight: 30 });
        this.load.spritesheet('gobangPieceWhitePlain', gobangPieceWhitePlain, { frameWidth: 30, frameHeight: 30 });
        this.load.spritesheet('gobangPieceBlack', gobangPieceBlack, { frameWidth: 640, frameHeight: 620 });
        this.load.spritesheet('gobangPieceWhite', gobangPieceWhite, { frameWidth: 619, frameHeight: 633 });
        this.load.spritesheet('gobangPieceBlack0', gobangPieceBlack0, { frameWidth: 641, frameHeight: 622 });
        this.load.spritesheet('gobangPieceWhite0', gobangPieceWhite0, { frameWidth: 1068, frameHeight: 1103 });

        this.load.image("skin_ry_diaochan", skin_ry_diaochan)
        this.load.image("skin_ry_luna", skin_ry_luna)
        this.load.image("skin_ry_sunwukong", skin_ry_sunwukong)
        this.load.image("skin_ry_zhaoyun", skin_ry_zhaoyun)
        this.overridingLabelImages = [
            "bagua",
            "zhugong",
            "pusha",
            "huosha",
            "leisha",
        ]
        this.overridingLabelAnims = [
            ["", ""],
            ["", ""],
            ["effect_qinglongyanyuedao", ""],
            ["effect_shoujidonghua", "play3"],
            ["effect_shoujidonghua", "play5"]
        ]
        this.load.spritesheet('poker', pokerImage, {
            frameWidth: this.coordinates.cardWidth,
            frameHeight: this.coordinates.cardHeight
        });
        this.load.spritesheet('suitsImage', suitsImage, {
            frameWidth: this.coordinates.toolbarSize,
            frameHeight: this.coordinates.toolbarSize
        });
        this.load.spritesheet('suitsbarImage', suitsbarImage, {
            frameWidth: this.coordinates.toolbarSize,
            frameHeight: this.coordinates.toolbarSize
        });
        this.load.audio("soundMaleLiangpai", soundMaleLiangpai);
        this.load.audio("soundFemaleLiangpai", soundFemaleLiangpai);
        this.load.audio("soundMaleShuaicuo", soundMaleShuaicuo);
        this.load.audio("soundFemaleShuaicuo", soundFemaleShuaicuo);
        this.load.audio("soundMaleDiaozhu", soundMaleDiaozhu);
        this.load.audio("soundFemaleDiaozhu", soundFemaleDiaozhu);
        this.load.audio("soundMaleSha", soundMaleSha);
        this.load.audio("soundFemaleSha", soundFemaleSha);
        this.load.audio("soundMaleShafire", soundMaleShafire);
        this.load.audio("soundFemaleShafire", soundFemaleShafire);
        this.load.audio("soundMaleShathunder", soundMaleShathunder);
        this.load.audio("soundFemaleShathunder", soundFemaleShathunder);

        this.load.audio("draw", draw);
        this.load.audio("drawx", drawx);
        this.load.audio("equip1", equip1);
        this.load.audio("equip2", equip2);
        this.load.audio("tie", tie);
        this.load.audio("win", win);
        this.load.audio("recoverhp", recoverhp);
        this.load.html('settingsForm', settingsForm);
        this.load.html('emojiForm', emojiForm);
        this.load.html('cutCardsForm', cutCardsForm);
        this.load.audio("clickwa", clickwa);

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
        this.load.spritesheet('emMovingTractor', emMovingTractor, { frameWidth: EmojiUtil.emMovingTractorFrameSize.x, frameHeight: EmojiUtil.emMovingTractorFrameSize.y });

        // animated skin
        this.load.spritesheet('skin_dong_caiwenji_jinxiudaimei', skin_dong_caiwenji_jinxiudaimei, { frameWidth: 360, frameHeight: 255 });
        this.load.spritesheet('skin_dong_jiangwei_fenghuoluanshi', skin_dong_jiangwei_fenghuoluanshi, { frameWidth: 176, frameHeight: 232 });
        this.load.spritesheet('skin_dong_liubei_liuxingyaodi', skin_dong_liubei_liuxingyaodi, { frameWidth: 287, frameHeight: 381 });
        this.load.spritesheet('skin_dong_machao_xunitiantuan', skin_dong_machao_xunitiantuan, { frameWidth: 438, frameHeight: 316 });
        this.load.spritesheet('skin_dong_pangde_guoganshanzhan', skin_dong_pangde_guoganshanzhan, { frameWidth: 260, frameHeight: 184 });
        this.load.spritesheet('skin_dong_shenlvmeng_baiyidujiang', skin_dong_shenlvmeng_baiyidujiang, { frameWidth: 175, frameHeight: 232 });
        this.load.spritesheet('skin_dong_shenzhouyu_honglianyehuo', skin_dong_shenzhouyu_honglianyehuo, { frameWidth: 136, frameHeight: 160 });
        this.load.spritesheet('skin_dong_sunshangxiang_huahaoyueyuan', skin_dong_sunshangxiang_huahaoyueyuan, { frameWidth: 175, frameHeight: 232 });
        this.load.spritesheet('skin_dong_zhenji_duanruiluoshui', skin_dong_zhenji_duanruiluoshui, { frameWidth: 360, frameHeight: 255 });

        // loading collectstar
        this.load.image('ground', csground);
        this.load.image('ground2', csground2);
        this.load.image('sky', cssky);
        this.load.image('star', csstar);
        this.load.image('bomb', csbomb);
        this.load.spritesheet('dude', csdude, { frameWidth: 34, frameHeight: 50 });

        // loading spine
        window.publicPath = process.env.PUBLIC_URL;
        if (!window.publicPath) window.publicPath = "."
        this.load.script('spinejs', window.publicPath + '/assets/js/spine.js');
    }

    create() {
        if (!this.hostName) return;
        // because loading animation.js is dependent on spine.js, hence defer loading animation.js here
        // The typical flow for a Phaser Scene is that you load assets in the Scene's preload method 
        // and then when the Scene's create method is called you are guaranteed that all of those assets are ready for use and have been loaded.
        this.load.script('animationjs', window.publicPath + '/assets/js/animation.js');
        this.load.start();
        this.load.on('complete', () => {
            this.progressBar.destroy();
            this.progressBox.destroy();
            this.loadingText.destroy();
            this.percentText.destroy();
            this.assetText.destroy();

            this.add.image(0, 0, 'bg2')
                .setDepth(-100)
                .setOrigin(0)
                .setDisplaySize(this.coordinates.screenWidReal, this.coordinates.screenHei);
            try {
                this.websocket = new WebSocket(`${this.wsprotocal}://${this.hostName}`)
                this.websocket.onerror = this.onerror.bind(this)
                this.websocket.onopen = this.onopen.bind(this)
                this.websocket.onmessage = this.onmessage.bind(this)
            } catch (e) {
                let errString = e.toString()
                if (errString.toLowerCase().includes(CommonMethods.wsErrorType_Insecure)) {
                    document.body.innerHTML = `<div>检测到您的浏览器尚未设置，请参照<a href="javascript:void(0)" onclick="javascript:{window.open('https://bit.ly/chromstep')}">此图解</a>先进行相应设置</div>`
                } else {
                    document.body.innerHTML = `<div>!!! 尝试链接服务器出错，请确认输入信息无误：${this.hostNameOriginal}</div>`
                    console.log(e);
                }
            }
        })
    }
    onerror(e) {
        document.body.innerHTML = `<div>!!! 尝试链接服务器失败，请确认输入信息无误：${this.hostNameOriginal}</div>`
        console.error(JSON.stringify(e));
    }
    onopen() {
        // try {
        console.log("连接成功")
        cookies.set('showNotice', 'none', { path: '/', expires: CommonMethods.GetCookieExpires() });

        // empty password means recover password or playerName
        if (!this.nickNameOverridePass) {
            this.nickNameOverridePass = CommonMethods.recoverLoginPassFlag;
            if (!this.playerName) {
                this.playerName = "";
            }
        }
        let enterHallInfo: EnterHallInfo = new EnterHallInfo(this.nickNameOverridePass, this.playerEmail, CommonMethods.PLAYER_CLIENT_TYPE_shengjiweb);
        this.sendMessageToServer(PLAYER_ENTER_HALL_REQUEST, this.playerName, JSON.stringify(enterHallInfo));
        this.mainForm = new MainForm(this);
        this.mainForm.loadEmojiForm();

        this.loadAudioFiles();
        this.input.mouse.disableContextMenu();
        CommonMethods.BuildCardNumMap()
        EmojiUtil.CreateAllAnimations(this);
        IDBHelper.InitIDB();

        // } catch (e) {
        //     // alert("error")
        //     document.body.innerHTML = `<div>!!! onopen Error: ${e}</div>`
        // }

        // configure sgs spine decadeUICanvas
        if (spine2D === undefined) {
            var c = window.confirm("动画资源加载失败，请刷新页面重新加载");
            if (c == true) {
                window.location.reload()
                return
            }
        } else {
            this.decadeUICanvas = document.getElementById("decadeUI-canvas");
            this.decadeUICanvas.style.width = `${this.coordinates.sgsAnimWidth}px`
            this.decadeUICanvas.style.height = `${this.coordinates.sgsAnimHeight}px`
            this.decadeUICanvas.style.position = "absolute";
            this.decadeUICanvas.style.left = "0px";
            this.decadeUICanvas.style.top = "0px";
        }
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

        switch (messageType) {
            case NotifyGameHall_RESPONSE:
                this.handleNotifyGameHall(objList);
                break;
            case NotifyOnlinePlayerList_RESPONSE:
                this.handleNotifyOnlinePlayerList(playerID, objList);
                break;
            case NotifyGameRoomPlayerList_RESPONSE:
                this.handleNotifyGameRoomPlayerList(playerID, objList);
                break;
            case NotifyMessage_RESPONSE:
                this.handleNotifyMessage(objList);
                break;
            case NotifyRoomSetting_RESPONSE:
                this.handleNotifyRoomSetting(objList);
                break;
            case NotifyGameState_RESPONSE:
                this.handleNotifyGameState(objList);
                break;
            case NotifyCurrentHandState_RESPONSE:
                this.handleNotifyCurrentHandState(objList);
                break;
            case NotifyCurrentTrickState_RESPONSE:
                this.handleNotifyCurrentTrickState(objList);
                break;
            case GetDistributedCard_RESPONSE:
                this.handleGetDistributedCard(objList);
                break;
            case NotifyCardsReady_RESPONSE:
                this.handleNotifyCardsReady(objList);
                break;
            case NotifyDumpingValidationResult_RESPONSE:
                this.handleNotifyDumpingValidationResult(objList);
                break;
            case NotifyTryToDumpResult_RESPONSE:
                this.handleNotifyTryToDumpResult(objList);
                break;
            case NotifyStartTimer_RESPONSE:
                this.handleNotifyStartTimer(objList);
                break;
            case NotifyEmoji_RESPONSE:
                this.handleNotifyEmoji(objList);
                break;
            case CutCardShoeCards_RESPONSE:
                this.handleCutCardShoeCards();
                break;
            case NotifyReplayState_RESPONSE:
                this.handleNotifyReplayState(objList);
                break;
            case NotifyPing_RESPONSE:
                this.handleNotifyPing_RESPONSE();
                break;
            case NotifySgcsPlayerUpdated_RESPONSE:
                this.handleNotifySgcsPlayerUpdated_RESPONSE(objList);
                break;
            case NotifyCreateCollectStar_RESPONSE:
                this.handleNotifyCreateCollectStar_RESPONSE(objList);
                break;
            case NotifyEndCollectStar_RESPONSE:
                this.handleNotifyEndCollectStar(objList);
                break;
            case NotifyGrabStar_RESPONSE:
                this.handleNotifyGrabStar_RESPONSE(objList);
                break;
            case NotifyDaojuInfo_RESPONSE:
                this.handleNotifyDaojuInfo(objList);
                break;
            case NotifyUpdateGobang_RESPONSE:
                this.handleNotifyUpdateGobang_RESPONSE(objList);
                break;
            default:
                break;
        }
        // } catch (e) {
        //     // alert("error")
        //     document.body.innerHTML = `<div>!!! onmessage Error: ${e}</div>`
        // }
    }

    private handleNotifyUpdateGobang_RESPONSE(objList) {
        var result: SGGBState = objList[0];
        this.mainForm.sgDrawingHelper.NotifyUpdateGobang(result);
    }

    private handleNotifyDaojuInfo(objList: []) {
        var daojuInfo: any = objList[0];
        var updateQiandao: boolean = objList[1];
        var updateSkin: boolean = objList[2];
        this.mainForm.tractorPlayer.NotifyDaojuInfo(daojuInfo, updateQiandao, updateSkin);
    }

    private handleNotifyGrabStar_RESPONSE(objList) {
        let playerIndex: number = objList[0];
        let starIndex: number = objList[1];
        this.mainForm.sgDrawingHelper.NotifyGrabStar(playerIndex, starIndex);
    }

    private handleNotifyCreateCollectStar_RESPONSE(objList) {
        var result: SGCSState = objList[0];
        this.mainForm.sgDrawingHelper.NotifyCreateCollectStar(result);
    }

    private handleNotifyEndCollectStar(objList) {
        var result: SGCSState = objList[0];
        this.mainForm.sgDrawingHelper.NotifyEndCollectStar(result);
    }

    private handleNotifySgcsPlayerUpdated_RESPONSE(objList) {
        var result: SGCSPlayer = JSON.parse(objList[0])
        this.mainForm.sgDrawingHelper.NotifySgcsPlayerUpdated(result);
    }

    private handleNotifyPing_RESPONSE() {
        this.mainForm.tractorPlayer.NotifyPing()
    }

    private handleNotifyReplayState(objList: []) {
        var result: ReplayEntity = objList[0];
        this.mainForm.tractorPlayer.NotifyReplayState(result)
    }

    private handleCutCardShoeCards() {
        this.mainForm.tractorPlayer.CutCardShoeCards()
    }

    private handleNotifyEmoji(objList: []) {
        this.mainForm.tractorPlayer.NotifyEmoji(...objList)
    }

    private handleNotifyStartTimer(objList: []) {
        var result: number = objList[0];
        var playerID: string = objList[1];
        this.mainForm.tractorPlayer.NotifyStartTimer(result, playerID);
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

    private handleNotifyOnlinePlayerList(playerID: string, objList: []) {
        var isJoining: boolean = objList[0];
        this.mainForm.tractorPlayer.NotifyOnlinePlayerList(playerID, isJoining)
    }

    private handleNotifyGameRoomPlayerList(playerID: string, objList: []) {
        var isJoining: boolean = objList[0];
        var roomName: string = objList[1];
        this.mainForm.tractorPlayer.NotifyGameRoomPlayerList(playerID, isJoining, roomName)
    }

    private handleNotifyMessage(objList: []) {
        var msgs = objList[0];
        this.mainForm.tractorPlayer.NotifyMessage(msgs)
    }

    private handleNotifyRoomSetting(objList: []) {
        var roomSetting: RoomSetting = objList[0];
        var showMessage: boolean = objList[1];
        this.mainForm.tractorPlayer.NotifyRoomSetting(roomSetting, showMessage)
    }

    private handleNotifyGameState(objList: []) {
        var gameState: GameState = objList[0];
        var notifyType: string = objList[1];
        this.mainForm.tractorPlayer.NotifyGameState(gameState, notifyType)
    }

    private handleNotifyCurrentHandState(objList: []) {
        var currentHandState: CurrentHandState = objList[0];
        var notifyType: string = objList[1];
        this.mainForm.tractorPlayer.NotifyCurrentHandState(currentHandState, notifyType)
    }

    private handleNotifyCurrentTrickState(objList: []) {
        var currentTrickState: CurrentTrickState = objList[0];
        var notifyType: string = objList[1];
        this.mainForm.tractorPlayer.NotifyCurrentTrickState(currentTrickState, notifyType)
    }

    private processAuth(): boolean {
        try {
            var CryptoJS = require("crypto-js");
            var bytes = CryptoJS.AES.decrypt(this.hostName, dummyValue);
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            if (bytes && bytes.sigBytes > 0 && originalText) {
                this.hostName = originalText
                return true;
            }
        } catch { }
        return false;
    }

    private resolveUrl(): boolean {
        try {
            let urlParts = this.hostName.split(":");
            let urlPart1 = "";
            for (let i = 0; i < urlParts[0].length; i++) {
                let ascii = urlParts[0].charCodeAt(i);
                let char = String.fromCharCode(ascii);
                urlPart1 += char;
            }
            this.hostName = `${urlPart1}:${urlParts[1]}`;
            return true;
        } catch (ex) {
            console.log("===")
            console.log(ex)
        }
        return false;
    }

    public loadAudioFiles() {
        this.mainForm.enableSound = this.soundVolume > 0
        this.soundMaleLiangpai = this.sound.add("soundMaleLiangpai", { volume: this.soundVolume });
        this.soundFemaleLiangpai = this.sound.add("soundFemaleLiangpai", { volume: this.soundVolume });
        this.soundMaleShuaicuo = this.sound.add("soundMaleShuaicuo", { volume: this.soundVolume });
        this.soundFemaleShuaicuo = this.sound.add("soundFemaleShuaicuo", { volume: this.soundVolume });

        let tempequip1 = this.sound.add("equip1", { volume: this.soundVolume });
        let tempequip2 = this.sound.add("equip2", { volume: this.soundVolume });
        let tempmalediaozhu = this.sound.add("soundMaleDiaozhu", { volume: this.soundVolume });
        let tempfemalediaozhu = this.sound.add("soundFemaleDiaozhu", { volume: this.soundVolume });
        let tempmalesha = this.sound.add("soundMaleSha", { volume: this.soundVolume });
        let tempfemalediaosha = this.sound.add("soundFemaleSha", { volume: this.soundVolume });
        let tempmaleshafire = this.sound.add("soundMaleShafire", { volume: this.soundVolume });
        let tempfemaleshafire = this.sound.add("soundFemaleShafire", { volume: this.soundVolume });
        let tempmaleshathunder = this.sound.add("soundMaleShathunder", { volume: this.soundVolume });
        let tempfemaleshathunder = this.sound.add("soundFemaleShathunder", { volume: this.soundVolume });
        this.soundPlayersShowCard = [
            { "m": tempequip1, "f": tempequip1 },
            { "m": tempequip2, "f": tempequip2 },
            { "m": tempmalediaozhu, "f": tempfemalediaozhu },
            { "m": tempmalesha, "f": tempfemalediaosha },
            { "m": tempmaleshafire, "f": tempfemaleshafire },
            { "m": tempmaleshathunder, "f": tempfemaleshathunder },
        ];

        this.soundPool[CommonMethods.audioLiangpai] = { "m": this.soundMaleLiangpai, "f": this.soundFemaleLiangpai };
        this.soundPool[CommonMethods.audioShuaicuo] = { "m": this.soundMaleShuaicuo, "f": this.soundFemaleShuaicuo };
        this.soundPool[CommonMethods.audioDiaozhu] = { "m": this.soundMaleDiaozhu, "f": this.soundFemaleDiaozhu };
        this.soundPool[CommonMethods.audioSha] = { "m": this.soundMaleSha, "f": this.soundFemaleSha };
        this.soundPool[CommonMethods.audioShafire] = { "m": this.soundMaleShafire, "f": this.soundFemaleShafire };
        this.soundPool[CommonMethods.audioShathunder] = { "m": this.soundMaleShathunder, "f": this.soundFemaleShathunder };

        this.soundRecoverhp = this.sound.add("recoverhp", { volume: this.soundVolume });
        this.sounddraw = this.sound.add("draw", { volume: this.soundVolume });
        this.sounddrawx = this.sound.add("drawx", { volume: this.soundVolume });
        this.soundtie = this.sound.add("tie", { volume: this.soundVolume });
        this.soundwin = this.sound.add("win", { volume: this.soundVolume });
        this.soundclickwa = this.sound.add("clickwa", { volume: this.soundVolume });
    }

    public saveSettings() {
        cookies.set('soundVolume', this.soundVolume, { path: '/', expires: CommonMethods.GetCookieExpires() });
        cookies.set('noDanmu', this.noDanmu, { path: '/', expires: CommonMethods.GetCookieExpires() });
        cookies.set('noCutCards', this.noCutCards, { path: '/', expires: CommonMethods.GetCookieExpires() });
        cookies.set('yesDragSelect', this.yesDragSelect, { path: '/', expires: CommonMethods.GetCookieExpires() });
        cookies.set('yesFirstPersonView', this.yesFirstPersonView, { path: '/', expires: CommonMethods.GetCookieExpires() });
        cookies.set('qiangliangMin', this.qiangliangMin, { path: '/', expires: CommonMethods.GetCookieExpires() });

        if (this.joinAudioUrl && !this.joinAudioUrl.match(/^https?:\/\//i)) {
            this.joinAudioUrl = 'http://' + this.joinAudioUrl;
        }
        cookies.set('joinAudioUrl', this.joinAudioUrl, { path: '/', expires: CommonMethods.GetCookieExpires() });
        cookies.set('maxReplays', IDBHelper.maxReplays, { path: '/', expires: CommonMethods.GetCookieExpires() });
    }

    // [flag, pass, email]
    public savePlayerLoginInfo(loginInfo: string[]) {
        this.nickNameOverridePass = loginInfo[1];
        cookies.set('NickNameOverridePass', loginInfo[1], { path: '/', expires: CommonMethods.GetCookieExpires() });
        cookies.set('playerEmail', loginInfo[2], { path: '/', expires: CommonMethods.GetCookieExpires() });
    }

    public sendMessageToServer(messageType: string, playerID: string, content: string) {
        this.websocket.send(JSON.stringify({
            "messageType": messageType, "playerID": playerID, "content": content
        }))
    }

    public isInGameHall() {
        return this.hallPlayerHeader && this.hallPlayerHeader.visible
    }

    public isInGameRoom() {
        return this.mainForm.roomNameText && this.mainForm.roomNameText.visible
    }

    public drawSgsAni(effectName: string, effectNature: string, wid: number, hei: number) {
        if (!window.spine) {
            console.error('spine 未定义.');
            return;
        }
        skillAnimate(effectName, effectNature, wid, hei)
    }

    public playAudio(audioName: string | number, sex: string) {
        if (typeof audioName === "string") {
            this.soundPool[audioName][sex].play();
        } else {
            this.soundPlayersShowCard[audioName][sex].play();
        }
    }
}

