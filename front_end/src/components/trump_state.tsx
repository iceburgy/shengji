
export class TrumpState {
    public Trump: number
    public TrumpExposingPoker: number
    public TrumpMaker: string
    constructor() {
        this.Trump = 0
        this.TrumpExposingPoker = 0
        this.TrumpMaker = ""
    }
    public CloneFrom(from: TrumpState) {
        this.Trump = from.Trump
        this.TrumpExposingPoker = from.TrumpExposingPoker
        this.TrumpMaker = from.TrumpMaker
    }
}
