import CardContent from '@mui/material/CardContent';
import { Link } from "@mui/material";

export const LoginNoticeScreen = () => {
    return (
        <CardContent
            sx={{
                fontWeight: "bold",
            }}
        >
            <h1>重要公告</h1>
            <p>线上拖拉机app现已全面更新，欢迎大家访问<Link href="javascript:void(0)" onClick={() => {
                window.open('https://bit.ly/tljapp')
            }}>新版网址</Link><br/>
            主要功能更新：UI自适应；大幅降低对系统资源的消耗<br/>
            详情可在下方“版本更新”记录中查看<br/>
            另外，自即日起此旧版将停止更新
            </p>
            初次访问？请点击<Link href="javascript:void(0)" onClick={() => {
                window.open('https://docs.google.com/document/d/12rgDuEzwhc8OZXU5Whygjwnqqz4xacm0BCqrLF5AsGY/edit?usp=sharing')
            }}>使用手册</Link>查看如何注册新用户<br />
            忘记用户名或密码？请点击<Link href="javascript:void(0)" onClick={() => {
                window.open('https://docs.google.com/document/d/12rgDuEzwhc8OZXU5Whygjwnqqz4xacm0BCqrLF5AsGY/edit?usp=sharing')
            }}>使用手册</Link>查看如何找回
        </CardContent>
    )
}
