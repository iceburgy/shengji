
import { MainForm } from './main_form';
import { CurrentPoker } from './current_poker';
import { CommonMethods } from './common_methods';
import { Coordinates } from './coordinates';
import { SuitEnums } from './suit_enums';
import { TractorRules } from './tractor_rules';
import { ShowingCardsValidationResult } from './showing_cards_validation_result';

export class DrawingFormHelper {
    public mainForm: MainForm

    private startX: number = 0

    constructor(mf: MainForm) {
        this.mainForm = mf
    }

    public IGetCard() {
        this.DrawMySortedCardsLikeNT();

        this.reDrawToolbar();

    }

    // drawing cards without any tilt
    public ResortMyHandCards() {
        this.DrawMyHandCards()
    }

    // drawing cards with selected cards tilted
    public DrawMyPlayingCards() {
        this.DrawMyHandCards()

        this.validateSelectedCards()
    }
    private validateSelectedCards() {

        this.mainForm.SelectedCards = []
        for (let k = 0; k < this.mainForm.myCardIsReady.length; k++) {
            if (this.mainForm.myCardIsReady[k]) {
                this.mainForm.SelectedCards.push(this.mainForm.gameScene.cardImages[k].getData("serverCardNumber"));
            }
        }

        //判断当前的出的牌是否有效,如果有效，画小猪
        if (this.mainForm.SelectedCards.length > 0) {
            var selectedCardsValidationResult = TractorRules.IsValid(this.mainForm.tractorPlayer.CurrentTrickState,
                this.mainForm.SelectedCards,
                this.mainForm.tractorPlayer.CurrentPoker);

            if ((this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing
                && this.mainForm.tractorPlayer.CurrentTrickState.NextPlayer() == this.mainForm.tractorPlayer.PlayerId)
                &&
                (selectedCardsValidationResult.ResultType == ShowingCardsValidationResult.ShowingCardsValidationResultType.Valid ||
                    selectedCardsValidationResult.ResultType == ShowingCardsValidationResult.ShowingCardsValidationResultType.TryToDump)) {
                this.mainForm.btnPig.setVisible(true);
            }
            else if ((this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing
                && this.mainForm.tractorPlayer.CurrentTrickState.NextPlayer() == this.mainForm.tractorPlayer.PlayerId)) {
                this.mainForm.btnPig.setVisible(false);
            }

        }
        else if ((this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing
            && this.mainForm.tractorPlayer.CurrentTrickState.NextPlayer() == this.mainForm.tractorPlayer.PlayerId)) {
            this.mainForm.btnPig.setVisible(false);
        }


        this.My8CardsIsReady();

    }

    private My8CardsIsReady() {
        if (this.mainForm.tractorPlayer.isObserver) return;
        //如果等我扣牌
        if (this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards && this.mainForm.tractorPlayer.CurrentHandState.Last8Holder == this.mainForm.tractorPlayer.PlayerId) {
            let total = 0;
            for (let i = 0; i < this.mainForm.myCardIsReady.length; i++) {
                if (this.mainForm.myCardIsReady[i]) {
                    total++;
                }
            }
            if (total == 8) {
                this.mainForm.btnPig.setVisible(true);
            }
            else {
                this.mainForm.btnPig.setVisible(false);
            }
        }
    }
    public DrawMyHandCards() {
        this.mainForm.myCardIsReady = []
        this.mainForm.cardsOrderNumber = 0
        let currentPoker: CurrentPoker = this.mainForm.tractorPlayer.CurrentPoker
        let cardCount: number = currentPoker.Count()

        this.destroyAllCards()
        this.startX = Coordinates.handCardPositionCenter.x - Coordinates.handCardOffset / 2 * (cardCount - 1)
        var allHeartsNoRank: number[] = currentPoker.HeartsNoRank()
        var allSpadesNoRank: number[] = currentPoker.SpadesNoRank()
        var allDiamondsNoRank: number[] = currentPoker.DiamondsNoRank()
        var allClubsNoRank: number[] = currentPoker.ClubsNoRank()

        let curTrump = this.mainForm.tractorPlayer.CurrentHandState.Trump
        var subSolidMasters: number[] = []
        if (curTrump != SuitEnums.Suit.Heart) subSolidMasters[currentPoker.Rank] = currentPoker.HeartsRankTotal()
        if (curTrump != SuitEnums.Suit.Spade) subSolidMasters[currentPoker.Rank + 13] = currentPoker.SpadesRankTotal()
        if (curTrump != SuitEnums.Suit.Diamond) subSolidMasters[currentPoker.Rank + 26] = currentPoker.DiamondsRankTotal()
        if (curTrump != SuitEnums.Suit.Club) subSolidMasters[currentPoker.Rank + 39] = currentPoker.ClubsRankTotal()

        var primeSolidMasters: number[] = []
        if (curTrump == SuitEnums.Suit.Heart) {//红桃
            this.DrawCardsBySuit(allSpadesNoRank, 13)
            this.DrawCardsBySuit(allDiamondsNoRank, 26)
            this.DrawCardsBySuit(allClubsNoRank, 39)
            if (this.DrawCardsBySuit(allHeartsNoRank, 0)) {
                this.startX -= Coordinates.handCardOffset
            }

            primeSolidMasters[currentPoker.Rank] = currentPoker.HeartsRankTotal()
        } else if (curTrump == SuitEnums.Suit.Spade) {//黑桃
            this.DrawCardsBySuit(allDiamondsNoRank, 26)
            this.DrawCardsBySuit(allClubsNoRank, 39)
            this.DrawCardsBySuit(allHeartsNoRank, 0)
            if (this.DrawCardsBySuit(allSpadesNoRank, 13)) {
                this.startX -= Coordinates.handCardOffset
            }

            primeSolidMasters[currentPoker.Rank + 13] = currentPoker.SpadesRankTotal()
        } else if (curTrump == SuitEnums.Suit.Diamond) {//方片
            this.DrawCardsBySuit(allClubsNoRank, 39)
            this.DrawCardsBySuit(allHeartsNoRank, 0)
            this.DrawCardsBySuit(allSpadesNoRank, 13)
            if (this.DrawCardsBySuit(allDiamondsNoRank, 26)) {
                this.startX -= Coordinates.handCardOffset
            }

            primeSolidMasters[currentPoker.Rank + 26] = currentPoker.DiamondsRankTotal()
        } else if (curTrump == SuitEnums.Suit.Club) {//草花
            this.DrawCardsBySuit(allHeartsNoRank, 0)
            this.DrawCardsBySuit(allSpadesNoRank, 13)
            this.DrawCardsBySuit(allDiamondsNoRank, 26)
            if (this.DrawCardsBySuit(allClubsNoRank, 39)) {
                this.startX -= Coordinates.handCardOffset
            }

            primeSolidMasters[currentPoker.Rank + 39] = currentPoker.ClubsRankTotal()
        } else {//无主
            this.DrawCardsBySuit(allHeartsNoRank, 0)
            this.DrawCardsBySuit(allSpadesNoRank, 13)
            this.DrawCardsBySuit(allDiamondsNoRank, 26)
            this.DrawCardsBySuit(allClubsNoRank, 39)
        }

        primeSolidMasters[52] = currentPoker.Cards[52]
        primeSolidMasters[53] = currentPoker.Cards[53]
        if (this.DrawCardsBySuit(subSolidMasters, 0)) {
            this.startX -= Coordinates.handCardOffset
        }
        this.DrawCardsBySuit(primeSolidMasters, 0)
    }

    public DrawMySortedCardsLikeNT() {
        let currentPoker: CurrentPoker = this.mainForm.tractorPlayer.CurrentPoker
        let cardCount: number = this.mainForm.tractorPlayer.CurrentPoker.Count()
        //将临时变量清空
        //这三个临时变量记录我手中的牌的位置、大小和是否被点出
        // mainForm.myCardsLocation = new ArrayList();
        // mainForm.myCardsNumber = new ArrayList();
        this.mainForm.myCardIsReady = []

        this.destroyAllCards()
        this.startX = Coordinates.handCardPositionCenter.x - 13 * (cardCount - 1)

        var allHeartsNoRank: number[] = currentPoker.HeartsNoRank()
        this.DrawCardsBySuit(allHeartsNoRank, 0)

        var allSpadesNoRank: number[] = currentPoker.SpadesNoRank()
        this.DrawCardsBySuit(allSpadesNoRank, 13)

        var allDiamondsNoRank: number[] = currentPoker.DiamondsNoRank()
        this.DrawCardsBySuit(allDiamondsNoRank, 26)

        var allClubsNoRank: number[] = currentPoker.ClubsNoRank()
        this.DrawCardsBySuit(allClubsNoRank, 39)

        var allSolidMasters: number[] = []
        allSolidMasters[currentPoker.Rank] = currentPoker.HeartsRankTotal()
        allSolidMasters[currentPoker.Rank + 13] = currentPoker.SpadesRankTotal()
        allSolidMasters[currentPoker.Rank + 26] = currentPoker.DiamondsRankTotal()
        allSolidMasters[currentPoker.Rank + 39] = currentPoker.ClubsRankTotal()
        allSolidMasters[52] = currentPoker.Cards[52]
        allSolidMasters[53] = currentPoker.Cards[53]
        this.DrawCardsBySuit(allSolidMasters, 0)
    }

    private DrawCardsBySuit(cardsToDraw: number[], offset: number): boolean {
        let hasDrawn = false;
        for (let i = 0; i < cardsToDraw.length; i++) {
            var cardCount: number = cardsToDraw[i]
            for (let j = 0; j < cardCount; j++) {
                this.drawCard(this.startX, Coordinates.handCardPositionCenter.y, i + offset)
                this.startX += Coordinates.handCardOffset
                hasDrawn = true
            }
        }
        if (hasDrawn) this.startX += Coordinates.handCardOffset
        return hasDrawn
    }

    private DrawShowedCards(serverCardList: number[], x: number, y: number) {
        for (let i = 0; i < serverCardList.length; i++) {
            let uiCardNumber = CommonMethods.ServerToUICardMap[serverCardList[i]]
            let image = this.mainForm.gameScene.add.sprite(x, y, 'poker', uiCardNumber).setOrigin(0, 0).setInteractive();
            this.mainForm.gameScene.showedCardImages.push(image);
            x += Coordinates.handCardOffset
        }
    }

    private drawCard(x: number, y: number, serverCardNumber: number) {
        let uiCardNumber = CommonMethods.ServerToUICardMap[serverCardNumber]
        let image = this.mainForm.gameScene.add.sprite(x, y, 'poker', uiCardNumber).setOrigin(0, 0).setInteractive()
            .setData("serverCardNumber", serverCardNumber)
            .setData("cardsOrderNumber", this.mainForm.cardsOrderNumber)
        this.mainForm.gameScene.cardImages.push(image);
        image.on('pointerup', () => {
            if (this.mainForm.tractorPlayer.isObserver) return
            if (this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing ||
                this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards) {
                if (image.data === null || !image.getData("status") || image.getData("status") === "down") {
                    image.setData("status", "up");
                    image.y -= 30;
                    this.mainForm.myCardIsReady[image.getData("cardsOrderNumber")] = true
                    this.validateSelectedCards();
                } else {
                    image.setData("status", "down");
                    image.y += 30;
                    this.mainForm.myCardIsReady[image.getData("cardsOrderNumber")] = false
                    this.validateSelectedCards();
                }
            }
        });
        // if I made trump, move it up by 30px
        var trumpMadeCard = (this.mainForm.tractorPlayer.CurrentHandState.Trump - 1) * 13 + this.mainForm.tractorPlayer.CurrentHandState.Rank;
        if ((this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DistributingCards || this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DistributingCardsFinished) &&
            this.mainForm.tractorPlayer.CurrentHandState.TrumpMaker == this.mainForm.tractorPlayer.PlayerId &&
            trumpMadeCard == serverCardNumber) {
            if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker > SuitEnums.TrumpExposingPoker.SingleRank) {
                image.y -= 30
            } else {
                let lifted: boolean = false
                for (let i = 0; i < this.mainForm.gameScene.cardImages.length; i++) {
                    if ((this.mainForm.gameScene.cardImages[i] as Phaser.GameObjects.Sprite).y == y - 30) {
                        lifted = true
                        break
                    }
                }
                if (!lifted) {
                    image.y -= 30
                }
            }
        }
        if ((this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards || this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing) &&
            this.mainForm.myCardIsReady[this.mainForm.cardsOrderNumber]) {
            image.y -= 30
        }
        this.mainForm.cardsOrderNumber++
    }

    // with colorful icons if applicabl
    public reDrawToolbar() {
        this.destroyToolbar();
        //如果打无主，无需再判断
        if (this.mainForm.tractorPlayer.CurrentHandState.Rank == 53)
            return;
        var availableTrump = this.mainForm.tractorPlayer.AvailableTrumps();

        let x = Coordinates.toolbarPosition.x
        let y = Coordinates.toolbarPosition.y
        for (let i = 0; i < 5; i++) {
            let isSuiteAvailable = availableTrump.includes(i + 1)
            let suiteOffset = isSuiteAvailable ? 0 : 5;
            let image = this.mainForm.gameScene.add.sprite(x, y, 'suitsImage', i + suiteOffset).setOrigin(0, 0).setInteractive()

            if (isSuiteAvailable) {
                image.on('pointerup', () => {
                    if (this.mainForm.tractorPlayer.isObserver) return
                    let trumpExpIndex = this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker + 1
                    if (i == 4 && this.mainForm.tractorPlayer.CurrentPoker.RedJoker() == 2) trumpExpIndex = SuitEnums.TrumpExposingPoker.PairRedJoker
                    else if (this.mainForm.tractorPlayer.CurrentPoker.BlackJoker() == 2) trumpExpIndex = SuitEnums.TrumpExposingPoker.PairBlackJoker
                    this.mainForm.tractorPlayer.ExposeTrump(trumpExpIndex, i + 1);
                })
            }

            this.mainForm.gameScene.toolbarImages.push(image);
            x += Coordinates.toolbarSize
        }
    }

    public TrumpMadeCardsShow() {
        this.destroyAllShowedCards()
        if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.None) return
        let posID = this.mainForm.PlayerPosition[this.mainForm.tractorPlayer.CurrentHandState.TrumpMaker]
        if (posID == 1) return

        var trumpMadeCard = (this.mainForm.tractorPlayer.CurrentHandState.Trump - 1) * 13 + this.mainForm.tractorPlayer.CurrentHandState.Rank;
        if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.PairBlackJoker)
            trumpMadeCard = 52;
        else if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.PairRedJoker)
            trumpMadeCard = 53;

        this.DrawShowedCardsByPosition([trumpMadeCard], posID)
        if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker > SuitEnums.TrumpExposingPoker.SingleRank) {
            this.DrawShowedCardsByPosition([trumpMadeCard, trumpMadeCard], posID)
        }
    }

    public destroyToolbar() {
        this.mainForm.gameScene.toolbarImages.forEach(image => {
            image.destroy();
        })
        this.mainForm.gameScene.toolbarImages = []
    }

    public destroyAllCards() {
        this.mainForm.gameScene.cardImages.forEach(image => {
            image.destroy();
        })
        this.mainForm.gameScene.cardImages = []
    }

    public destroyAllShowedCards() {
        this.mainForm.gameScene.showedCardImages.forEach(image => {
            image.destroy();
        })
        this.mainForm.gameScene.showedCardImages = []
    }

    // drawing showed cards
    public DrawShowedCardsByPosition(cards: number[], pos: number) {
        let posInd = pos - 1
        let x = Coordinates.showedCardsPositions[posInd].x
        let y = Coordinates.showedCardsPositions[posInd].y
        let count = cards.length
        switch (posInd) {
            case 0:
                x = x - (count - 1) * Coordinates.handCardOffset / 2
                break;
            case 1:
                x = x - (count - 1) * Coordinates.handCardOffset
                break;
            case 2:
                x = x - (count - 1) * Coordinates.handCardOffset / 2
                break;
            case 3:
                break;
            default:
                break;
        }
        this.DrawShowedCards(cards, x, y)
    }

}
