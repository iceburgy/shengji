import { CommonMethods } from "./common_methods"
import { MainForm } from "./main_form";

// Small Game gobang State
export class SGGBState {
    public static GameName: string = "Gobang";

    public PlayerId1: string;
    public PlayerId2: string;
    public PlayerIdMoved: string;
    public PlayerIdMoving: string;
    public PlayerIdWinner: string;

    // create, join, move, quit, restart
    public GameAction: string;
    // created, joined, moved, over, restarted
    public GameStage: string;

    public LastMove: number[];
    public CurMove: number[];
    public ChessBoard: number[][];

    constructor(mf: MainForm) {
        this.PlayerId1 = "";
        this.PlayerId2 = "";
        this.PlayerIdMoved = "";
        this.PlayerIdMoving = "";
        this.PlayerIdWinner = "";
        this.GameAction = "";
        this.GameStage = "";
        this.LastMove = [-1, -1];
        this.CurMove = [-1, -1];
        this.ChessBoard = [];
    }
}
