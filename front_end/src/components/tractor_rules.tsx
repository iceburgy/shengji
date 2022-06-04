import { CurrentPoker } from "./current_poker";
import { CurrentTrickState } from "./current_trick_state";
import { PokerHelper } from "./poker_helper";
import { ShowingCardsValidationResult } from "./showing_cards_validation_result";

export class TractorRules {

    constructor() {
    }


    public static GetCardNumberofEachPlayer(playerCount: number): number {
        if (playerCount == 4)
            return 25;
        if (playerCount == 5)
            return 20;

        return 25;
    }


    public static IsValid(currentTrickState: CurrentTrickState, selectedCards: number[], currentCards: CurrentPoker): ShowingCardsValidationResult {
        let res = new ShowingCardsValidationResult()

        //玩家选择牌之后剩下的牌
        var leftCardsCp: CurrentPoker = new CurrentPoker()
        leftCardsCp.CloneFrom(currentCards)
        selectedCards.forEach(card => {
            leftCardsCp.RemoveCard(card);
        })

        var showingCardsCp = new CurrentPoker();
        showingCardsCp.TrumpInt = currentCards.Trump;
        showingCardsCp.Rank = currentCards.Rank;
        selectedCards.forEach(showingCard => {
            showingCardsCp.AddCard(showingCard);
        })

        var leadingCardsCp = new CurrentPoker();
        leadingCardsCp.TrumpInt = currentCards.Trump;
        leadingCardsCp.Rank = currentCards.Rank;
        currentTrickState.LeadingCards().forEach(card => {
            leadingCardsCp.AddCard(card);
        })

        //the first player to show cards
        if (!currentTrickState.IsStarted()) {
            if (showingCardsCp.Count() > 0 && !showingCardsCp.IsMixed()) {
                if (selectedCards.length == 1) //如果是单张牌
                {
                    res.ResultType = ShowingCardsValidationResult.ShowingCardsValidationResultType.Valid
                    return res
                }
                if (selectedCards.length == 2 && (showingCardsCp.GetPairs().length == 1)) //如果是一对
                {
                    res.ResultType = ShowingCardsValidationResult.ShowingCardsValidationResultType.Valid
                    return res
                }
                if ((showingCardsCp.GetTractorOfAnySuit().length > 1) &&
                    selectedCards.length == showingCardsCp.GetTractorOfAnySuit().length * 2) //如果是拖拉机
                {
                    res.ResultType = ShowingCardsValidationResult.ShowingCardsValidationResultType.Valid
                    return res
                }
                res.ResultType = ShowingCardsValidationResult.ShowingCardsValidationResultType.TryToDump
                return res
            }
        }

        //牌的数量
        if (currentTrickState.LeadingCards().length != selectedCards.length) {
            res.ResultType = ShowingCardsValidationResult.ShowingCardsValidationResultType.Invalid
            return res
        }

        //得到第一个家伙出的花色
        let leadingSuit: number = currentTrickState.LeadingSuit();
        let isTrump = PokerHelper.IsTrump(currentTrickState.LeadingCards()[0], currentCards.Trump, currentCards.Rank);
        if (isTrump)
            leadingSuit = currentCards.Trump;

        //如果出的牌混合的，则判断手中是否还剩出的花色，如果剩,false;如果不剩;true
        if (showingCardsCp.IsMixed()) {
            if (leftCardsCp.HasSomeCards(leadingSuit)) {
                res.ResultType = ShowingCardsValidationResult.ShowingCardsValidationResultType.Invalid
                return res
            }
            res.ResultType = ShowingCardsValidationResult.ShowingCardsValidationResultType.Valid
            return res
        }

        //出的牌的花色
        let mysuit = PokerHelper.GetSuit(selectedCards[0]);
        isTrump = PokerHelper.IsTrump(selectedCards[0], currentCards.Trump, currentCards.Rank);
        if (isTrump)
            mysuit = currentCards.Trump;


        //花色是否一致
        if (mysuit != leadingSuit) {
            //而且确实没有此花色
            if (leftCardsCp.HasSomeCards(leadingSuit)) {
                res.ResultType = ShowingCardsValidationResult.ShowingCardsValidationResultType.Invalid
                return res
            }
            res.ResultType = ShowingCardsValidationResult.ShowingCardsValidationResultType.Valid
            return res
        }

        //别人如果出对，我也应该出对
        let leadingCardsPairs = leadingCardsCp.GetPairs().length;
        let selectedCardsPairs = showingCardsCp.GetPairs().length;
        let holdingCardsPairs = currentCards.GetPairsBySuit(leadingSuit).length;


        //2.如果别人出拖拉机，我如果有，也应该出拖拉机
        if (leadingCardsCp.HasTractors()) {
            if ((!showingCardsCp.HasTractors()) && (currentCards.GetTractorBySuitInt(leadingSuit) > -1)) {
                res.ResultType = ShowingCardsValidationResult.ShowingCardsValidationResultType.Invalid
                return res
            }
            if ((selectedCardsPairs < leadingCardsPairs) && (holdingCardsPairs > selectedCardsPairs))
            //出的对比第一个玩家少，而且没有出所有的对
            {
                res.ResultType = ShowingCardsValidationResult.ShowingCardsValidationResultType.Invalid
                return res
            }
            res.ResultType = ShowingCardsValidationResult.ShowingCardsValidationResultType.Valid
            return res
        }


        if (leadingCardsPairs > 0) {
            //如果对出的不够多，而且没有出所有的对
            if ((holdingCardsPairs > selectedCardsPairs) && (selectedCardsPairs < leadingCardsPairs)) {
                res.ResultType = ShowingCardsValidationResult.ShowingCardsValidationResultType.Invalid
                return res
            }
            res.ResultType = ShowingCardsValidationResult.ShowingCardsValidationResultType.Valid
            return res
        }


        res.ResultType = ShowingCardsValidationResult.ShowingCardsValidationResultType.Valid
        return res
    }
}
