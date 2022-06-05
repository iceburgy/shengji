import { CommonMethods } from "./common_methods";
import { CurrentPoker } from "./current_poker";
import { CurrentTrickState } from "./current_trick_state";
import { PokerHelper } from "./poker_helper";
import { SuitEnums } from "./suit_enums";

export class Algorithm {
    constructor() {
    }

    private static exposeTrumpThreshold = 5;
    private static exposeTrumpJokerThreshold = 4;
    //跟出
    public static MustSelectedCards(selectedCards: number[], currentTrickState: CurrentTrickState, currentPoker: CurrentPoker) {
        let currentCards = new CurrentPoker()
        currentCards.CloneFrom(currentPoker)

        var leadingCardsCp = new CurrentPoker();
        leadingCardsCp.Trump = currentTrickState.Trump;
        leadingCardsCp.Rank = currentTrickState.Rank;

        currentTrickState.LeadingCards().forEach(card => {
            leadingCardsCp.AddCard(card);
        })

        let leadingSuit: number = currentTrickState.LeadingSuit();
        let isTrump: boolean = PokerHelper.IsTrump(currentTrickState.LeadingCards()[0], currentCards.Trump, currentCards.Rank);
        if (isTrump) leadingSuit = currentCards.Trump;


        selectedCards.length = 0
        let allSuitCardsCp = new CurrentPoker()
        allSuitCardsCp.CloneFrom(currentPoker)
        let allSuitCards = allSuitCardsCp.Cards;

        let leadingTractors: number[] = leadingCardsCp.GetTractorBySuit(leadingSuit);
        var leadingPairs = leadingCardsCp.GetPairsBySuit(leadingSuit);

        //如果别人出拖拉机，我如果有，也应该出拖拉机
        let currentTractors: number[] = currentCards.GetTractorBySuit(leadingSuit);
        for (let i = 0; i < leadingTractors.length && i < currentTractors.length && selectedCards.length < leadingCardsCp.Count(); i++) {
            selectedCards.push(currentTractors[i]);
            selectedCards.push(currentTractors[i]);
            allSuitCards[currentTractors[i]] -= 2;
            leadingPairs = CommonMethods.ArrayRemoveOneByValue(leadingPairs, currentTractors[i]);
        }
        //对子
        var currentPairs = currentCards.GetPairsBySuit(leadingSuit);
        for (let i = 0; i < leadingPairs.length && i < currentPairs.length && selectedCards.length < leadingCardsCp.Count(); i++) {
            if (selectedCards.includes(currentPairs[i])) continue;
            selectedCards.push(currentPairs[i]);
            selectedCards.push(currentPairs[i]);
            allSuitCards[currentPairs[i]] -= 2;
        }
        //单张先跳过对子
        var currentSuitCards = currentCards.GetSuitCardsWithJokerAndRank(leadingSuit);
        for (let i = 0; i < currentSuitCards.length && selectedCards.length < leadingCardsCp.Count(); i++) {
            if (currentPairs.includes(currentSuitCards[i]) || allSuitCards[currentSuitCards[i]] <= 0) continue;
            selectedCards.push(currentSuitCards[i]);
            allSuitCards[currentSuitCards[i]]--;
        }
        //单张
        for (let i = 0; i < currentSuitCards.length && selectedCards.length < leadingCardsCp.Count(); i++) {
            if (allSuitCards[currentSuitCards[i]] <= 0) continue;
            selectedCards.push(currentSuitCards[i]);
            allSuitCards[currentSuitCards[i]]--;
        }
        //其他花色的牌先跳过所有主牌，和副牌对子，即副牌单张
        for (let i = 0; i < allSuitCards.length && selectedCards.length < leadingCardsCp.Count(); i++) {
            let isITrump: boolean = PokerHelper.IsTrump(i, currentCards.Trump, currentCards.Rank);
            if (isITrump || allSuitCards[i] <= 0 || allSuitCards[i] == 2) continue;
            selectedCards.push(i);
            allSuitCards[i]--;
        }
        //其他花色的牌跳过所有主牌
        for (let i = 0; i < allSuitCards.length && selectedCards.length < leadingCardsCp.Count(); i++) {
            let isITrump: boolean = PokerHelper.IsTrump(i, currentCards.Trump, currentCards.Rank);
            if (isITrump || allSuitCards[i] <= 0) continue;
            while (allSuitCards[i] > 0 && selectedCards.length < leadingCardsCp.Count()) {
                selectedCards.push(i);
                allSuitCards[i]--;
            }
        }
        //其他花色的牌先跳过对子
        for (let i = 0; i < allSuitCards.length && selectedCards.length < leadingCardsCp.Count(); i++) {
            if (allSuitCards[i] <= 0 || allSuitCards[i] == 2) continue;
            selectedCards.push(i);
            allSuitCards[i]--;
        }
        //其他花色的牌
        for (let i = 0; i < allSuitCards.length && selectedCards.length < leadingCardsCp.Count(); i++) {
            while (allSuitCards[i] > 0 && selectedCards.length < leadingCardsCp.Count()) {
                selectedCards.push(i);
                allSuitCards[i]--;
            }
        }
    }

    //跟选：在有必选牌的情况下自动选择必选牌，方便玩家快捷出牌
    public static MustSelectedCardsNoShow(selectedCards: number[], currentTrickState: CurrentTrickState, currentPoker: CurrentPoker) {
        let currentCards = new CurrentPoker()
        currentCards.CloneFrom(currentPoker)

        var leadingCardsCp = new CurrentPoker();
        leadingCardsCp.Trump = currentTrickState.Trump;
        leadingCardsCp.Rank = currentTrickState.Rank;

        currentTrickState.LeadingCards().forEach(card => {
            leadingCardsCp.AddCard(card);
        })

        let leadingSuit = currentTrickState.LeadingSuit();
        let isTrump: boolean = PokerHelper.IsTrump(currentTrickState.LeadingCards()[0], currentCards.Trump, currentCards.Rank);
        if (isTrump) leadingSuit = currentCards.Trump;

        selectedCards.length = 0
        let currentSuitCards: number[] = currentCards.GetSuitCardsWithJokerAndRank(leadingSuit)

        let leadingTractors: number[] = leadingCardsCp.GetTractorBySuit(leadingSuit);
        var leadingPairs = leadingCardsCp.GetPairsBySuit(leadingSuit);

        //如果别人出拖拉机，则选择我手中相同花色的拖拉机
        let currentTractors: number[] = currentCards.GetTractorBySuit(leadingSuit);
        if (currentTractors.length <= leadingTractors.length) {
            for (let i = 0; i < leadingTractors.length && i < currentTractors.length && selectedCards.length < leadingCardsCp.Count(); i++) {
                selectedCards.push(currentTractors[i]);
                selectedCards.push(currentTractors[i]);
                currentSuitCards = CommonMethods.ArrayRemoveOneByValue(currentSuitCards, currentTractors[i]);
                currentSuitCards = CommonMethods.ArrayRemoveOneByValue(currentSuitCards, currentTractors[i]);
                leadingPairs = CommonMethods.ArrayRemoveOneByValue(currentSuitCards, currentTractors[i]);
            }
        }
        //如果别人出对子，则选择我手中相同花色的对子
        var currentPairs = currentCards.GetPairsBySuit(leadingSuit);
        if (currentPairs.length <= leadingPairs.length) {
            for (let i = 0; i < leadingPairs.length && i < currentPairs.length && selectedCards.length < leadingCardsCp.Count(); i++) {
                if (selectedCards.includes(currentPairs[i])) continue;
                selectedCards.push(currentPairs[i]);
                selectedCards.push(currentPairs[i]);

                currentSuitCards = CommonMethods.ArrayRemoveOneByValue(currentSuitCards, currentPairs[i]);
                currentSuitCards = CommonMethods.ArrayRemoveOneByValue(currentSuitCards, currentPairs[i]);
            }
        }
        //如果别人出单张，则选择我手中相同花色的单张
        if (currentSuitCards.length <= leadingCardsCp.Count() - selectedCards.length) {
            for (let i = 0; i < currentSuitCards.length; i++) {
                selectedCards.push(currentSuitCards[i]);
            }
        }
    }
    //先手
    public static ShouldSelectedCards(selectedCards: number[], currentTrickState: CurrentTrickState, currentPoker: CurrentPoker) {
        let currentCards = new CurrentPoker()
        currentCards.CloneFrom(currentPoker)

        let allSuitCardsCp = new CurrentPoker()
        allSuitCardsCp.CloneFrom(currentPoker)
        var allSuitCards: number[] = allSuitCardsCp.Cards;
        var maxValue = currentPoker.Rank == 12 ? 11 : 12;

        //先出A

        for (const [key, st] of Object.entries(SuitEnums.Suit)) {

            if (st == SuitEnums.Suit.None || st == SuitEnums.Suit.Joker || st == currentCards.Trump) continue;
            let maxCards = currentCards.GetMaxCards(st);
            if (maxCards % 13 == maxValue && allSuitCards[maxCards] == 1) {
                selectedCards.push(maxCards);
                return;
            }
            //dumping causing concurrency issue, TODO: use timer tick
            //if (maxCards % 13 == maxValue)
            //{
            //    while (maxCards % 13 > 0 && allSuitCards[maxCards] == 2 || maxCards == currentTrickState.Rank)
            //    {
            //    if(maxCards != currentTrickState.Rank){
            //        selectedCards.Add(maxCards);
            //        selectedCards.Add(maxCards);
            //    }
            //        maxCards--;
            //    }
            //    selectedCards.Add(maxCards);
            //    if (allSuitCards[maxCards] == 2) selectedCards.Add(maxCards);
            //    return;
            //}
        }
        //再出对子
        for (const [key, st] of Object.entries(SuitEnums.Suit)) {
            if (st == SuitEnums.Suit.None || st == SuitEnums.Suit.Joker || st == currentCards.Trump) continue;
            let currentTractors: number[] = currentCards.GetTractorBySuit(st);
            if (currentTractors.length > 1) {
                currentTractors.forEach(tr => {
                    selectedCards.push(tr);
                    selectedCards.push(tr);

                })
                return;
            }
            var currentPairs = currentCards.GetPairsBySuit(st);
            if (currentPairs.length > 0) {
                selectedCards.push(currentPairs[currentPairs.length - 1]);
                selectedCards.push(currentPairs[currentPairs.length - 1]);
                return;
            }

        }


        let masterTractors: number[] = currentCards.GetTractorBySuit(currentTrickState.Trump);
        if (masterTractors.length > 1) {
            masterTractors.forEach(tr => {
                selectedCards.push(tr);
                selectedCards.push(tr);
            })
            return;
        }

        var masterPair = currentCards.GetPairsBySuit(currentTrickState.Trump);
        if (masterPair.length > 0) {
            selectedCards.push(masterPair[masterPair.length - 1]);
            selectedCards.push(masterPair[masterPair.length - 1]);
            return;
        }

        let minMaster: number = currentCards.GetMinMasterCards(currentTrickState.Trump);
        if (minMaster >= 0) {
            selectedCards.push(minMaster);
            return;
        }

        //其他花色的牌
        for (let i = 0; i < allSuitCards.length; i++) {
            if (allSuitCards[i] > 0) {
                selectedCards.push(i);
                return;
            }
        }
    }

    //埋底
    public static ShouldSelectedLast8Cards(selectedCards: number[], currentPoker: CurrentPoker) {
        let goodCards: number[] = []
        let currentCards = new CurrentPoker()
        currentCards.CloneFrom(currentPoker)

        let badCardsCp = new CurrentPoker()
        badCardsCp.CloneFrom(currentPoker)

        let allSuitCardsCp = new CurrentPoker()
        allSuitCardsCp.CloneFrom(currentPoker)

        var allSuitCards = allSuitCardsCp.Cards;
        var maxValue = currentPoker.Rank == 12 ? 11 : 12;

        //副牌里，先挑出好牌来，最好不埋
        //挑出A及以下的牌
        for (const [key, st] of Object.entries(SuitEnums.Suit)) {
            if (st == SuitEnums.Suit.None || st == SuitEnums.Suit.Joker || st == currentCards.Trump) continue;
            let maxCards: number = currentCards.GetMaxCards(st);
            if (maxCards % 13 == maxValue) {
                while (maxCards % 13 > 0 && allSuitCards[maxCards] == 2 || maxCards == currentCards.Rank) //保证打几的牌没有对子，也不会打断继续往下找大牌对子
                {
                    if (maxCards != currentCards.Rank) {
                        goodCards.push(maxCards);
                        goodCards.push(maxCards);
                        badCardsCp.RemoveCard(maxCards);
                        badCardsCp.RemoveCard(maxCards);
                    }
                    maxCards--;
                }
                goodCards.push(maxCards);
                badCardsCp.RemoveCard(maxCards);
                if (allSuitCards[maxCards] == 2) {
                    goodCards.push(maxCards);
                    badCardsCp.RemoveCard(maxCards);
                }
            }
        }
        //再挑出对子
        for (const [key, st] of Object.entries(SuitEnums.Suit)) {
            if (st == SuitEnums.Suit.None || st == SuitEnums.Suit.Joker || st == currentCards.Trump) continue;
            var currentPairs = currentCards.GetPairsBySuit(st);
            currentPairs.forEach(pair => {
                goodCards.push(pair);
                goodCards.push(pair);
                badCardsCp.RemoveCard(pair);
                badCardsCp.RemoveCard(pair);

            })
        }

        //将剩余的差牌按花色排序，少的靠前
        let badCardsBySuit: any[] = []
        for (const [key, st] of Object.entries(SuitEnums.Suit)) {
            if (st == SuitEnums.Suit.None || st == SuitEnums.Suit.Joker || st == currentCards.Trump) continue;
            badCardsBySuit.push(badCardsCp.GetSuitCardsWithJokerAndRank(st));
        }
        badCardsBySuit.sort((a: number[], b: number[]) => (a.length - b.length));
        var masterCards = badCardsCp.GetSuitCardsWithJokerAndRank(currentCards.Trump);
        badCardsBySuit.push(masterCards);

        //从差到好选出8张牌
        badCardsBySuit.forEach((badCards: number[]) => {
            badCards.forEach((bc: number) => {
                selectedCards.push(bc);
                if (selectedCards.length == 8) return;
            })
        })

        goodCards.forEach((goodCard: number) => {
            selectedCards.push(goodCard);
            if (selectedCards.length == 8) return;
        })
    }

    public static TryExposingTrump(availableTrump: number[], currentPoker: CurrentPoker, fullDebug: boolean): number {
        let nonJokerMaxCount = 0;
        let nonJoker = SuitEnums.Suit.None;
        let mayJoker = SuitEnums.Suit.None;
        let currentCards = new CurrentPoker()
        currentCards.CloneFrom(currentPoker)

        availableTrump.forEach((st: number) => {
            switch (st) {
                case SuitEnums.Suit.Heart:
                    let heartCount = currentCards.HeartsNoRankTotal();
                    if (heartCount >= Algorithm.exposeTrumpThreshold && heartCount > nonJokerMaxCount) {
                        nonJokerMaxCount = heartCount;
                        nonJoker = st;
                    }
                    break;
                case SuitEnums.Suit.Spade:
                    let spadeCount = currentCards.SpadesNoRankTotal();
                    if (spadeCount >= Algorithm.exposeTrumpThreshold && spadeCount > nonJokerMaxCount) {
                        nonJokerMaxCount = spadeCount;
                        nonJoker = st;
                    }
                    break;
                case SuitEnums.Suit.Diamond:
                    let diamondCount = currentCards.DiamondsNoRankTotal();
                    if (diamondCount >= Algorithm.exposeTrumpThreshold && diamondCount > nonJokerMaxCount) {
                        nonJokerMaxCount = diamondCount;
                        nonJoker = st;
                    }
                    break;
                case SuitEnums.Suit.Club:
                    let clubCount = currentCards.ClubsNoRankTotal();
                    if (clubCount >= Algorithm.exposeTrumpThreshold && clubCount > nonJokerMaxCount) {
                        nonJokerMaxCount = clubCount;
                        nonJoker = st;
                    }
                    break;
                case SuitEnums.Suit.Joker:
                    let jokerAndRankCount = currentCards.GetSuitCardsWithJokerAndRank(SuitEnums.Suit.Joker).length;
                    if (fullDebug && jokerAndRankCount >= Algorithm.exposeTrumpJokerThreshold) mayJoker = SuitEnums.Suit.Joker;
                    break;
                default:
                    break;
            }
        })
        if (nonJokerMaxCount > 0) return nonJoker;
        else return mayJoker;

    }
}
