import React, { useState } from "react";
import CardContent from '@mui/material/CardContent';
import { Container, Link } from "@mui/material";
import packageJson from '../../package.json';
import { VersionInfoList } from './version_info_list';

export const VersionInfo = () => {
    const [showOlderVersions, setShowOlderVersions] = useState(false)
    const curVersion: string = packageJson.version
    const versionInfoObj: any = packageJson.versioninfo
    const boldStyle = {
        fontWeight: "bold",
    };
    const listItemsCur = Object.keys(versionInfoObj).map((key: string) =>
        curVersion == key ? (
            <li>
                <div style={boldStyle}>
                    {key}
                </div>
                <VersionInfoList infoList={versionInfoObj[key]} />
            </li>
        ) : ""
    )
    const listItemsRest = Object.keys(versionInfoObj).map((key: string) =>
        curVersion != key ? (
            <li>
                <div style={boldStyle}>
                    {key}
                </div>
                <VersionInfoList infoList={versionInfoObj[key]} />
            </li>
        ) : ""
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
                {listItemsCur}
                <li>
                    <a href="javascript:void(0)" onClick={() => {
                        setShowOlderVersions(!showOlderVersions)
                    }}>更多更新历史记录：</a>
                    {showOlderVersions ? <ul>{listItemsRest}</ul> : ""}
                </li>
            </ul>
        </CardContent>
    )
}
