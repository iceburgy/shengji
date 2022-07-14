import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { red, grey, lightGreen } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Cookies from 'universal-cookie';
import { Link } from "@mui/material";
import { LoginNoticeScreen } from './login_notice';
import { VersionInfo } from './version_info';
import packageJson from '../../package.json';

const cookies = new Cookies();
const gotNewVersion = packageJson.version !== cookies.get('appVersion')

export const LoginScreen = ({ hostName, setHostName, playerName, setPlayerName, setIsSetName, showNotice, setIsGameReplay }: any) => {
    if (gotNewVersion) {
        cookies.set('appVersion', packageJson.version, { path: '/' })
    }
    const greyDegree = 400
    return (
        <Card sx={{ height: '100vh', overflow: "auto", bgcolor: grey[greyDegree], }}>
            <CardContent sx={{ bgcolor: grey[700], height: '3em', textAlign: "center" }}>
                <Typography sx={{ fontSize: 20 }} color="white" gutterBottom>
                    欢迎来到西村升级小馆！<br />
                    当前版本：{packageJson.version}
                </Typography>
            </CardContent>
            <CardContent
                sx={{
                    height: '95vh',
                    bgcolor: grey[greyDegree],
                    textAlign: "center",
                }}
            >
                <TextField
                    label="服务器地址或者访问密钥"
                    color="error"
                    margin='normal'
                    value={hostName}
                    onChange={e => {
                        setHostName(e.target.value)
                    }}
                    sx={{
                        fontSize: "40"
                    }}
                />
                <TextField
                    label="请输入一个昵称"
                    color="error"
                    margin='normal'
                    value={playerName}
                    onChange={e => {
                        setPlayerName(e.target.value)
                    }}
                    sx={{
                        fontSize: "40"
                    }}
                />
                <CardContent
                    sx={{
                        bgcolor: grey[greyDegree],
                        textAlign: "center",
                    }}
                >
                    <Button variant="contained" color="success" size="large" onClick={() => {
                        setIsSetName(true);
                        cookies.set('hostName', hostName, { path: '/' });
                        cookies.set('playerName', playerName, { path: '/' });
                    }}>进入大厅</Button>
                </CardContent>
                <CardContent
                    sx={{
                        bgcolor: grey[greyDegree],
                        textAlign: "center",
                    }}
                >
                    <Button variant="contained" color="success" size="large" onClick={() => {
                        setIsGameReplay(true);
                    }}>录像回放</Button>
                </CardContent>
                <CardContent
                    sx={{
                        textAlign: "center",
                    }}
                >
                    <div dangerouslySetInnerHTML={{ __html: "<b>重要通知：</b>之前按照<a href=\"javascript:void(0)\" onclick=\"javascript:{window.open('https://bit.ly/chromstep')}\">此图解</a>修改过‘insecure content’浏览器设置的用户，请将此设置还原。" }} />
                </CardContent>
                {showNotice === 'none' ? '' : <LoginNoticeScreen />}
                {gotNewVersion ? <VersionInfo /> : ''}
            </CardContent>
        </Card>
    )
}
