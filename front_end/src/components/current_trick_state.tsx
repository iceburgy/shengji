
import { CommonMethods } from './common_methods';
import { PokerHelper } from './poker_helper';
import { ServerLocalCache } from './server_local_cache';
import { SuitEnums } from './suit_enums';
export class CurrentTrickState {
    public Learder: string
    public Winner: string
    public ShowedCards: any
    public serverLocalCache: ServerLocalCache
    public Trump: number
    public Rank: number
    constructor() {
        this.Learder = ""
        this.Winner = ""
        this.ShowedCards = {}
        this.serverLocalCache = new ServerLocalCache()
        this.Trump = 0
        this.Rank = 0
    }

    public CloneFrom(from: CurrentTrickState) {
        this.Learder = from.Learder
        this.Winner = from.Winner
        this.ShowedCards = CommonMethods.deepCopy<any>(from.ShowedCards)
        this.serverLocalCache.CloneFrom(from.serverLocalCache)
        this.Trump = from.Trump
        this.Rank = from.Rank
    }

    public LatestPlayerShowedCard(): string {
        let playerId = "";
        if (!this.Learder || !this.ShowedCards[this.Learder] || this.ShowedCards[this.Learder].length == 0)
            return playerId;

        let afterLeader = false;
        //find next player to show card after learder
        for (const [key, value] of Object.entries(this.ShowedCards)) {
            if (key != this.Learder && afterLeader == false)
                continue;
            else if (key == this.Learder) //search from leader;
            {
                playerId = this.Learder;
                afterLeader = true;
            }
            else if (afterLeader) {
                if ((value as number[]).length == 0)
                    return playerId;
                playerId = key;
            }
        }

        for (const [key, value] of Object.entries(this.ShowedCards)) {
            {
                if (key != this.Learder) {
                    if ((value as number[]).length == 0)
                        return playerId;
                    playerId = key;
                }
                else //search end before leader
                    break;
            }
        }
        return playerId;
    }

    public IsStarted(): boolean {
        if (!this.Learder)
            return false;
        if (!this.ShowedCards || Object.keys(this.ShowedCards).length == 0)
            return false;
        return this.ShowedCards[this.Learder].length > 0;
    }

    public CountOfPlayerShowedCards(): number {
        let result = 0;
        if (!this.ShowedCards) return result
        for (const [key, value] of Object.entries(this.ShowedCards)) {
            if ((value as number[]).length > 0)
                result++;
        }
        return result;
    }

    public NextPlayer(): string {
        let playerId: string = "";
        if (this.ShowedCards[this.Learder].length == 0)
            playerId = this.Learder;

        else {
            let afterLeader = false;
            //find next player to show card after learder
            for (const [key, value] of Object.entries(this.ShowedCards)) {
                if (key != this.Learder && afterLeader == false)
                    continue;
                if (key == this.Learder) { // search from learder
                    afterLeader = true;
                }
                if (afterLeader) {
                    if ((value as number[]).length == 0) {
                        playerId = key;
                        break;
                    }
                }
            }

            if (!playerId) {
                for (const [key, value] of Object.entries(this.ShowedCards)) {
                    if (key != this.Learder) {
                        if ((value as number[]).length == 0) {
                            playerId = key;
                            break;
                        }
                    }
                    else //search end before leader;
                        break;
                }
            }
        }
        return playerId;
    }

    public NextPlayerByID(playerId: string): string {
        let nextPlayer = "";
        if (!this.ShowedCards || !this.ShowedCards[playerId])
            return "";


        let afterLeader = false;
        //find next player to show card after learder
        for (const [key, value] of Object.entries(this.ShowedCards)) {
            if (key != playerId && afterLeader == false)
                continue;
            else if (key == playerId) // search from learder
            {
                afterLeader = true;
            }
            else if (afterLeader) {
                nextPlayer = key;
                break;
            }
        }


        if (!nextPlayer) {
            for (const [key, value] of Object.entries(this.ShowedCards)) {
                if (key != playerId) {
                    nextPlayer = key;
                }
                break;
            }
        }
        return nextPlayer;
    }

    public AllPlayedShowedCards(): boolean {
        for (const [key, value] of Object.entries(this.ShowedCards)) {
            if ((value as number[]).length == 0)
                return false;
        }
        return true;
    }

    public LeadingCards(): number[] {
        if (this.IsStarted()) {
            return this.ShowedCards[this.Learder];
        }
        return []
    }

    public LeadingSuit(): number {
        if (this.IsStarted()) {
            if (PokerHelper.IsTrump(this.LeadingCards()[0], this.Trump, this.Rank)) return this.Trump;
            else return PokerHelper.GetSuit(this.LeadingCards()[0]);
        }
        return SuitEnums.Suit.None;
    }
}