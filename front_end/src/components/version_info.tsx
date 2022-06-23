import CardContent from '@mui/material/CardContent';
import { Container, Link } from "@mui/material";
import packageJson from '../../package.json';

export const VersionInfo = () => {
    const listItems = packageJson.versioninfo.map((number) =>
        <li>{number}</li>
    )
    return (
        <CardContent
            sx={{
                textAlign: "left",
                display: "inline-block",
            }}
        >
            <Container
                sx={{
                    fontWeight: "bold",
                }}
            >
                版本更新：
            </Container>
            <ul>
                {listItems}
            </ul>
        </CardContent>
    )
}
