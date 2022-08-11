import { CommonMethods } from "./common_methods"

// Small Game Collect Star Player
export class SGCSPlayer {
    public static SgcsPlayerUpdated_REQUEST = "SgcsPlayerUpdated"

    public PlayerId: string
    public PlayerIndex: number
    public leftKeyPressed: boolean
    public rightKeyPressed: boolean
    public upKeyPressed: boolean
    constructor(pid:string) {
        this.PlayerId = pid;
        this.PlayerIndex = -1;
        this.leftKeyPressed = false;
        this.rightKeyPressed = false;
        this.upKeyPressed = false;
    }

    public PressLeftKey() {
        this.leftKeyPressed = true;
        this.rightKeyPressed = false;
        this.upKeyPressed = false;
    }

    public PressRightKey() {
        this.leftKeyPressed = false;
        this.rightKeyPressed = true;
        this.upKeyPressed = false;
    }

    public PressUpKey() {
        this.leftKeyPressed = false;
        this.rightKeyPressed = false;
        this.upKeyPressed = true;
    }

    public ReleaseLeftOrRightKey() {
        this.leftKeyPressed = false;
        this.rightKeyPressed = false;
        this.upKeyPressed = false;
    }
}
