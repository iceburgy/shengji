import { CommonMethods } from "./common_methods";

const screenWidth = document.documentElement.clientWidth;
const screenHeight = document.documentElement.clientHeight;

export class Coordinates {
    // 屏幕左上角为坐标原点 (0, 0), 横轴为 x, 纵轴为 y
    // 右边无法显示的区域
    static screenWid = screenWidth
    static screenHei = screenHeight
    static hiddenWidth = 20

    // hall controls
    static hallPlayerHeaderPosition = { x: 50, y: 160 }
    static hallPlayerTopPosition = { x: 50, y: 240 }

    static pokerTablePositionStart = { x: 320, y: 160 }
    static pokerTableOffsets = { x: 400, y: 320 }
    static pokerTableLabelOffsets = { x: 40, y: 20 }

    static pokerChairOffsets = [
        { x: 40, y: -80 },
        { x: -80, y: 40 },
        { x: 40, y: 120 },
        { x: 160, y: 40 },
    ]

    // room controls
    static clientMessagePosition = { x: screenWidth * 0.5 - 200, y: screenHeight * 0.5 }
    static lineOffsetY = 40

    static cardWidth = 90
    static cardHeigh = 120
    static handCardOffset = 24
    static suitSequenceSize = 15
    static overridingFlagHeight = 40
    static overridingFlagWidth = Coordinates.overridingFlagHeight * 3 / 2
    // account for maximum of five suites, with 4 gaps, shift to left by 2 gaps
    static handCardPositionCenter = { x: screenWidth * 0.5 - Coordinates.cardWidth / 2 - Coordinates.handCardOffset * 2, y: screenHeight - 200 }
    static toolbarSize = 50
    static toolbarPosition = { x: screenWidth - 360, y: Coordinates.handCardPositionCenter.y - 100 - 20 }
    static btnPigPosition = { x: screenWidth * 0.7, y: Coordinates.handCardPositionCenter.y - 100 }

    static btnLowerSize = 100
    static btnReadyPosition = { x: 10, y: screenHeight - 60 }
    static btnRobotPosition = { x: Coordinates.btnReadyPosition.x + Coordinates.btnLowerSize, y: screenHeight - 60 }
    static btnExitRoomPosition = { x: screenWidth - 110, y: Coordinates.btnReadyPosition.y }
    static btnSendEmojiPosition = { x: Coordinates.btnExitRoomPosition.x - Coordinates.btnLowerSize, y: Coordinates.btnReadyPosition.y }

    // players
    static playerTextPositions = [
        { x: screenWidth * 0.4, y: screenHeight - 60 },
        { x: screenWidth - 320, y: screenHeight * 0.5 },
        { x: screenWidth * 0.4, y: 10 },
        { x: 5, y: screenHeight * 0.5 },
    ]

    static playerStarterPositions = [
        { x: Coordinates.playerTextPositions[0].x - 205, y: Coordinates.playerTextPositions[0].y },
        { x: Coordinates.playerTextPositions[1].x, y: Coordinates.playerTextPositions[1].y - 50 },
        { x: Coordinates.playerTextPositions[2].x - 205, y: Coordinates.playerTextPositions[2].y },
        { x: Coordinates.playerTextPositions[3].x, y: Coordinates.playerTextPositions[3].y - 50 },
    ]

    // cards
    static showedCardsPositions = [
        { x: screenWidth * 0.5 - Coordinates.cardWidth / 2, y: Coordinates.playerTextPositions[0].y - 300 },
        { x: screenWidth - 300, y: Coordinates.playerTextPositions[1].y - 110 },
        { x: screenWidth * 0.5 - Coordinates.cardWidth / 2, y: Coordinates.playerTextPositions[2].y + 100 },
        { x: Coordinates.playerTextPositions[3].x + 200, y: Coordinates.playerTextPositions[3].y - 110 },
    ]

    // sidebar for room info and game state
    static iconSize = 20
    static sidebarOffset = 30
    static roomNameTextPosition = { x: 10, y: 10 }
    static roomOwnerTextPosition = { x: Coordinates.roomNameTextPosition.x, y: Coordinates.roomNameTextPosition.y + Coordinates.sidebarOffset }
    static sidebarMyTeamPostion = { x: Coordinates.roomNameTextPosition.x, y: Coordinates.roomNameTextPosition.y + Coordinates.sidebarOffset * 2 }
    static sidebarOpTeamPostion = { x: Coordinates.roomNameTextPosition.x, y: Coordinates.roomNameTextPosition.y + Coordinates.sidebarOffset * 3 }
    static sidebarTrumpMaker = { x: Coordinates.roomNameTextPosition.x, y: Coordinates.roomNameTextPosition.y + Coordinates.sidebarOffset * 4 }
    static sidebarScoreText = { x: Coordinates.roomNameTextPosition.x, y: Coordinates.roomNameTextPosition.y + Coordinates.sidebarOffset * 5 }
    static sidebarScoreCards = { x: Coordinates.roomNameTextPosition.x, y: Coordinates.roomNameTextPosition.y + Coordinates.sidebarOffset * 6 }

    // last8cards
    static last8CardsForStarterPosition = { x: screenWidth - 10 - Coordinates.hiddenWidth, y: 10 }

    // ending UI
    static last8Position = { x: screenWidth * 0.5 - (Coordinates.cardWidth / 2) - Coordinates.handCardOffset * 3.5, y: 100 }
    static scoreCardsPosition = { x: Coordinates.last8Position.x, y: Coordinates.last8Position.y + Coordinates.cardHeigh + 30 }
    static winPointsPosition = { x: Coordinates.last8Position.x, y: Coordinates.scoreCardsPosition.y + Coordinates.cardHeigh + 30 }
    static last8PointsPosition = { x: Coordinates.last8Position.x, y: Coordinates.winPointsPosition.y + 60 }
    static punishmentPointsPosition = { x: Coordinates.last8Position.x, y: Coordinates.last8PointsPosition.y + 60 }
    static totalPointsPosition = { x: Coordinates.last8Position.x, y: Coordinates.punishmentPointsPosition.y + 60 }

    static countDownPosition = { x: screenWidth * 0.1, y: Coordinates.showedCardsPositions[0].y }
    static countDownSzie = 60

    // distributing last 8
    static distributingLast8MaxEdge = 30
    static distributingLast8Position = { x: screenWidth * 0.5 - (Coordinates.cardWidth / 2) - Coordinates.handCardOffset * 3.5, y: screenHeight * 0.5 - Coordinates.cardHeigh / 2 }

}
