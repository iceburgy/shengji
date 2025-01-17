import { CommonMethods } from "./common_methods";

const chatWidth = 240;
const screenWidthReal = document.documentElement.clientWidth;
const screenWidth = screenWidthReal - chatWidth;
const screenHeight = document.documentElement.clientHeight;

export class Coordinates {
    public isReplayMode = false;
    // 屏幕左上角为坐标原点 (0, 0), 横轴为 x, 纵轴为 y
    // 右边无法显示的区域
    public screenWidReal
    public screenWid
    public screenHei
    public centerXReal
    public centerX
    public centerY
    public hiddenWidth
    public chatWid
    public chatHeightRatio

    // progress bar
    public progressBarWidth
    public progressBarHeight

    // hall controls
    public hallPlayerHeaderPosition
    public hallPlayerTopPosition

    public pokerTablePositionStart
    public pokerTableOffsets
    public pokerTableLabelOffsets

    public pokerChairOffsets

    // danmu
    public danmuPositionY
    public danmuOffset

    // room controls
    public clientMessagePosition
    public lineOffsetY

    public cardWidth
    public cardHeight
    public handCardOffset
    public suitSequenceSize
    public overridingFlagHeight
    public overridingFlagWidth

    public btnLowerSize
    public btnExitRoomPosition
    public btnExitAndObservePosition
    public btnSmallGamesPosition
    public btnShowLastTrickPosition
    public btnReadyPosition
    public btnRobotPosition
    public btnFirstPersonView
    public btnFirstTrickPosition

    public controlButtonOffset

    // players
    public playerMainTextPositions
    public playerTextPositions
    public playerSkinPositions
    public observerTextPositions
    public player1TextWid
    public player1TextWidBigDelta
    public regexNonEnglishChar = /[^\u0000-\u007F]/g

    public playerStarterPositions
    public player1StarterWid

    public emojiSize
    public playerEmojiPositions
    public sgsAnimWidth
    public sgsAnimHeight
    public sgsAnimOffsetY

    // cards
    public showedCardsPositions
    public trumpMadeCardsPositions
    public trumpMadeCardsScale

    // last8cards
    public last8CardsForStarterPosition

    // replay
    // account for maximum of five suites, with 4 gaps, shift to left by 2 gaps
    public replayControlButtonWidth
    public replayHandCardScale
    public handCardPositions
    public toolbarSize
    public toolbarPosition
    public btnPigPosition

    // sidebar for room info and game state
    public iconSize
    public sidebarOffset
    public roomNameTextPosition
    public roomOwnerTextPosition
    public sidebarMyTeamPostion
    public sidebarOpTeamPostion
    public sidebarTrumpMaker
    public sidebarScoreText
    public sidebarScoreCards

    // sidebar for replay
    public replayBarPosition

    // ending UI
    public last8Position
    public scoreCardsPosition
    public winPointsPosition
    public last8PointsPosition
    public punishmentPointsPosition
    public totalPointsPosition

    public countDownPosition
    public countDownSzie

    // distributing last 8
    public distributingLast8MaxEdge
    public distributingLast8Position

    constructor(isrpm: boolean) {
        this.isReplayMode = isrpm;
        // 屏幕左上角为坐标原点 (0, 0), 横轴为 x, 纵轴为 y
        // 右边无法显示的区域
        this.screenWidReal = screenWidthReal
        this.screenWid = this.isReplayMode ? this.screenWidReal : screenWidth
        this.screenHei = screenHeight
        this.centerXReal = screenWidthReal * 0.5
        this.centerX = this.screenWid * 0.5
        this.centerY = screenHeight * 0.5
        this.hiddenWidth = 20
        this.chatWid = chatWidth
        this.chatHeightRatio = 0.7;

        // progress bar
        this.progressBarWidth = 300
        this.progressBarHeight = 30

        // hall controls
        this.hallPlayerHeaderPosition = { x: 50, y: 160 }
        this.hallPlayerTopPosition = { x: 50, y: 240 }

        this.pokerTablePositionStart = { x: 320, y: 160 }
        this.pokerTableOffsets = { x: 400, y: 320 }
        this.pokerTableLabelOffsets = { x: 40, y: 20 }

        this.pokerChairOffsets = [
            { x: 40, y: -80 },
            { x: -80, y: 40 },
            { x: 40, y: 120 },
            { x: 160, y: 40 },
        ]

        // danmu
        this.danmuPositionY = 50
        this.danmuOffset = 40

        // room controls
        this.controlButtonOffset = 10

        this.clientMessagePosition = { x: this.centerX - 200, y: this.centerY }
        this.lineOffsetY = 40

        this.cardWidth = 90
        this.cardHeight = 120
        this.handCardOffset = 24
        this.suitSequenceSize = 15
        this.overridingFlagHeight = 40
        this.overridingFlagWidth = this.overridingFlagHeight * 3 / 2

        this.btnLowerSize = 90
        this.btnExitRoomPosition = { x: 10, y: screenHeight - 60 }
        this.btnExitAndObservePosition = { x: this.btnExitRoomPosition.x + this.btnLowerSize, y: this.btnExitRoomPosition.y }
        this.btnSmallGamesPosition = { x: this.btnExitAndObservePosition.x + this.btnLowerSize, y: this.btnExitRoomPosition.y }
        this.btnShowLastTrickPosition = { x: this.screenWid - 90, y: this.btnExitRoomPosition.y }
        this.btnReadyPosition = { x: this.btnShowLastTrickPosition.x - this.btnLowerSize, y: this.btnShowLastTrickPosition.y }
        this.btnRobotPosition = { x: this.btnShowLastTrickPosition.x - this.btnLowerSize * 2, y: this.btnShowLastTrickPosition.y }
        this.btnFirstPersonView = { x: this.btnExitRoomPosition.x + this.btnLowerSize, y: this.btnExitRoomPosition.y }
        this.btnFirstTrickPosition = { x: this.screenWid - 300, y: this.btnExitRoomPosition.y }

        // players
        this.player1TextWid = 20;
        this.player1TextWidBigDelta = 12;
        this.playerMainTextPositions = [
            { x: this.centerX - this.cardWidth / 2, y: screenHeight - 60 },
            { x: this.screenWid - 20, y: this.centerY - 80 },
            { x: this.centerX - this.cardWidth / 2, y: 10 },
            { x: 5, y: this.centerY - 80 },
        ]
        this.playerTextPositions = [
            { x: this.playerMainTextPositions[0].x, y: this.playerMainTextPositions[0].y },
            { x: this.playerMainTextPositions[1].x, y: this.playerMainTextPositions[1].y + 120 },
            { x: this.playerMainTextPositions[2].x, y: this.playerMainTextPositions[2].y }, // x is dynamically calculated based on skin width
            { x: this.playerMainTextPositions[3].x, y: this.playerMainTextPositions[3].y + 120 },
        ]
        this.playerSkinPositions = [
            { x: screenWidthReal - 120, y: this.screenHei - 70 },
            { x: this.playerMainTextPositions[1].x, y: this.playerMainTextPositions[1].y },
            { x: this.playerMainTextPositions[2].x, y: this.playerMainTextPositions[2].y },
            { x: this.playerMainTextPositions[3].x + 10, y: this.playerMainTextPositions[3].y },
        ]
        this.observerTextPositions = [
            { x: this.playerTextPositions[0].x - this.controlButtonOffset, y: this.playerTextPositions[0].y + 10 },
            { x: this.playerTextPositions[1].x, y: this.playerTextPositions[1].y + 40 },
            { x: this.playerTextPositions[2].x, y: this.playerTextPositions[2].y + 40 }, // x is dynamically calculated based on skin width
            { x: this.playerTextPositions[3].x, y: this.playerTextPositions[3].y + 40 },
        ]

        this.player1StarterWid = 100;
        this.playerStarterPositions = [
            { x: this.playerMainTextPositions[0].x - 205, y: this.playerMainTextPositions[0].y },
            { x: this.playerMainTextPositions[1].x - this.player1StarterWid, y: this.playerMainTextPositions[1].y - 50 },
            { x: this.playerMainTextPositions[2].x - 205, y: this.playerMainTextPositions[2].y },
            { x: this.playerMainTextPositions[3].x, y: this.playerMainTextPositions[3].y - 50 },
        ]

        this.emojiSize = 80;
        this.playerEmojiPositions = [
            { x: this.playerMainTextPositions[0].x - this.emojiSize - 120, y: this.playerStarterPositions[0].y - 30 },
            { x: this.screenWid - this.hiddenWidth - this.emojiSize, y: this.playerTextPositions[1].y + 50 },
            { x: this.playerMainTextPositions[2].x - this.emojiSize - 20, y: this.danmuPositionY + 10 },
            { x: this.playerMainTextPositions[3].x, y: this.playerTextPositions[1].y + 50 },
        ]
        this.sgsAnimWidth = 80;
        this.sgsAnimHeight = 120;
        this.sgsAnimOffsetY = 10;

        // cards
        this.showedCardsPositions = [
            { x: this.centerX - this.cardWidth / 2, y: this.playerMainTextPositions[0].y - 300 },
            { x: this.screenWid - 300, y: this.playerMainTextPositions[1].y },
            { x: this.centerX - this.cardWidth / 2, y: this.playerMainTextPositions[2].y + (CommonMethods.isMobile() ? 100 : 140) },
            { x: this.playerMainTextPositions[3].x + 200, y: this.playerMainTextPositions[3].y },
        ]
        this.trumpMadeCardsScale = 2 / 3
        this.trumpMadeCardsPositions = [
            { x: this.playerMainTextPositions[0].x - this.cardWidth * this.trumpMadeCardsScale - 120, y: screenHeight - this.cardHeight * this.trumpMadeCardsScale - 10 },
            { x: this.screenWid - this.cardWidth * this.trumpMadeCardsScale - 10, y: this.playerStarterPositions[1].y - this.cardHeight * this.trumpMadeCardsScale - 10 },
            { x: this.playerMainTextPositions[2].x - this.cardWidth * this.trumpMadeCardsScale - 120, y: 10 },
            { x: this.playerMainTextPositions[3].x, y: this.playerStarterPositions[3].y - this.cardHeight * this.trumpMadeCardsScale - 10 },
        ]

        // last8cards
        this.last8CardsForStarterPosition = { x: this.screenWid - 10 - this.hiddenWidth, y: 10 }

        // replay
        // account for maximum of five suites, with 4 gaps, shift to left by 2 gaps
        this.replayControlButtonWidth = 60
        this.replayHandCardScale = 0.6
        this.handCardPositions = [
            { x: this.centerX - this.cardWidth / 2 - this.handCardOffset * 2, y: screenHeight - 200 },
            { x: this.last8CardsForStarterPosition.x - this.cardWidth * this.replayHandCardScale, y: this.showedCardsPositions[0].y + this.cardHeight * (1 - this.replayHandCardScale) },
            { x: this.last8CardsForStarterPosition.x - this.cardWidth * this.replayHandCardScale, y: this.showedCardsPositions[2].y + this.cardHeight * (1 - this.replayHandCardScale) },
            { x: 10, y: this.showedCardsPositions[0].y + this.cardHeight * (1 - this.replayHandCardScale) },
        ]
        this.toolbarSize = 50
        this.toolbarPosition = { x: this.screenWid - 360, y: this.handCardPositions[0].y - 100 - 20 }
        this.btnPigPosition = { x: this.screenWid * 0.7, y: this.handCardPositions[0].y - 100 }

        // sidebar for room info and game state
        this.iconSize = 20
        this.sidebarOffset = 30
        this.roomNameTextPosition = { x: 10, y: 10 }
        this.roomOwnerTextPosition = { x: this.roomNameTextPosition.x, y: this.roomNameTextPosition.y + this.sidebarOffset }
        this.sidebarMyTeamPostion = { x: this.roomNameTextPosition.x, y: this.roomNameTextPosition.y + this.sidebarOffset * 2 }
        this.sidebarOpTeamPostion = { x: this.roomNameTextPosition.x, y: this.roomNameTextPosition.y + this.sidebarOffset * 3 }
        this.sidebarTrumpMaker = { x: this.roomNameTextPosition.x, y: this.roomNameTextPosition.y + this.sidebarOffset * 4 }
        this.sidebarScoreText = { x: this.roomNameTextPosition.x, y: this.roomNameTextPosition.y + this.sidebarOffset * 5 }
        this.sidebarScoreCards = { x: this.roomNameTextPosition.x, y: this.roomNameTextPosition.y + this.sidebarOffset * 6 }

        // sidebar for replay
        this.replayBarPosition = { x: this.screenWid * 0.65, y: 10 }

        // ending UI
        this.last8Position = { x: this.centerX - (this.cardWidth / 2) - this.handCardOffset * 3.5, y: (CommonMethods.isMobile() ? 100 : 140) }
        this.scoreCardsPosition = { x: this.last8Position.x, y: this.last8Position.y + this.cardHeight + 30 }
        this.winPointsPosition = { x: this.last8Position.x, y: this.scoreCardsPosition.y + this.cardHeight + 30 }
        this.last8PointsPosition = { x: this.last8Position.x, y: this.winPointsPosition.y + 30 }
        this.punishmentPointsPosition = { x: this.last8Position.x, y: this.last8PointsPosition.y + 30 }
        this.totalPointsPosition = { x: this.last8Position.x, y: this.punishmentPointsPosition.y + 30 }

        this.countDownPosition = { x: this.screenWid * 0.1, y: this.showedCardsPositions[0].y }
        this.countDownSzie = 60

        // distributing last 8
        this.distributingLast8MaxEdge = 30
        this.distributingLast8Position = { x: this.centerX - (this.cardWidth / 2) - this.handCardOffset * 3.5, y: this.centerY - this.cardHeight / 2 }
    }
}
