
import { PlayerEntity } from './player_entity';
import { CommonMethods } from './common_methods';
export class GameState {
    public Players: PlayerEntity[]
    public PlayerToIP: {}
    public startNextHandStarter: PlayerEntity
    constructor() {
        this.Players = []
        this.PlayerToIP = {}
        this.startNextHandStarter = new PlayerEntity()
    }

    public CloneFrom(from: GameState) {
        this.Players = new Array(4)
        this.PlayerToIP = {}
        this.startNextHandStarter = new PlayerEntity()
        for (let i = 0; i < from.Players.length; i++) {
            var p = from.Players[i]
            if (p == undefined || p == null) continue
            this.Players[i] = new PlayerEntity()
            this.Players[i].CloneFrom(p)
        }
        this.PlayerToIP = { ...from.PlayerToIP };
        if (from.startNextHandStarter != undefined) this.startNextHandStarter.CloneFrom(from.startNextHandStarter)
    }
}