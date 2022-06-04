
import { CurrentPoker } from './current_poker';
import { PlayerEntity } from './player_entity';
export class CommonMethods {
    public static cardNumToValue: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

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
}
