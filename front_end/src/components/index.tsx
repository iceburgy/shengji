import React, { useState } from "react";
import { LoginScreen } from './login';
import { GameScreen } from './game'

export const ShengJiApp = () => {
    const [isSetName, setIsSetName] = useState(false)    
    const [playerName, setPlayerName] = useState("")
    const [hostName, setHostName] = useState("")
    return <div>
        {
            isSetName ? <GameScreen hostName={hostName} playerName={playerName}></GameScreen> : <LoginScreen hostName={hostName} setHostName={setHostName} playerName={playerName} setPlayerName={setPlayerName} setIsSetName={setIsSetName}></LoginScreen>
        }
    </div>
}