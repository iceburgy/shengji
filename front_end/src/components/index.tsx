import React, { useState } from "react";
import { LoginScreen } from './login';
import { GameScreen } from './game';
import { GameReplay } from './game_replay';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const ShengJiApp = () => {
    const [isSetName, setIsSetName] = useState(false)
    const [isGameReplay, setIsGameReplay] = useState(false)
    const [playerName, setPlayerName] = useState(cookies.get("playerName"))
    const [nickNameOverridePass, setNickNameOverridePass] = useState(cookies.get("NickNameOverridePass"))
    const [playerEmail, setPlayerEmail] = useState("")
    const [hostName, setHostName] = useState(cookies.get("hostName"))
    const [showNotice, setShowNotice] = useState(cookies.get("showNotice"))
    return <div>
        {
            isSetName ?
                <GameScreen hostName={hostName} playerName={playerName} nickNameOverridePass={nickNameOverridePass} playerEmail={playerEmail}></GameScreen> :
                isGameReplay ?
                    <GameReplay></GameReplay> :
                    <LoginScreen
                        hostName={hostName}
                        setHostName={setHostName}
                        playerName={playerName}
                        setPlayerName={setPlayerName}
                        nickNameOverridePass={nickNameOverridePass}
                        setNickNameOverridePass={setNickNameOverridePass}
                        playerEmail={playerEmail}
                        setPlayerEmail={setPlayerEmail}
                        setIsSetName={setIsSetName}
                        showNotice={showNotice}
                        setIsGameReplay={setIsGameReplay}></LoginScreen>
        }
    </div>
}