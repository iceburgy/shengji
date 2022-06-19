
import { Coordinates } from './coordinates';
import { CurrentPoker } from './current_poker';
import { PlayerEntity } from './player_entity';
export class CommonMethods {
    public static cardNumToValue: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
    public static reenterRoomSignal = "断线重连中,请稍后...";
    public static resumeGameSignal = "牌局加载中,请稍后...";

    public static wsErrorType_Insecure = "an insecure websocket connection may not be initiated from a page loaded over https";
    public static winEmojiLength = 4
    public static winEmojiTypeLength = 6
    public static emojiMsgs: string[] = [
        "这波操作，666！",
        "亲，请注意细节",
        "猴开心：）",
        "嚎啕大哭：（",
        "能不能快点啊，兵贵神速！",
        "烟花",
    ]

    constructor() {
    }

    public static ArrayIsEqual(a: any[], b: any[]): boolean {
        if (a == null || b == null) {
            return false
        }
        if (a.length != b.length) {
            return false
        }
        for (let i = 0; i < a.length; i++) {
            if (!b.includes(a[i])) {
                return false;
            }
        }
        for (let i = 0; i < b.length; i++) {
            if (!a.includes(b[i])) {
                return false;
            }
        }
        return true
    }

    public static IncludesByPlayerID(a: PlayerEntity[], b: string): boolean {
        for (let i = 0; i < a.length; i++) {
            var p = a[i]
            if (p != null && p.PlayerId == b) {
                return true
            }
        }
        return false
    }

    public static GetReadyCount(a: PlayerEntity[]): number {
        var count = 0
        for (let i = 0; i < a.length; i++) {
            var p = a[i]
            if (p != null && p.IsReadyToStart) {
                count++
            }
        }
        return count
    }

    public static GetPlayerCount(a: PlayerEntity[]): number {
        var count = 0
        for (let i = 0; i < a.length; i++) {
            var p = a[i]
            if (p != null) {
                count++
            }
        }
        return count
    }

    public static GetPlayerIndexByID(a: PlayerEntity[], playerID: string): number {
        for (let i = 0; i < a.length; i++) {
            var p = a[i]
            if (p != null && p.PlayerId == playerID) {
                return i;
            }
        }
        return -1
    }

    public static GetNextPlayerAfterThePlayer(a: PlayerEntity[], playerId: string): PlayerEntity {
        var thisPlayerIndex = CommonMethods.GetPlayerIndexByID(a, playerId)
        return a[(thisPlayerIndex + 1) % 4];
    }

    public static BuildCardNumMap() {
        //based on front_end\src\assets\poker.png
        //server:
        //红桃0-12
        //黑桃13-25
        //方块26-38
        //梅花39-51
        //小王52
        //大王53
        //UI:
        //红桃0-12
        //方块13-25
        //黑桃26-38
        //梅花39-51
        //大王52
        //小王53
        CommonMethods.ServerToUICardMap = []
        CommonMethods.UIToServerCardMap = []
        for (let i = 0; i < 13; i++) {
            if (i < 12) CommonMethods.ServerToUICardMap[i] = i + 1
            else CommonMethods.ServerToUICardMap[i] = i + 1 - 13
            if (i > 0) CommonMethods.UIToServerCardMap[i] = i - 1
            else CommonMethods.UIToServerCardMap[i] = i - 1 + 13
        }
        for (let i = 13; i < 26; i++) {
            if (i < 25) CommonMethods.ServerToUICardMap[i] = i + 1 + 13
            else CommonMethods.ServerToUICardMap[i] = i + 1 - 13 + 13
            if (i > 13) CommonMethods.UIToServerCardMap[i] = i - 1 + 13
            else CommonMethods.UIToServerCardMap[i] = i - 1 + 13 + 13
        }
        for (let i = 26; i < 39; i++) {
            if (i < 38) CommonMethods.ServerToUICardMap[i] = i + 1 - 13
            else CommonMethods.ServerToUICardMap[i] = i + 1 - 13 - 13
            if (i > 26) CommonMethods.UIToServerCardMap[i] = i - 1 - 13
            else CommonMethods.UIToServerCardMap[i] = i - 1 + 13 - 13
        }
        for (let i = 39; i < 52; i++) {
            if (i < 51) CommonMethods.ServerToUICardMap[i] = i + 1
            else CommonMethods.ServerToUICardMap[i] = i + 1 - 13
            if (i > 39) CommonMethods.UIToServerCardMap[i] = i - 1
            else CommonMethods.UIToServerCardMap[i] = i - 1 + 13
        }
        CommonMethods.ServerToUICardMap[52] = 53
        CommonMethods.UIToServerCardMap[52] = 53
        CommonMethods.ServerToUICardMap[53] = 52
        CommonMethods.UIToServerCardMap[53] = 52
    }

    public static ServerToUICardMap: number[]
    public static UIToServerCardMap: number[]

    public static ArrayCopy(from: any[], start: number, len: number): any[] {
        var to: any[] = []
        for (let i = start; i < start + len; i++) {
            to.push(from[i])
        }
        return to
    }

    public static ArraySum(from: number[]): number {
        let sum = 0;
        if (from == undefined) return sum
        from.forEach((element) => {
            sum += element;
        });
        return sum;
    }

    public static deepCopy<T>(instance: T): T {
        if (instance == null) {
            return instance;
        }

        // handle Dates
        if (instance instanceof Date) {
            return new Date(instance.getTime()) as any;
        }

        // handle Array types
        if (instance instanceof Array) {
            var cloneArr = [] as any[];
            (instance as any[]).forEach((value) => { cloneArr.push(value) });
            // for nested objects
            return cloneArr.map((value: any) => CommonMethods.deepCopy<any>(value)) as any;
        }
        // handle objects
        if (instance instanceof Object) {
            var copyInstance = {
                ...(instance as { [key: string]: any }
                )
            } as { [key: string]: any };
            for (var attr in instance) {
                if ((instance as Object).hasOwnProperty(attr))
                    copyInstance[attr] = CommonMethods.deepCopy<any>(instance[attr]);
            }
            return copyInstance as T;
        }
        // handling primitive data types
        return instance;
    }

    public static ArrayRemoveOneByValue(arr: number[], value: number): number[] {
        var to: number[] = []
        let found = false
        for (let i = 0; i < arr.length; i++) {
            if (found || arr[i] != value) to.push(arr[i])
            else found = true
        }
        return to
    }

    // public static string GetSuitString(int a)
    // {
    //     int suitInt = GetSuit(a);
    //     Suit suit = (Suit)suitInt;
    //     return suit.ToString();
    // }

    public static GetNumberString(a: number): string {
        if (a == 52) {
            return "Small";
        }
        if (a == 53) {
            return "Big";
        }
        return CommonMethods.cardNumToValue[a % 13];
    }

    public static GetScoreCardsScore(scoreCards: number[]): number {
        let points = 0;
        scoreCards.forEach(card => {
            if (card % 13 == 3)
                points += 5;
            else if (card % 13 == 8)
                points += 10;
            else if (card % 13 == 11)
                points += 10;

        })
        return points;
    }

    public static AllOnline(players: PlayerEntity[]): boolean {
        for (let i = 0; i < 4; i++) {
            if (players[i] == null || players[i].IsOffline) return false;

        }
        return true;
    }

    public static AllReady(players: PlayerEntity[]): boolean {
        for (let i = 0; i < 4; i++) {
            if (players[i] == null || !players[i].IsReadyToStart) return false;

        }
        return true;
    }

    public static SomeoneBecomesReady(oldOnes: PlayerEntity[], newOnes: PlayerEntity[]): boolean {
        for (let i = 0; i < 4; i++) {
            if ((oldOnes[i] == null || !oldOnes[i].IsReadyToStart) && (newOnes[i] != null && newOnes[i].IsReadyToStart)) return true;
        }
        return false;
    }

    /// <summary>
    ///     比较两张牌孰大孰小
    /// </summary>
    /// <param name="a">第一张牌</param>
    /// <param name="b">第二张牌</param>
    /// <param name="suit">主花色</param>
    /// <param name="rank">主Rank</param>
    /// <param name="firstSuit">第一张牌的花色</param>
    /// <returns>如果第一张大于等于第二张牌，返回true,否则返回false</returns>
    public static CompareTo(a: number, b: number, suit: number, rank: number, firstSuit: number): boolean {
        if ((a == -1) && (b == -1)) {
            return true;
        }
        if ((a == -1) && (b != -1)) {
            return false;
        }
        if ((a != -1) && (b == -1)) {
            return true;
        }

        let suit1 = this.GetSuitByTrumpAndRank(a, suit, rank);
        let suit2 = this.GetSuitByTrumpAndRank(b, suit, rank);

        if ((suit1 == firstSuit) && (suit2 != firstSuit)) {
            if (suit1 == suit) {
                return true;
            }
            if (suit2 == suit) {
                return false;
            }
            return true;
        }
        if ((suit1 != firstSuit) && (suit2 == firstSuit)) {
            if (suit1 == suit) {
                return true;
            }
            if (suit2 == suit) {
                return false;
            }

            return false;
        }

        if (a == 53) {
            return true;
        }

        if (a == 52) {
            if (b == 53) {
                return false;
            }
            return true;
        }
        if (b == 52) {
            if (a == 53) {
                return true;
            }
            return false;
        }


        if (a == (suit - 1) * 13 + rank) {
            if (b == 53 || b == 52) {
                return false;
            }
            return true;
        }
        if (a % 13 == rank) {
            if (b == 53 || b == 52 || (b == (suit - 1) * 13 + rank)) {
                return false;
            }
            return true;
        }
        if (b == (suit - 1) * 13 + rank) {
            if (a == 53 || a == 52) {
                return true;
            }
            return false;
        }
        if (b % 13 == rank) {
            if (a == 53 || a == 52 || (a == (suit - 1) * 13 + rank)) {
                return true;
            }
            return false;
        }
        if ((suit1 == suit) && (suit2 != suit)) {
            return true;
        }
        if ((suit1 != suit) && (suit2 == suit)) {
            return false;
        }
        if (suit1 == suit2) {
            return (a - b >= 0);
        }
        return true;
    }

    /// <summary>
    ///     得到一张牌的花色，如果是主，则返回主的花色
    /// </summary>
    /// <param name="a">牌值</param>
    /// <param name="suit">主花色</param>
    /// <param name="rank">主Rank</param>
    /// <returns>花色</returns>
    public static GetSuitByTrumpAndRank(a: number, suit: number, rank: number): number {
        let firstSuit: number = 0;

        if (a == 53 || a == 52) {
            firstSuit = suit;
        }
        else if ((a % 13) == rank) {
            firstSuit = suit;
        }
        else {
            firstSuit = CommonMethods.GetSuitByCardNumber(a);
        }

        return firstSuit;
    }

    /// <summary>
    ///     得到一个牌的花色
    /// </summary>
    /// <param name="a">牌值</param>
    /// <returns>花色</returns>
    public static GetSuitByCardNumber(a: number): number {
        if (a >= 0 && a < 13) {
            return 1;
        }
        if (a >= 13 && a < 26) {
            return 2;
        }
        if (a >= 26 && a < 39) {
            return 3;
        }

        if (a >= 39 && a < 52) {
            return 4;
        }

        return 5;
    }

    public static GetMaxCard(cards: number[], trump: number, rank: number): number {
        var cp = new CurrentPoker();
        cp.Trump = trump;
        cp.Rank = rank;
        cards.forEach(card => {
            cp.AddCard(card);
        })
        //cp.Sort();

        if (cp.IsMixed()) {
            return -1;
        }

        if (cp.RedJoker() > 0)
            return 53;
        if (cp.BlackJoker() > 0)
            return 52;
        if (cp.MasterRank() > 0)
            return rank + (trump - 1) * 13;

        if (cp.HeartsRankTotal() > 0)
            return rank;
        if (cp.SpadesRankTotal() > 0)
            return rank + 13;
        if (cp.DiamondsRankTotal() > 0)
            return rank + 26;
        if (cp.ClubsRankTotal() > 0)
            return rank + 39;

        for (let i = 51; i > -1; i--) {
            if (cards.includes(i))
                return i;
        }

        return -1;
    }

    public static GetRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }
}
