import React, { useContext } from 'react';
import './MainMenuItem.scss';
import { Link } from 'react-router-dom';
import { IconButton, ListItem } from '@mui/material';
import { Context } from '../../../Store';

export default React.memo((props) => {

    const [globalState,] = useContext(Context);

    return (
        <ListItem
            classes={{ root: "main-menu-list-item" + (globalState?.mainMenu?.activeTab === props?.tabName ? " active" : "") }}
        >
            <IconButton
                classes={{ root: "main-menu-list-item-icon-btn", label: "main-menu-list-item-icon-label" }}
                edge="start"
                color="inherit"
            >
                <Link
                    to={`${process.env.PUBLIC_URL}/${props?.link}`}
                    className={"main-menu-list-item-link default-link" + (globalState?.mainMenu?.activeTab === props?.tabName ? " active" : "")}
                >
                    {props?.icon} {props?.title}
                </Link>
            </IconButton>
        </ListItem>
    );
});
