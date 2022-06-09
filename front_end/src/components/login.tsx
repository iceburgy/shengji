import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { red, grey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const LoginScreen = ({ hostName, setHostName, playerName, setPlayerName, setIsSetName }: any) => {
    return (
        <Card sx={{ height: '100vh' }}>
            <CardContent sx={{ bgcolor: red[500], height: '5vh' }}>
                <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                    欢迎来到欢乐升级!
                </Typography>
            </CardContent>
            <CardContent
                sx={{
                    height: '95vh',
                    bgcolor: grey[500],
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
                        bgcolor: grey[500],
                        textAlign: "center",
                    }}
                >
                    <Button variant="contained" color="success" size="large" onClick={() => {
                        setIsSetName(true);
                        cookies.set('hostName', hostName, { path: '/' });
                        cookies.set('playerName', playerName, { path: '/' });
                    }}>进入大厅</Button>
                </CardContent>
            </CardContent>
        </Card>
    )
}
