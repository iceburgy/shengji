import React from 'react';
import { render } from 'react-dom';
import CardContent from '@mui/material/CardContent';
import { Container, Link } from "@mui/material";
import packageJson from '../../package.json';

export const VersionInfoList = ({ infoList }: any) => {
    const listItems = (infoList as string[]).map((infoItem: string) =>
        <li dangerouslySetInnerHTML={{ __html: infoItem }} />
    )
    return (
        <ul>
            {listItems}
        </ul>
    )
}
