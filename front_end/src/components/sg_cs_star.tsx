import { CommonMethods } from "./common_methods"

// Small Game Collect Star star
// coordinates are relative to the top left corner of small game frame 800x600
export class SGCSStar {
    public X: number;
    public Y: number;
    public Bounce: number;
    public Enabled: boolean;
    constructor() {
        this.X = 0;
        this.Y = 0;
        this.Bounce = 0;
        this.Enabled = false;
    }
}
