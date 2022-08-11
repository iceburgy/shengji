import { CommonMethods } from "./common_methods"

// Small Game Collect Star bomb
// coordinates are relative to the top left corner of small game frame 800x600
export class SGCSBomb {
    public X: number;
    public Y: number;
    public VelX: number;

    constructor() {
        this.X = 0;
        this.Y = 0;
        this.VelX = 0;
    }
}
