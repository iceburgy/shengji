import { CommonMethods } from "./common_methods"

export class RoomSetting {
    public RoomName: string
    public RoomOwner: string
    public ManditoryRanks: number[]
    public AllowRiotWithTooFewScoreCards: number
    public AllowRiotWithTooFewTrumpCards: number
    public AllowJToBottom: boolean
    public AllowSurrender: boolean
    public AllowRobotMakeTrump: boolean
    public IsFullDebug: boolean
    public secondsToWaitForReenter: number
    public DisplaySignalCardInfo: boolean
    constructor() {
        this.RoomName = ""
        this.RoomOwner = ""
        this.ManditoryRanks = []
        this.AllowRiotWithTooFewScoreCards = -1
        this.AllowRiotWithTooFewTrumpCards = -1
        this.AllowJToBottom = false
        this.AllowSurrender = false
        this.AllowRobotMakeTrump = false
        this.IsFullDebug = false
        this.secondsToWaitForReenter = 60
        this.DisplaySignalCardInfo = false
    }
    public CloneFrom(from: RoomSetting) {
        this.RoomName = from.RoomName
        this.RoomOwner = from.RoomOwner
        this.ManditoryRanks = CommonMethods.deepCopy<number[]>(from.ManditoryRanks);
        this.AllowRiotWithTooFewScoreCards = from.AllowRiotWithTooFewScoreCards
        this.AllowRiotWithTooFewTrumpCards = from.AllowRiotWithTooFewTrumpCards
        this.AllowJToBottom = from.AllowJToBottom
        this.AllowSurrender = from.AllowSurrender
        this.AllowRobotMakeTrump = from.AllowRobotMakeTrump
        this.IsFullDebug = from.IsFullDebug
        this.secondsToWaitForReenter = from.secondsToWaitForReenter
        this.DisplaySignalCardInfo = from.DisplaySignalCardInfo
    }
}
