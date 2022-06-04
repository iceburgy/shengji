import { CommonMethods } from "./common_methods";

const screenWidth = document.documentElement.clientWidth;
const screenHeight = document.documentElement.clientHeight;

export class Coordinates {
    // 屏幕左上角为坐标原点 (0, 0), 横轴为 x, 纵轴为 y
    static cardWidth = 90
    static cardHeigh = 120
    static handCardOffset = 24
    // account for maximum of five suites, with 4 gaps, shift to left by 2 gaps
    static handCardPositionCenter = { x: screenWidth * 0.5 - Coordinates.cardWidth / 2 - Coordinates.handCardOffset * 2, y: screenHeight - 200 }
    static toolbarSize = 50
    static toolbarPosition = { x: screenWidth - 400, y: Coordinates.handCardPositionCenter.y - 100 - 20 }
    static btnPigPosition = { x: screenWidth * 0.6, y: Coordinates.handCardPositionCenter.y - 100 }

    static readonly hallPlayerHeaderPosition = { x: 50, y: 160 }
    static readonly hallPlayerTopPosition = { x: 50, y: 240 }

    static readonly playerTextPositions = [
        { x: screenWidth * 0.4, y: screenHeight - 60 },
        { x: screenWidth - 320, y: screenHeight * 0.5 },
        { x: screenWidth * 0.4, y: 10 },
        { x: 5, y: screenHeight * 0.5 },
    ]

    static readonly playerStarterPositions = [
        { x: Coordinates.playerTextPositions[0].x - 205, y: Coordinates.playerTextPositions[0].y },
        { x: Coordinates.playerTextPositions[1].x, y: Coordinates.playerTextPositions[1].y - 50 },
        { x: Coordinates.playerTextPositions[2].x - 205, y: Coordinates.playerTextPositions[2].y },
        { x: Coordinates.playerTextPositions[3].x, y: Coordinates.playerTextPositions[3].y - 50 },
    ]

    static readonly showedCardsPositions = [
        { x: screenWidth * 0.5 - Coordinates.cardWidth / 2, y: Coordinates.playerTextPositions[0].y - 300 },
        { x: screenWidth - 300, y: Coordinates.playerTextPositions[1].y - 110 },
        { x: screenWidth * 0.5 - Coordinates.cardWidth / 2, y: Coordinates.playerTextPositions[2].y + 100 },
        { x: Coordinates.playerTextPositions[3].x + 200, y: Coordinates.playerTextPositions[3].y - 110 },
    ]
}
