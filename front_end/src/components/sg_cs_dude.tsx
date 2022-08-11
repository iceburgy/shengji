import { CommonMethods } from "./common_methods"

// Small Game Collect Star dude
// coordinates are relative to the top left corner of small game frame 800x600
export class SGCSDude {
    public static TintColors: string[] = ["", "green", "orange", "yellow"];

    public PlayerId: string = "";
    public X: number;
    public Y: number;
    public Bounce: number = 0.2;
    public Score: number = 0;
    public Tint: string = "";
    public Enabled: boolean = false;
    constructor() {
        this.X = -1;
        this.Y = -1;
    }
}
