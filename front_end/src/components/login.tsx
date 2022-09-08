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
import { CommonMethods } from "./common_methods";

const cookies = new Cookies();

export const LoginScreen = ({ hostName, setHostName, playerName, setPlayerName, nickNameOverridePass, setNickNameOverridePass, playerEmail, setPlayerEmail, setIsSetName, showNotice, setIsGameReplay }: any) => {
    let gotNewVersion = packageJson.version !== cookies.get('appVersion')
    if (gotNewVersion) {
        cookies.set('appVersion', packageJson.version, { path: '/', expires: CommonMethods.GetCookieExpires() })
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
                    label="访问密钥"
                    color="error"
                    margin='normal'
                    value={hostName}
                    onChange={e => {
                        setHostName(e.target.value.trim())
                    }}
                    sx={{
                        fontSize: "40"
                    }}
                />
                <TextField
                    label="用户名-不超过10个字符"
                    color="error"
                    margin='normal'
                    value={playerName}
                    onChange={e => {
                        setPlayerName(e.target.value.trim())
                    }}
                    sx={{
                        fontSize: "40"
                    }}
                />
                <TextField
                    label="密码"
                    color="error"
                    margin='normal'
                    type="password"
                    value={nickNameOverridePass}
                    onChange={e => {
                        setNickNameOverridePass(e.target.value.trim())
                    }}
                    sx={{
                        fontSize: "40"
                    }}
                />
                <TextField
                    label="邮箱-正常登录时无需填写"
                    color="error"
                    margin='normal'
                    value={playerEmail}
                    onChange={e => {
                        setPlayerEmail(e.target.value.trim())
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
                    <Button disabled={!(hostName !== undefined && hostName.trim() &&
                        (!(playerName !== undefined && playerName.trim()) && !(nickNameOverridePass !== undefined && nickNameOverridePass.trim()) && playerEmail !== undefined && playerEmail.trim() ||
                            playerName !== undefined && playerName.trim() && playerName.trim().length <= 10 && ![CommonMethods.kongwei, CommonMethods.zuoxia].includes(playerName.trim()) && !(nickNameOverridePass !== undefined && nickNameOverridePass.trim()) && playerEmail !== undefined && playerEmail.trim() ||
                            playerName !== undefined && playerName.trim() && playerName.trim().length <= 10 && ![CommonMethods.kongwei, CommonMethods.zuoxia].includes(playerName.trim()) && nickNameOverridePass !== undefined && nickNameOverridePass.trim() && playerEmail !== undefined && playerEmail.trim() ||
                            playerName !== undefined && playerName.trim() && playerName.trim().length <= 10 && ![CommonMethods.kongwei, CommonMethods.zuoxia].includes(playerName.trim()) && nickNameOverridePass !== undefined && nickNameOverridePass.trim() && !(playerEmail !== undefined && playerEmail.trim())
                        ))} variant="contained" color="success" size="large" onClick={() => {
                            setIsSetName(true);
                            cookies.set('hostName', hostName, { path: '/', expires: CommonMethods.GetCookieExpires() });
                            cookies.set('playerName', playerName, { path: '/', expires: CommonMethods.GetCookieExpires() });
                            cookies.set('NickNameOverridePass', nickNameOverridePass, { path: '/', expires: CommonMethods.GetCookieExpires() });
                        }}>{hostName !== undefined && hostName.trim() && !(playerName !== undefined && playerName.trim()) && !(nickNameOverridePass !== undefined && nickNameOverridePass.trim()) && playerEmail !== undefined && playerEmail.trim() ?
                            "找回用户名" :
                            hostName !== undefined && hostName.trim() && playerName !== undefined && playerName.trim() && !(nickNameOverridePass !== undefined && nickNameOverridePass.trim()) && playerEmail !== undefined && playerEmail.trim() ?
                                "找回密码" :
                                hostName !== undefined && hostName.trim() && playerName !== undefined && playerName.trim() && nickNameOverridePass !== undefined && nickNameOverridePass.trim() && playerEmail !== undefined && playerEmail.trim() ?
                                    "注册新用户" :
                                    "进入大厅"}</Button>
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
                <LoginNoticeScreen />
                <VersionInfo />
                {gotNewVersion ? alert(`检测到新版本【${packageJson.version}】：${(packageJson.versioninfo as any)[packageJson.version]}`) : ""}
            </CardContent>
        </Card>
    )
}
