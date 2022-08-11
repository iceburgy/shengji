import { CommonMethods } from "./common_methods"
import { MainForm } from "./main_form";
import { SGCSBomb } from "./sg_cs_bomb";
import { SGCSDude } from "./sg_cs_dude";
import { SGCSStar } from "./sg_cs_star";

// Small Game Collect Star State
export class SGCSState {
    public PlayerId: string;
    public IsGameOver: boolean;
    public Score: number = 0;
    public Stage: number = -1;
    public ScoreHigh: number = 0;
    public StageHigh: number = 1;
    public ScreenshotHigh: any;
    public Dudes: SGCSDude[];
    public Stars: SGCSStar[];
    public Bombs: SGCSBomb[];

    constructor(mf: MainForm) {
        this.PlayerId = mf.tractorPlayer.MyOwnId;
        this.IsGameOver = false;
        this.Dudes = [];
        this.Stars = [];
        this.Bombs = [];
    }
}
