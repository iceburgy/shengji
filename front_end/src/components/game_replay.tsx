import { useEffect } from "react";
import Phaser from "phaser"
import { GameReplayScene } from './game_replay_scene';

export const GameReplay = () => {
    useEffect(() => {
        const screenWidth = document.documentElement.clientWidth;
        const screenHeight = document.documentElement.clientHeight;
        const gameReplayScence = new GameReplayScene()
        const config = {
            type: Phaser.AUTO,
            width: screenWidth,
            height: screenHeight,
            parent: 'phaser-example-gamereplay',
            scene: [gameReplayScence],
            audio: {
                disableWebAudio: true
            },
            dom: {
                createContainer: true
            }
        };
        new Phaser.Game(config);
    }, [])

    return (
        <div id="phaser-example-gamereplay"></div>
    )
}