import { useEffect } from "react";
import Phaser from "phaser"
import { GameScene } from './game_scene';

interface GameScreenProps {
    hostName: string
    playerName: string
    nickNameOverridePass: string
    playerEmail: string
}

export const GameScreen = ({ hostName, playerName, nickNameOverridePass, playerEmail }: GameScreenProps) => {
    useEffect(() => {
        const screenWidth = document.documentElement.clientWidth;
        const screenHeight = document.documentElement.clientHeight;
        const gameScence = new GameScene(hostName, playerName, nickNameOverridePass, playerEmail)
        const config = {
            type: Phaser.AUTO,
            width: screenWidth,
            height: screenHeight,
            parent: 'phaser-example',
            scene: [gameScence],
            audio: {
                disableWebAudio: true
            },
            dom: {
                createContainer: true
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: false
                }
            }
        };
        new Phaser.Game(config);
    }, [])

    return (
        <div id="phaser-example"></div>
    )
}