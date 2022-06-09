import React, { useState } from "react";
import { LoginScreen } from './login';
import { GameScreen } from './game'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const ShengJiApp = () => {
    const [isSetName, setIsSetName] = useState(false)    
    const [playerName, setPlayerName] = useState(cookies.get("playerName"))
    const [hostName, setHostName] = useState(cookies.get("hostName"))
    return <div>
        {
            isSetName ? <GameScreen hostName={hostName} playerName={playerName}></GameScreen> : <LoginScreen hostName={hostName} setHostName={setHostName} playerName={playerName} setPlayerName={setPlayerName} setIsSetName={setIsSetName}></LoginScreen>
        }
    </div>
}