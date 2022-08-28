import CardContent from '@mui/material/CardContent';
import { Link } from "@mui/material";

export const LoginNoticeScreen = () => {
    return (
        <CardContent
            sx={{
                fontWeight: "bold",
            }}
        >
            初次访问？请点击<Link href="javascript:void(0)" onClick={() => {
                window.open('https://docs.google.com/document/d/12rgDuEzwhc8OZXU5Whygjwnqqz4xacm0BCqrLF5AsGY/edit?usp=sharing')
            }}>使用手册</Link>查看如何注册新用户<br />
            忘记用户名或密码？请点击<Link href="javascript:void(0)" onClick={() => {
                window.open('https://docs.google.com/document/d/12rgDuEzwhc8OZXU5Whygjwnqqz4xacm0BCqrLF5AsGY/edit?usp=sharing')
            }}>使用手册</Link>查看如何找回
        </CardContent>
    )
}
