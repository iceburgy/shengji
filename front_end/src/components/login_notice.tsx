import CardContent from '@mui/material/CardContent';
import { Link } from "@mui/material";

export const LoginNoticeScreen = () => {
    return (
        <CardContent
            sx={{
                fontWeight: "bold",
            }}
        >
            访问密钥已变更，请点击<Link href="#" onClick={() => {
                window.open('https://docs.google.com/document/d/12rgDuEzwhc8OZXU5Whygjwnqqz4xacm0BCqrLF5AsGY/edit?usp=sharing')
            }}>此链接</Link>获取最新访问密钥
        </CardContent>
    )
}
