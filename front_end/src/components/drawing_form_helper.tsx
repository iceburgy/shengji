
import { MainForm } from './main_form';
import { CurrentPoker } from './current_poker';
import { CommonMethods } from './common_methods';
import { SuitEnums } from './suit_enums';
import { TractorRules } from './tractor_rules';
import { ShowingCardsValidationResult } from './showing_cards_validation_result';
import { PokerHelper } from './poker_helper';
import { TrumpState } from './trump_state';
import { EmojiUtil } from './emoji_util';

const CardsReady_REQUEST = "CardsReady"

export class DrawingFormHelper {
    public mainForm: MainForm

    private startX: number = 0
    private startY: number = 0
    private handcardScale: number = 1
    private suitSequence: number
    public isDragging: any

    constructor(mf: MainForm) {
        this.mainForm = mf
        this.suitSequence = 0
    }

    public IGetCard() {
        this.DrawMySortedCardsLikeNT();
        this.reDrawToolbar();
    }

    // drawing cards without any tilt
    public ResortMyHandCards() {
        this.mainForm.myCardIsReady = []
        this.destroyAllCards()
        this.DrawHandCardsByPosition(1, this.mainForm.tractorPlayer.CurrentPoker, 1)
    }

    // drawing cards with selected cards tilted
    public DrawMyPlayingCards() {
        this.DrawScoreImageAndCards()
        this.destroyAllCards()
        this.DrawHandCardsByPosition(1, this.mainForm.tractorPlayer.CurrentPoker, 1)

        this.validateSelectedCards()
    }
    public validateSelectedCards() {
        if (this.mainForm.tractorPlayer.isObserver) return
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
                if (this.mainForm.btnPig && this.mainForm.btnPig.visible) {
                    this.mainForm.btnPig.setInteractive({ useHandCursor: true })
                    this.mainForm.btnPig.setColor('white')
                }
            }
            else if ((this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing
                && this.mainForm.tractorPlayer.CurrentTrickState.NextPlayer() == this.mainForm.tractorPlayer.PlayerId)) {
                this.mainForm.btnPig.disableInteractive()
                this.mainForm.btnPig.setColor('gray')
                this.mainForm.btnPig.setStyle({ backgroundColor: 'gray' })
            }

        }
        else if ((this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing
            && this.mainForm.tractorPlayer.CurrentTrickState.NextPlayer() == this.mainForm.tractorPlayer.PlayerId)) {
            this.mainForm.btnPig.disableInteractive()
            this.mainForm.btnPig.setColor('gray')
            this.mainForm.btnPig.setStyle({ backgroundColor: 'gray' })
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
                this.mainForm.btnPig.setInteractive({ useHandCursor: true })
                this.mainForm.btnPig.setColor('white')
            }
            else {
                this.mainForm.btnPig.disableInteractive()
                this.mainForm.btnPig.setColor('gray')
                this.mainForm.btnPig.setStyle({ backgroundColor: 'gray' })
            }
        }
    }

    // playerPos: 1-4
    public DrawHandCardsByPosition(playerPos: number, currentPoker: CurrentPoker, hcs: number) {
        this.mainForm.cardsOrderNumber = 0
        let cardCount: number = currentPoker.Count()
        let posIndex = playerPos - 1;

        this.handcardScale = hcs;
        this.startX = this.mainForm.gameScene.coordinates.handCardPositions[posIndex].x;
        if (posIndex == 0) {
            this.startX -= this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale / 2 * (cardCount - 1);
        } else if (posIndex == 1 || posIndex == 2) {
            let numOfSuits = CommonMethods.getNumOfSuits(currentPoker);
            this.startX -= (this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale * (cardCount - 1) + (numOfSuits - 1) * this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale);
        }

        this.startY = this.mainForm.gameScene.coordinates.handCardPositions[posIndex].y
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

        let didDrawMaster = false
        var primeSolidMasters: number[] = []
        if (curTrump == SuitEnums.Suit.Heart) {//红桃
            this.DrawCardsBySuit(allSpadesNoRank, 13, true)
            this.DrawCardsBySuit(allDiamondsNoRank, 26, true)
            this.DrawCardsBySuit(allClubsNoRank, 39, true)
            if (this.DrawCardsBySuit(allHeartsNoRank, 0, true)) {
                this.startX -= this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale
                didDrawMaster = true
            }

            primeSolidMasters[currentPoker.Rank] = currentPoker.HeartsRankTotal()
        } else if (curTrump == SuitEnums.Suit.Spade) {//黑桃
            this.DrawCardsBySuit(allDiamondsNoRank, 26, true)
            this.DrawCardsBySuit(allClubsNoRank, 39, true)
            this.DrawCardsBySuit(allHeartsNoRank, 0, true)
            if (this.DrawCardsBySuit(allSpadesNoRank, 13, true)) {
                this.startX -= this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale
                didDrawMaster = true
            }

            primeSolidMasters[currentPoker.Rank + 13] = currentPoker.SpadesRankTotal()
        } else if (curTrump == SuitEnums.Suit.Diamond) {//方片
            this.DrawCardsBySuit(allClubsNoRank, 39, true)
            this.DrawCardsBySuit(allHeartsNoRank, 0, true)
            this.DrawCardsBySuit(allSpadesNoRank, 13, true)
            if (this.DrawCardsBySuit(allDiamondsNoRank, 26, true)) {
                this.startX -= this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale
                didDrawMaster = true
            }

            primeSolidMasters[currentPoker.Rank + 26] = currentPoker.DiamondsRankTotal()
        } else if (curTrump == SuitEnums.Suit.Club) {//草花
            this.DrawCardsBySuit(allHeartsNoRank, 0, true)
            this.DrawCardsBySuit(allSpadesNoRank, 13, true)
            this.DrawCardsBySuit(allDiamondsNoRank, 26, true)
            if (this.DrawCardsBySuit(allClubsNoRank, 39, true)) {
                this.startX -= this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale
                didDrawMaster = true
            }

            primeSolidMasters[currentPoker.Rank + 39] = currentPoker.ClubsRankTotal()
        } else {//无主
            this.DrawCardsBySuit(allHeartsNoRank, 0, true)
            this.DrawCardsBySuit(allSpadesNoRank, 13, true)
            this.DrawCardsBySuit(allDiamondsNoRank, 26, true)
            this.DrawCardsBySuit(allClubsNoRank, 39, true)
        }

        primeSolidMasters[52] = currentPoker.Cards[52]
        primeSolidMasters[53] = currentPoker.Cards[53]
        if (this.DrawCardsBySuit(subSolidMasters, 0, !didDrawMaster)) {
            this.startX -= this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale
            didDrawMaster = true
        }
        this.DrawCardsBySuit(primeSolidMasters, 0, !didDrawMaster)
    }

    public DrawMySortedCardsLikeNT() {
        let currentPoker: CurrentPoker = this.mainForm.tractorPlayer.CurrentPoker
        let cardCount: number = this.mainForm.tractorPlayer.CurrentPoker.Count()
        //将临时变量清空
        //这三个临时变量记录我手中的牌的位置、大小和是否被点出
        // mainForm.myCardsLocation = new ArrayList();
        // mainForm.myCardsNumber = new ArrayList();

        this.destroyAllCards()
        this.startX = this.mainForm.gameScene.coordinates.handCardPositions[0].x - 13 * (cardCount - 1)
        this.startY = this.mainForm.gameScene.coordinates.handCardPositions[0].y

        var allHeartsNoRank: number[] = currentPoker.HeartsNoRank()
        this.DrawCardsBySuit(allHeartsNoRank, 0, true)

        var allSpadesNoRank: number[] = currentPoker.SpadesNoRank()
        this.DrawCardsBySuit(allSpadesNoRank, 13, true)

        var allDiamondsNoRank: number[] = currentPoker.DiamondsNoRank()
        this.DrawCardsBySuit(allDiamondsNoRank, 26, true)

        var allClubsNoRank: number[] = currentPoker.ClubsNoRank()
        this.DrawCardsBySuit(allClubsNoRank, 39, true)

        var allSolidMasters: number[] = []
        allSolidMasters[currentPoker.Rank] = currentPoker.HeartsRankTotal()
        allSolidMasters[currentPoker.Rank + 13] = currentPoker.SpadesRankTotal()
        allSolidMasters[currentPoker.Rank + 26] = currentPoker.DiamondsRankTotal()
        allSolidMasters[currentPoker.Rank + 39] = currentPoker.ClubsRankTotal()
        allSolidMasters[52] = currentPoker.Cards[52]
        allSolidMasters[53] = currentPoker.Cards[53]
        this.DrawCardsBySuit(allSolidMasters, 0, true)
    }

    private DrawCardsBySuit(cardsToDraw: number[], offset: number, resetSuitSequence: boolean): boolean {
        if (resetSuitSequence) this.suitSequence = 1;
        let hasDrawn = false;
        for (let i = 0; i < cardsToDraw.length; i++) {
            var cardCount: number = cardsToDraw[i]
            for (let j = 0; j < cardCount; j++) {
                this.drawCard(this.startX, this.startY, i + offset)
                this.startX += this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale
                hasDrawn = true
            }
        }
        if (hasDrawn) this.startX += this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale
        return hasDrawn
    }

    private DrawShowedCards(serverCardList: number[], x: number, y: number, targetImages: Phaser.GameObjects.GameObject[], scale: number) {
        for (let i = 0; i < serverCardList.length; i++) {
            let uiCardNumber = CommonMethods.ServerToUICardMap[serverCardList[i]]
            let image = this.mainForm.gameScene.add.sprite(x, y, 'poker', uiCardNumber)
                .setOrigin(0, 0)
                .setInteractive()
                .setDisplaySize(this.mainForm.gameScene.coordinates.cardWidth * scale, this.mainForm.gameScene.coordinates.cardHeight * scale)
            targetImages.push(image);
            x += this.mainForm.gameScene.coordinates.handCardOffset * scale
        }
    }

    private drawCard(x: number, y: number, serverCardNumber: number,) {
        let uiCardNumber = CommonMethods.ServerToUICardMap[serverCardNumber]
        let image = this.mainForm.gameScene.add.sprite(x, y, 'poker', uiCardNumber).setOrigin(0, 0).setInteractive()
            .setData("serverCardNumber", serverCardNumber)
            .setData("cardsOrderNumber", this.mainForm.cardsOrderNumber)
            .setScale(this.handcardScale)
        this.mainForm.gameScene.cardImages.push(image);
        this.mainForm.gameScene.input.setDraggable(image);
        let leftCenter = image.getLeftCenter()
        let seqText = this.mainForm.gameScene.add.text(leftCenter.x + 2 * this.handcardScale, leftCenter.y + 13 * this.handcardScale, this.suitSequence.toString())
            .setColor("gray")
            .setFontSize(this.mainForm.gameScene.coordinates.suitSequenceSize)
            .setScale(this.handcardScale)
        this.mainForm.gameScene.cardImageSequence.push(seqText);
        this.suitSequence++
        if (this.mainForm.gameScene.isReplayMode) return;

        if (this.mainForm.myCardIsReady[this.mainForm.cardsOrderNumber] === undefined) {
            this.mainForm.myCardIsReady[this.mainForm.cardsOrderNumber] = false
        }
        if (!this.mainForm.tractorPlayer.isObserver) {
            // left click
            image.on('dragstart', (pointer: Phaser.Input.Pointer) => {
                if (pointer.leftButtonDown()) {
                    this.handleSelectingCard(image)
                    this.isDragging = image
                }
            });
            image.on('dragend', (pointer: Phaser.Input.Pointer) => {
                this.isDragging = undefined
            });
            image.on('pointerover', (pointer: Phaser.Input.Pointer) => {
                if (this.mainForm.gameScene.yesDragSelect.toLowerCase() === "true" && pointer.leftButtonDown() && this.isDragging !== image) {
                    this.handleSelectingCard(image)
                }
            });

            // right click
            image.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
                if (pointer.rightButtonDown()) {
                    this.handleSelectingCardRightClick(image)
                }
            });
        }

        // if I made trump, move it up by 30px
        var trumpMadeCard = (this.mainForm.tractorPlayer.CurrentHandState.Trump - 1) * 13 + this.mainForm.tractorPlayer.CurrentHandState.Rank;
        if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.PairBlackJoker)
            trumpMadeCard = 52;
        else if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.PairRedJoker)
            trumpMadeCard = 53;
        if ((this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DistributingCards || this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DistributingCardsFinished) &&
            this.mainForm.tractorPlayer.CurrentHandState.TrumpMaker == this.mainForm.tractorPlayer.PlayerId &&
            trumpMadeCard == serverCardNumber) {
            if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker > SuitEnums.TrumpExposingPoker.SingleRank) {
                image.setData("status", "up");
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
                    image.setData("status", "up");
                    image.y -= 30
                }
            }
        }
        if ((this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards || this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing) &&
            this.mainForm.myCardIsReady[this.mainForm.cardsOrderNumber] &&
            (image.data === null || !image.getData("status") || image.getData("status") === "down")) {
            image.setData("status", "up");
            image.y -= 30
        }
        this.mainForm.cardsOrderNumber++
    }

    private handleSelectingCard(image: Phaser.GameObjects.Sprite) {
        if (this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing ||
            this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards) {
            if (image.data === null || !image.getData("status") || image.getData("status") === "down") {
                image.setData("status", "up");
                image.y -= 30;
                this.mainForm.myCardIsReady[image.getData("cardsOrderNumber")] = true
                this.mainForm.gameScene.sendMessageToServer(CardsReady_REQUEST, this.mainForm.tractorPlayer.MyOwnId, JSON.stringify(this.mainForm.myCardIsReady));
                this.validateSelectedCards();
            } else {
                image.setData("status", "down");
                image.y += 30;
                this.mainForm.myCardIsReady[image.getData("cardsOrderNumber")] = false
                this.mainForm.gameScene.sendMessageToServer(CardsReady_REQUEST, this.mainForm.tractorPlayer.MyOwnId, JSON.stringify(this.mainForm.myCardIsReady));
                this.validateSelectedCards();
            }
        }
    }

    private handleSelectingCardRightClick(image: Phaser.GameObjects.Sprite) {
        //统计已选中的牌张数
        let readyCount: number = 0;
        let crlength = this.mainForm.myCardIsReady.length
        for (let ri = 0; ri < crlength; ri++) {
            if (this.mainForm.myCardIsReady[ri]) readyCount++;
        }
        let showingCardsCp = new CurrentPoker();
        showingCardsCp.Trump = this.mainForm.tractorPlayer.CurrentHandState.Trump
        showingCardsCp.Rank = this.mainForm.tractorPlayer.CurrentHandState.Rank;

        let i = image.getData("cardsOrderNumber")
        let b = this.mainForm.myCardIsReady[i];
        this.mainForm.myCardIsReady[i] = !b;
        let clickedCardNumber = image.getData("serverCardNumber")
        let isClickedTrump = PokerHelper.IsTrump(clickedCardNumber, showingCardsCp.Trump, showingCardsCp.Rank);
        //响应右键的3种情况：
        //1. 首出（默认）
        let selectMoreCount = 0;
        for (let left = i - 1; left >= 0; left--) {
            let toAddImage = (this.mainForm.gameScene.cardImages[left] as Phaser.GameObjects.Sprite)
            let toAddCardNumber = toAddImage.getData("serverCardNumber")

            if (PokerHelper.GetSuit(toAddCardNumber) == PokerHelper.GetSuit(clickedCardNumber) ||
                PokerHelper.IsTrump(toAddCardNumber, showingCardsCp.Trump, showingCardsCp.Rank) && isClickedTrump) selectMoreCount++;
            else break;
        }

        let isDiscardingLast8 = this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards;
        let isFollowing = this.mainForm.tractorPlayer.CurrentTrickState.IsStarted() &&
            this.mainForm.tractorPlayer.CurrentTrickState.ShowedCards[this.mainForm.tractorPlayer.MyOwnId].length == 0 &&
            this.mainForm.tractorPlayer.CurrentTrickState.Learder !== this.mainForm.tractorPlayer.MyOwnId;
        let isLeader = !isDiscardingLast8 && !isFollowing;
        if (isDiscardingLast8) {
            //2. 埋底牌
            selectMoreCount = Math.min(selectMoreCount, 8 - 1 - readyCount);
        }
        else if (isFollowing) {
            //3. 跟出
            selectMoreCount = Math.min(selectMoreCount, this.mainForm.tractorPlayer.CurrentTrickState.LeadingCards().length - 1 - readyCount);
        }

        if (!b) {
            let cardsToDump: number[] = []
            let cardsToDumpCardNumber: number[] = []

            let maxCard = showingCardsCp.Rank == 12 ? 11 : 12;
            let selectTopToDump = !isClickedTrump && clickedCardNumber % 13 == maxCard || isClickedTrump && clickedCardNumber == 53; //如果右键点的A或者大王，且满足甩多张的条件，则向左选中所有本门合理可甩的牌
            if (isLeader && selectTopToDump) {
                let singleCardFound = false;
                for (let j = 1; j <= selectMoreCount; j++) {
                    let toAddImage = (this.mainForm.gameScene.cardImages[i - j] as Phaser.GameObjects.Sprite)
                    let toAddCardNumber = toAddImage.getData("serverCardNumber")
                    let toAddCardImageOnRightImage = (this.mainForm.gameScene.cardImages[i - j + 1] as Phaser.GameObjects.Sprite)
                    let toAddCardNumberOnRight = toAddCardImageOnRightImage.getData("serverCardNumber")
                    //如果候选牌是同一花色
                    if (!PokerHelper.IsTrump(toAddCardNumber, showingCardsCp.Trump, showingCardsCp.Rank) && !isClickedTrump && PokerHelper.GetSuit(toAddCardNumber) == PokerHelper.GetSuit(clickedCardNumber) ||
                        PokerHelper.IsTrump(toAddCardNumber, showingCardsCp.Trump, showingCardsCp.Rank) && isClickedTrump) {
                        let isSingleCard = toAddCardNumber != toAddCardNumberOnRight;
                        if (isSingleCard) {
                            if (singleCardFound) {
                                showingCardsCp.Clear();
                                break;
                            }
                            else {
                                singleCardFound = true;
                            }
                        }
                        showingCardsCp.AddCard(toAddCardNumberOnRight);
                        cardsToDump.push(i - j + 1);
                        cardsToDumpCardNumber.push(toAddCardNumberOnRight);
                        showingCardsCp.AddCard(toAddCardNumberOnRight);

                        if (!isSingleCard) {
                            cardsToDump.push(i - j);
                            cardsToDumpCardNumber.push(toAddCardNumberOnRight);
                        }

                        if (j > 1) {
                            let tractorCount = showingCardsCp.GetTractorOfAnySuit().length;
                            let needToBreak = false;
                            while (cardsToDumpCardNumber.length > 0 && !(tractorCount > 1 && tractorCount * 2 == showingCardsCp.Count())) {
                                needToBreak = true;
                                let totalCount = cardsToDumpCardNumber.length;
                                let cardNumToDel = cardsToDumpCardNumber[cardsToDumpCardNumber.length - 1];
                                showingCardsCp.RemoveCard(cardNumToDel);
                                showingCardsCp.RemoveCard(cardNumToDel);

                                cardsToDumpCardNumber.splice(totalCount - 1, 1);
                                cardsToDump.splice(totalCount - 1, 1);

                                if (cardsToDumpCardNumber.length > 0 && cardsToDumpCardNumber[totalCount - 2] == cardNumToDel) {
                                    cardsToDumpCardNumber.splice(totalCount - 2, 1);
                                    cardsToDump.splice(totalCount - 2, 1);
                                }
                            }
                            if (needToBreak) {
                                break;
                            }
                        }

                        if (!isSingleCard) {
                            j++;
                        }

                        //特殊情况处理，最后一个单张顶张进不到下个循环，须在上轮循环处理
                        if (j == selectMoreCount && !singleCardFound) {
                            let toAddCardImageOnRightImage = (this.mainForm.gameScene.cardImages[i - j] as Phaser.GameObjects.Sprite)
                            let toAddCardNumberOnRight = toAddCardImageOnRightImage.getData("serverCardNumber")
                            showingCardsCp.AddCard(toAddCardNumberOnRight);
                            showingCardsCp.AddCard(toAddCardNumberOnRight);
                            let tractorCount = showingCardsCp.GetTractorOfAnySuit().length;
                            if (tractorCount > 1 && tractorCount * 2 == showingCardsCp.Count()) {
                                cardsToDump.push(i - j);
                            }
                        }
                    }
                    else {
                        break;
                    }
                }
            }

            if (cardsToDump.length >= 2) {
                cardsToDump.forEach(c => {
                    this.mainForm.myCardIsReady[c] = !b;
                })
            }
            else {
                showingCardsCp.Clear();
                let selectAll = false; //如果右键点的散牌，则向左选中所有本门花色的牌
                for (let j = 1; j <= selectMoreCount; j++) {
                    let toAddImage = (this.mainForm.gameScene.cardImages[i - j] as Phaser.GameObjects.Sprite)
                    let toAddCardNumber = toAddImage.getData("serverCardNumber")
                    let toAddCardImageOnRightImage = (this.mainForm.gameScene.cardImages[i - j + 1] as Phaser.GameObjects.Sprite)
                    let toAddCardNumberOnRight = toAddCardImageOnRightImage.getData("serverCardNumber")
                    //如果候选牌是同一花色: 1. neither is trump, same suit; 2. both are trump
                    if (!PokerHelper.IsTrump(toAddCardNumber, showingCardsCp.Trump, showingCardsCp.Rank) && !isClickedTrump && PokerHelper.GetSuit(toAddCardNumber) == PokerHelper.GetSuit(clickedCardNumber) ||
                        PokerHelper.IsTrump(toAddCardNumber, showingCardsCp.Trump, showingCardsCp.Rank) && isClickedTrump) {
                        if (isLeader) {
                            //第一个出，候选牌为对子，拖拉机
                            if (!selectAll) {
                                showingCardsCp.AddCard(toAddCardNumberOnRight);
                                showingCardsCp.AddCard(toAddCardNumber);
                            }

                            if (showingCardsCp.Count() == 2 && (showingCardsCp.GetPairs().length == 1) || //如果是一对
                                ((showingCardsCp.GetTractorOfAnySuit().length > 1) &&
                                    showingCardsCp.Count() == showingCardsCp.GetTractorOfAnySuit().length * 2))  //如果是拖拉机
                            {
                                this.mainForm.myCardIsReady[i - j] = !b;
                                this.mainForm.myCardIsReady[i - j + 1] = !b;
                                j++;
                            }
                            else if (j == 1 || selectAll) {
                                selectAll = true;
                                this.mainForm.myCardIsReady[i - j] = !b;
                            }
                            else {
                                break;
                            }
                        }
                        else {
                            //埋底或者跟出
                            this.mainForm.myCardIsReady[i - j] = !b;
                        }
                    }
                    else {
                        break;
                    }
                }
            }
        }
        else {
            for (let j = 1; j <= i; j++) {
                let toAddImage = (this.mainForm.gameScene.cardImages[i - j] as Phaser.GameObjects.Sprite)
                let toAddCardNumber = toAddImage.getData("serverCardNumber")
                let toAddCardImageOnRightImage = (this.mainForm.gameScene.cardImages[i - j + 1] as Phaser.GameObjects.Sprite)
                let toAddCardNumberOnRight = toAddCardImageOnRightImage.getData("serverCardNumber")
                //如果候选牌是同一花色
                if (PokerHelper.GetSuit(toAddCardNumber) == PokerHelper.GetSuit(clickedCardNumber) ||
                    PokerHelper.IsTrump(toAddCardNumber, showingCardsCp.Trump, showingCardsCp.Rank) && isClickedTrump) {
                    this.mainForm.myCardIsReady[i - j] = !b;
                }
                else {
                    break;
                }
            }
        }
        this.mainForm.SelectedCards.length = 0

        for (let k = 0; k < crlength; k++) {
            let toAddImage = (this.mainForm.gameScene.cardImages[k] as Phaser.GameObjects.Sprite)
            if (this.mainForm.myCardIsReady[k]) {
                let toAddCardNumber = toAddImage.getData("serverCardNumber")
                this.mainForm.SelectedCards.push(toAddCardNumber);
                //将选定的牌向上提升 via gameScene.cardImages
                if (toAddImage.data === null || !toAddImage.getData("status") || toAddImage.getData("status") === "down") {
                    toAddImage.setData("status", "up");
                    toAddImage.y -= 30;
                }
            } else if (toAddImage.data !== null && toAddImage.getData("status") && toAddImage.getData("status") === "up") {
                toAddImage.setData("status", "down");
                toAddImage.y += 30;
            }
        }

        this.mainForm.drawingFormHelper.validateSelectedCards();
        this.mainForm.gameScene.sendMessageToServer(CardsReady_REQUEST, this.mainForm.tractorPlayer.MyOwnId, JSON.stringify(this.mainForm.myCardIsReady));
    }

    // with colorful icons if applicabl
    public reDrawToolbar() {
        this.destroyToolbar();
        //如果打无主，无需再判断
        if (this.mainForm.tractorPlayer.CurrentHandState.Rank == 53)
            return;
        var availableTrump = this.mainForm.tractorPlayer.AvailableTrumps();

        let x = this.mainForm.gameScene.coordinates.toolbarPosition.x
        let y = this.mainForm.gameScene.coordinates.toolbarPosition.y
        for (let i = 0; i < 5; i++) {
            let imagebar = this.mainForm.gameScene.add.sprite(x, y, 'suitsbarImage', i).setOrigin(0, 0).setInteractive()
            this.mainForm.gameScene.toolbarImages.push(imagebar);

            let isSuiteAvailable = availableTrump.includes(i + 1)
            let suiteOffset = isSuiteAvailable ? 0 : 5;
            let image = this.mainForm.gameScene.add.sprite(x + 10, y + 10, 'suitsImage', i + suiteOffset)
                .setOrigin(0, 0)
                .setInteractive()
                .setDisplaySize(30, 30)

            if (isSuiteAvailable && !this.mainForm.tractorPlayer.isObserver) {
                let trumpExpIndex = this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker + 1
                if (i == 4) {
                    if (this.mainForm.tractorPlayer.CurrentPoker.RedJoker() == 2) trumpExpIndex = SuitEnums.TrumpExposingPoker.PairRedJoker
                    else trumpExpIndex = SuitEnums.TrumpExposingPoker.PairBlackJoker
                }
                imagebar.on('pointerdown', () => {
                    this.mainForm.tractorPlayer.ExposeTrump(trumpExpIndex, i + 1, 0);
                })
                image.on('pointerdown', () => {
                    this.mainForm.tractorPlayer.ExposeTrump(trumpExpIndex, i + 1, 0);
                })
            }

            this.mainForm.gameScene.toolbarImages.push(image);
            x += this.mainForm.gameScene.coordinates.toolbarSize
        }
    }

    public TrumpMadeCardsShow() {
        this.destroyAllShowedCards()
        if (this.mainForm.tractorPlayer.CurrentHandState.IsNoTrumpMaker) return
        if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.None) return
        let posID = this.mainForm.PlayerPosition[this.mainForm.tractorPlayer.CurrentHandState.TrumpMaker]
        if (posID == 1) return

        var trumpMadeCard = (this.mainForm.tractorPlayer.CurrentHandState.Trump - 1) * 13 + this.mainForm.tractorPlayer.CurrentHandState.Rank;
        if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.PairBlackJoker)
            trumpMadeCard = 52;
        else if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.PairRedJoker)
            trumpMadeCard = 53;

        if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker > SuitEnums.TrumpExposingPoker.SingleRank) {
            this.DrawShowedCardsByPosition([trumpMadeCard, trumpMadeCard], posID)
        } else {
            this.DrawShowedCardsByPosition([trumpMadeCard], posID)
        }
    }

    public TrumpMadeCardsShowFromLastTrick() {
        let trumpDict: any = {}
        let lastTrumpStates: TrumpState[] = this.mainForm.tractorPlayer.CurrentHandState.LastTrumpStates

        // 如果是无人亮主，则不画
        if (lastTrumpStates.length === 1 && lastTrumpStates[0].IsNoTrumpMaker) return;

        lastTrumpStates.forEach(lastHandState => {
            let key1 = lastHandState.TrumpMaker;
            if (!Object.keys(trumpDict).includes(key1)) {
                trumpDict[key1] = {}
            }
            let val1 = trumpDict[key1];

            let key2: number = lastHandState.Trump;
            if (!Object.keys(val1).includes(key2.toString())) {
                val1[key2.toString()] = lastHandState;
            }
            let val2: TrumpState = val1[key2.toString()];
            val2.TrumpExposingPoker = Math.max(val2.TrumpExposingPoker, lastHandState.TrumpExposingPoker);
        })

        for (const [key, value] of Object.entries(trumpDict)) {
            let player = key;
            let posIndex = this.mainForm.PlayerPosition[player];
            let suitToTrumInfo: any = value;

            let allTrumpCards: number[] = []
            for (const [key, value] of Object.entries(suitToTrumInfo)) {
                let trump: number = parseInt(key);
                let trumpInfo: TrumpState = value as TrumpState;

                var trumpMadeCard = (trump - 1) * 13 + this.mainForm.tractorPlayer.CurrentHandState.Rank;

                if (trumpInfo.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.PairBlackJoker)
                    trumpMadeCard = 52;
                else if (trumpInfo.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.PairRedJoker)
                    trumpMadeCard = 53;

                let count = 1;
                if (trumpInfo.TrumpExposingPoker > SuitEnums.TrumpExposingPoker.SingleRank) {
                    count = 2;
                }
                for (let i = 0; i < count; i++) {
                    allTrumpCards.push(trumpMadeCard)
                }
            }
            this.DrawTrumpMadeCardsByPositionFromLastTrick(allTrumpCards, posIndex)
        }
    }

    public destroyToolbar() {
        this.mainForm.gameScene.toolbarImages.forEach(image => {
            image.destroy();
        })
        this.mainForm.gameScene.toolbarImages = []
    }

    public destroySidebar() {
        this.mainForm.gameScene.sidebarImages.forEach(image => {
            image.destroy();
        })
        this.mainForm.gameScene.sidebarImages = []
    }

    public destroyAllCards() {
        this.mainForm.gameScene.cardImages.forEach(image => {
            image.destroy();
        })
        this.mainForm.gameScene.cardImages = []

        this.mainForm.gameScene.cardImageSequence.forEach(image => {
            image.destroy();
        })
        this.mainForm.gameScene.cardImageSequence = []
    }

    public destroyAllShowedCards() {
        this.mainForm.gameScene.showedCardImages.forEach(image => {
            image.destroy();
        })
        this.mainForm.gameScene.showedCardImages = []

        if (this.mainForm.gameScene.OverridingFlagImage) {
            this.mainForm.gameScene.OverridingFlagImage.destroy()
        }
    }

    // drawing showed cards
    public DrawShowedCardsByPosition(cards: number[], pos: number) {
        let coords = this.getShowedCardsCoordinatesByPosition(cards.length, pos)
        this.DrawShowedCards(cards, coords.x, coords.y, this.mainForm.gameScene.showedCardImages, 1)
    }

    private getShowedCardsCoordinatesByPosition(count: number, pos: number): any {
        let posInd = pos - 1
        let x = this.mainForm.gameScene.coordinates.showedCardsPositions[posInd].x
        let y = this.mainForm.gameScene.coordinates.showedCardsPositions[posInd].y
        switch (posInd) {
            case 0:
                x = x - (count - 1) * this.mainForm.gameScene.coordinates.handCardOffset / 2
                break;
            case 1:
                x = x - (count - 1) * this.mainForm.gameScene.coordinates.handCardOffset
                break;
            case 2:
                x = x - (count - 1) * this.mainForm.gameScene.coordinates.handCardOffset / 2
                break;
            case 3:
                break;
            default:
                break;
        }
        return { x: x, y: y }
    }

    // drawing TrumpMade cards from last trick
    public DrawTrumpMadeCardsByPositionFromLastTrick(cards: number[], pos: number) {
        let coords = this.getTrumpMadeCardsCoordinatesByPosition(cards.length, pos)
        this.DrawShowedCards(cards, coords.x, coords.y, this.mainForm.gameScene.showedCardImages, this.mainForm.gameScene.coordinates.trumpMadeCardsScale)
    }

    private getTrumpMadeCardsCoordinatesByPosition(count: number, pos: number): any {
        let posInd = pos - 1
        let x = this.mainForm.gameScene.coordinates.trumpMadeCardsPositions[posInd].x
        let y = this.mainForm.gameScene.coordinates.trumpMadeCardsPositions[posInd].y
        switch (posInd) {
            case 0:
            case 1:
            case 2:
                x = x - (count - 1) * this.mainForm.gameScene.coordinates.handCardOffset * this.mainForm.gameScene.coordinates.trumpMadeCardsScale
                break;
            default:
                break;
        }
        return { x: x, y: y }
    }

    public DrawSidebarFull() {
        let isRoomFull = CommonMethods.GetPlayerCount(this.mainForm.tractorPlayer.CurrentGameState.Players) == 4
        this.destroySidebar()
        let meRank = "2"
        let opRank = "2"

        if (isRoomFull) {
            let allPlayers = this.mainForm.tractorPlayer.CurrentGameState.Players
            let meIndex = CommonMethods.GetPlayerIndexByID(allPlayers, this.mainForm.tractorPlayer.PlayerId)
            let opIndex = (meIndex + 1) % 4
            meRank = CommonMethods.GetNumberString(allPlayers[meIndex].Rank)
            opRank = CommonMethods.GetNumberString(allPlayers[opIndex].Rank)
        }

        let meStarterString = ""
        let opStarterString = ""
        let starter = this.mainForm.tractorPlayer.CurrentHandState.Starter
        if (starter) {
            let isMyTeamStarter = this.mainForm.PlayerPosition[starter] % 2 == 1
            if (isMyTeamStarter) meStarterString = `，做庄：${starter}`
            else opStarterString = `，做庄：${starter}`
        }

        let meString = `我方：${meRank}${meStarterString}`
        let opString = `对方：${opRank}${opStarterString}`

        this.mainForm.gameScene.sidebarImages.push(
            this.mainForm.gameScene.add.text(this.mainForm.gameScene.coordinates.sidebarMyTeamPostion.x, this.mainForm.gameScene.coordinates.sidebarMyTeamPostion.y, meString).setColor("orange").setFontSize(this.mainForm.gameScene.coordinates.iconSize))
        this.mainForm.gameScene.sidebarImages.push(
            this.mainForm.gameScene.add.text(this.mainForm.gameScene.coordinates.sidebarOpTeamPostion.x, this.mainForm.gameScene.coordinates.sidebarOpTeamPostion.y, opString).setColor("orange").setFontSize(this.mainForm.gameScene.coordinates.iconSize))

        let trumpMakerString = ""
        let trumpIndex = 0
        let trumpMaker = this.mainForm.tractorPlayer.CurrentHandState.TrumpMaker
        if (trumpMaker && this.mainForm.tractorPlayer.CurrentHandState.IsNoTrumpMaker) {
            trumpMakerString = "无人亮主"
        } else if (trumpMaker) {
            trumpMakerString = trumpMaker
            trumpIndex = this.mainForm.tractorPlayer.CurrentHandState.Trump
        }
        let exposerString = `亮牌：${trumpMakerString}`
        let trumpImage = this.mainForm.gameScene.add.text(this.mainForm.gameScene.coordinates.sidebarTrumpMaker.x, this.mainForm.gameScene.coordinates.sidebarTrumpMaker.y, exposerString).setColor("orange").setFontSize(this.mainForm.gameScene.coordinates.iconSize)
        this.mainForm.gameScene.sidebarImages.push(trumpImage)

        if (trumpMaker && !this.mainForm.tractorPlayer.CurrentHandState.IsNoTrumpMaker) {
            this.mainForm.gameScene.sidebarImages.push(
                this.mainForm.gameScene.add.sprite(this.mainForm.gameScene.coordinates.sidebarTrumpMaker.x + trumpImage.displayWidth + 10, this.mainForm.gameScene.coordinates.sidebarTrumpMaker.y, 'suitsImage', trumpIndex - 1 + 5)
                    .setOrigin(0, 0)
                    .setDisplaySize(20, 20))
            if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker > SuitEnums.TrumpExposingPoker.SingleRank) {
                this.mainForm.gameScene.sidebarImages.push(
                    this.mainForm.gameScene.add.sprite(this.mainForm.gameScene.coordinates.sidebarTrumpMaker.x + trumpImage.displayWidth + 10 + this.mainForm.gameScene.coordinates.iconSize, this.mainForm.gameScene.coordinates.sidebarTrumpMaker.y, 'suitsImage', trumpIndex - 1 + 5)
                        .setOrigin(0, 0)
                        .setDisplaySize(this.mainForm.gameScene.coordinates.iconSize, this.mainForm.gameScene.coordinates.iconSize))
            }
        }
    }

    public DrawFinishedSendedCards() {
        this.mainForm.tractorPlayer.destroyAllClientMessages()
        this.destroyScoreImageAndCards()
        this.destroyLast8Cards()
        this.destroyAllShowedCards()
        this.DrawFinishedScoreImage()
    }

    private DrawFinishedScoreImage() {
        //画底牌
        let posX = this.mainForm.gameScene.coordinates.last8Position.x
        let posY = this.mainForm.gameScene.coordinates.last8Position.y
        this.DrawShowedCards(this.mainForm.tractorPlayer.CurrentHandState.DiscardedCards, posX, posY, this.mainForm.gameScene.showedCardImages, 1)
        //画上分牌
        posX = this.mainForm.gameScene.coordinates.scoreCardsPosition.x
        posY = this.mainForm.gameScene.coordinates.scoreCardsPosition.y
        this.DrawShowedCards(this.mainForm.tractorPlayer.CurrentHandState.ScoreCards, posX, posY, this.mainForm.gameScene.showedCardImages, 1)

        //画得分明细
        // todo
        // lblNickName.setStyle({ fixedWidth: 300 })
        // lblNickName.setStyle({ align: 'right' })

        //上分
        let winPoints = CommonMethods.GetScoreCardsScore(this.mainForm.tractorPlayer.CurrentHandState.ScoreCards);
        posX = this.mainForm.gameScene.coordinates.winPointsPosition.x
        posY = this.mainForm.gameScene.coordinates.winPointsPosition.y
        this.mainForm.gameScene.showedCardImages.push(
            this.mainForm.gameScene.add.text(posX, posY, `上分：${winPoints}`).setColor("orange").setFontSize(this.mainForm.gameScene.coordinates.iconSize))
        //底分
        let base = this.mainForm.tractorPlayer.CurrentHandState.ScoreLast8CardsBase
        let multiplier = this.mainForm.tractorPlayer.CurrentHandState.ScoreLast8CardsMultiplier
        let last8Points = base * multiplier
        posX = this.mainForm.gameScene.coordinates.last8PointsPosition.x
        posY = this.mainForm.gameScene.coordinates.last8PointsPosition.y
        let last8PointsImage = this.mainForm.gameScene.add.text(posX, posY, `底分：${last8Points}`).setColor("orange").setFontSize(this.mainForm.gameScene.coordinates.iconSize)
        this.mainForm.gameScene.showedCardImages.push(last8PointsImage)
        //底分明细
        if (base > 0) {
            posX = this.mainForm.gameScene.coordinates.last8PointsPosition.x + last8PointsImage.displayWidth + 10
            posY = this.mainForm.gameScene.coordinates.last8PointsPosition.y
            this.mainForm.gameScene.showedCardImages.push(
                this.mainForm.gameScene.add.text(posX, posY, `【${base}x${multiplier}】`)
                    .setColor("yellow").setFontSize(this.mainForm.gameScene.coordinates.iconSize))
        }

        //罚分
        let scorePunishment = this.mainForm.tractorPlayer.CurrentHandState.ScorePunishment
        posX = this.mainForm.gameScene.coordinates.punishmentPointsPosition.x
        posY = this.mainForm.gameScene.coordinates.punishmentPointsPosition.y
        this.mainForm.gameScene.showedCardImages.push(
            this.mainForm.gameScene.add.text(posX, posY, `罚分：${scorePunishment}`).setColor("orange").setFontSize(this.mainForm.gameScene.coordinates.iconSize))
        //总得分
        let allTotal = this.mainForm.tractorPlayer.CurrentHandState.Score
        posX = this.mainForm.gameScene.coordinates.totalPointsPosition.x
        posY = this.mainForm.gameScene.coordinates.totalPointsPosition.y
        this.mainForm.gameScene.showedCardImages.push(
            this.mainForm.gameScene.add.text(posX, posY, `总分：${allTotal}`).setColor("white").setFontSize(this.mainForm.gameScene.coordinates.iconSize))
    }

    public destroyScoreImageAndCards() {
        this.mainForm.gameScene.scoreCardsImages.forEach(image => {
            image.destroy();
        })
        this.mainForm.gameScene.scoreCardsImages = []
    }

    public DrawScoreImageAndCards() {
        this.destroyScoreImageAndCards()
        //画得分图标
        let scores = this.mainForm.tractorPlayer.CurrentHandState.Score;
        this.mainForm.gameScene.scoreCardsImages.push(this.mainForm.gameScene.add.text(this.mainForm.gameScene.coordinates.sidebarScoreText.x, this.mainForm.gameScene.coordinates.sidebarScoreText.y, `上分：${scores}`).setColor("orange").setFontSize(this.mainForm.gameScene.coordinates.iconSize))
        //画得分牌，画在得分图标的下边
        let scoreCards: number[] = this.mainForm.tractorPlayer.CurrentHandState.ScoreCards
        for (let i = 0; i < scoreCards.length; i++) {
            let uiCardNumber = CommonMethods.ServerToUICardMap[scoreCards[i]]
            this.mainForm.gameScene.scoreCardsImages.push(this.mainForm.gameScene.add.sprite(this.mainForm.gameScene.coordinates.sidebarScoreCards.x + i * (this.mainForm.gameScene.coordinates.handCardOffset / 2), this.mainForm.gameScene.coordinates.sidebarScoreCards.y, 'poker', uiCardNumber)
                .setOrigin(0, 0)
                .setInteractive()
                .setDisplaySize(this.mainForm.gameScene.coordinates.cardWidth / 2, this.mainForm.gameScene.coordinates.cardHeight / 2))
        }
    }

    public destroyLast8Cards() {
        this.mainForm.gameScene.last8CardsImages.forEach(image => {
            image.destroy();
        })
        this.mainForm.gameScene.last8CardsImages = []
    }

    public DrawDiscardedCards() {
        this.destroyLast8Cards()
        let posX = this.mainForm.gameScene.coordinates.last8CardsForStarterPosition.x
        let posY = this.mainForm.gameScene.coordinates.last8CardsForStarterPosition.y
        let allCards = this.mainForm.tractorPlayer.CurrentHandState.DiscardedCards
        let count = allCards.length
        let scale = 0.5
        posX = posX - this.mainForm.gameScene.coordinates.cardWidth * scale - (count - 1) * this.mainForm.gameScene.coordinates.handCardOffset * scale
        this.DrawShowedCards(allCards, posX, posY, this.mainForm.gameScene.last8CardsImages, scale)
    }

    public DrawDiscardedCardsBackground() {
        //画8张底牌
        let last8Images: Phaser.GameObjects.Sprite[] = []
        let x = this.mainForm.gameScene.coordinates.distributingLast8Position.x
        let y = this.mainForm.gameScene.coordinates.distributingLast8Position.y
        let cardBackIndex = 54
        for (let i = 0; i < 8; i++) {
            let image = this.mainForm.gameScene.add.sprite(x, y, 'poker', cardBackIndex)
                .setOrigin(0, 0)
                .setInteractive()
            last8Images.push(image);
            x += this.mainForm.gameScene.coordinates.handCardOffset / 4
        }
        //隐藏
        setTimeout(() => {
            last8Images.forEach(image => {
                image.destroy();
            })
            last8Images.length = 0
        }, 1000);
    }

    //基于庄家相对于自己所在的位置，画庄家获得底牌的动画
    public DrawDistributingLast8Cards(position: number) {
        //画8张底牌
        let last8Images: Phaser.GameObjects.Sprite[] = []
        let x = this.mainForm.gameScene.coordinates.distributingLast8Position.x
        let y = this.mainForm.gameScene.coordinates.distributingLast8Position.y
        let cardBackIndex = 54
        for (let i = 0; i < 8; i++) {
            let image = this.mainForm.gameScene.add.sprite(x, y, 'poker', cardBackIndex)
                .setOrigin(0, 0)
                .setInteractive()
            last8Images.push(image);
            x += this.mainForm.gameScene.coordinates.handCardOffset / 4
        }
        //分发
        setTimeout(() => {
            for (let i = 0; i < 8; i++) {
                let curImage: Phaser.GameObjects.Sprite = last8Images[i]
                let pos = curImage.getTopLeft()
                let movingDir = [
                    { x: pos.x, y: pos.y },
                    { x: this.mainForm.gameScene.coordinates.screenWid - this.mainForm.gameScene.coordinates.distributingLast8MaxEdge - this.mainForm.gameScene.coordinates.cardWidth, y: pos.y },
                    { x: this.mainForm.gameScene.coordinates.screenWid * 0.5 - this.mainForm.gameScene.coordinates.cardWidth / 2, y: this.mainForm.gameScene.coordinates.distributingLast8MaxEdge },
                    { x: this.mainForm.gameScene.coordinates.distributingLast8MaxEdge, y: pos.y },
                ]
                this.mainForm.gameScene.tweens.add({
                    targets: last8Images[i],
                    x: movingDir[position - 1].x,
                    y: movingDir[position - 1].y,
                    delay: (7 - i) * 100,
                    duration: 200,
                    ease: "Cubic.easeOut"
                });
            }
        }, 200);
        //隐藏
        setTimeout(() => {
            last8Images.forEach(image => {
                image.destroy();
            })
            last8Images.length = 0
        }, 1500);
    }

    public DrawOverridingFlag(cardsCount: number, position: number, winType: number, playAnimation: boolean) {
        if (this.mainForm.tractorPlayer.CurrentRoomSetting.HideOverridingFlag) return;

        if (this.mainForm.gameScene.OverridingFlagImage) {
            this.mainForm.gameScene.OverridingFlagImage.destroy()
        }

        let posInd = position - 1
        let x = this.mainForm.gameScene.coordinates.showedCardsPositions[posInd].x
        let y = this.mainForm.gameScene.coordinates.showedCardsPositions[posInd].y
        switch (posInd) {
            case 0:
                x = x - (cardsCount - 1) * this.mainForm.gameScene.coordinates.handCardOffset / 2
                break;
            case 1:
                x = x - (cardsCount - 1) * this.mainForm.gameScene.coordinates.handCardOffset
                break;
            case 2:
                x = x - (cardsCount - 1) * this.mainForm.gameScene.coordinates.handCardOffset / 2
                break;
            case 3:
                break;
            default:
                break;
        }
        y = y + this.mainForm.gameScene.coordinates.cardHeight - this.mainForm.gameScene.coordinates.overridingFlagHeight
        let image = this.mainForm.gameScene.add.image(x, y, this.mainForm.gameScene.overridingLabelImages[winType])
            .setOrigin(0, 0)
            .setDisplaySize(this.mainForm.gameScene.coordinates.overridingFlagWidth, this.mainForm.gameScene.coordinates.overridingFlagHeight)
        this.mainForm.gameScene.OverridingFlagImage = image
        this.mainForm.gameScene.showedCardImages.push(image);

        if (playAnimation && winType >= 2) {
            this.mainForm.gameScene.decadeUICanvas.style.left = `${x}px`;
            this.mainForm.gameScene.decadeUICanvas.style.top = `${this.mainForm.gameScene.coordinates.showedCardsPositions[posInd].y - this.mainForm.gameScene.coordinates.sgsAnimOffsetY}px`;
            this.mainForm.gameScene.drawSgsAni(
                this.mainForm.gameScene.overridingLabelAnims[winType][0], this.mainForm.gameScene.overridingLabelAnims[winType][1], this.mainForm.gameScene.coordinates.sgsAnimWidth, this.mainForm.gameScene.coordinates.sgsAnimHeight);
        }
    }

    public DrawEmojiByPosition(position: number, emojiType: number, emojiIndex: number, isCenter: boolean) {
        let emojiKey = EmojiUtil.emojiTypesAndInstances[emojiType][emojiIndex]
        let posIndex = position - 1;
        let x = this.mainForm.gameScene.coordinates.playerEmojiPositions[posIndex].x;
        let y = this.mainForm.gameScene.coordinates.playerEmojiPositions[posIndex].y;
        let displaySize = this.mainForm.gameScene.coordinates.emojiSize
        if (isCenter) {
            x = this.mainForm.gameScene.coordinates.screenWid / 2;
            y = this.mainForm.gameScene.coordinates.screenHei / 2;
            displaySize *= 5;
        }
        let spriteAnimation = this.mainForm.gameScene.add.sprite(x, y, emojiKey)
            .setDisplaySize(displaySize, displaySize * EmojiUtil.emojiXToYRatio[emojiType][emojiIndex]);
        if (!isCenter) {
            spriteAnimation.setOrigin(0);
        }
        spriteAnimation.play(emojiKey);
    }

    public DrawMovingTractorByPosition(cardsCount: number, position: number) {
        let posInd = position - 1
        let height = this.mainForm.gameScene.coordinates.cardHeight - 10;
        let x = this.mainForm.gameScene.coordinates.showedCardsPositions[posInd].x;
        let y = this.mainForm.gameScene.coordinates.showedCardsPositions[posInd].y + this.mainForm.gameScene.coordinates.cardHeight - height;
        switch (posInd) {
            case 0:
                x = x - (cardsCount - 1) * this.mainForm.gameScene.coordinates.handCardOffset / 2
                break;
            case 1:
                x = x - (cardsCount - 1) * this.mainForm.gameScene.coordinates.handCardOffset
                break;
            case 2:
                x = x - (cardsCount - 1) * this.mainForm.gameScene.coordinates.handCardOffset / 2
                break;
            case 3:
                break;
            default:
                break;
        }
        let spriteAnimation = this.mainForm.gameScene.add.sprite(x, y, EmojiUtil.emMovingTractor)
            .setDisplaySize(height * EmojiUtil.emMovingTractorYToXRatio, height);
        spriteAnimation.setOrigin(0);
        spriteAnimation.play(EmojiUtil.emMovingTractor);
    }

    public DrawDanmu(msgString: string) {
        if (this.mainForm.gameScene.noDanmu.toLowerCase() === 'true') return;
        let x = this.mainForm.gameScene.coordinates.screenWid;
        let y = this.mainForm.gameScene.coordinates.danmuPositionY;
        let danmuIndex = 0;
        let danmus: Phaser.GameObjects.Text[] = (this.mainForm.gameScene.danmuMessages as Phaser.GameObjects.Text[]);
        let foundEmptyDanmu = false;
        let foundDanmu = false;
        if (danmus.length > 0) {
            for (let i = 0; i < danmus.length; i++) {
                if (danmus[i] === undefined) {
                    if (!foundEmptyDanmu) {
                        foundEmptyDanmu = true;
                        danmuIndex = i;
                    }
                } else {
                    foundDanmu = true;
                    if (!foundEmptyDanmu) danmuIndex = i + 1;
                }
            }
        }
        if (!foundDanmu) {
            this.destroyAllDanmuMessages();
        }

        y += this.mainForm.gameScene.coordinates.danmuOffset * danmuIndex;
        var lblDanmu = this.mainForm.gameScene.add.text(x, y, msgString)
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setVisible(true)
        this.mainForm.gameScene.danmuMessages[danmuIndex] = lblDanmu;

        this.mainForm.gameScene.tweens.add({
            targets: lblDanmu,
            x: 0 - lblDanmu.width,
            duration: CommonMethods.danmuDuration,
            onComplete: () => {
                this.mainForm.gameScene.danmuMessages[danmuIndex] = undefined
                lblDanmu.destroy();
            }
        });
    }

    public destroyAllDanmuMessages() {
        if (this.mainForm.gameScene.danmuMessages == null || this.mainForm.gameScene.danmuMessages.length == 0) return
        this.mainForm.gameScene.danmuMessages.forEach((msg: Phaser.GameObjects.Text) => {
            if (msg) msg.destroy();
        });
        this.mainForm.gameScene.danmuMessages = []
    }

    public resetReplay() {
        this.destroyAllCards();
        this.destroyAllShowedCards();
        this.destroyScoreImageAndCards();
        this.mainForm.tractorPlayer.destroyAllClientMessages();
    }
}
