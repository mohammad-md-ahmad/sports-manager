import React from 'react';
import './MainMenuLogo.scss';

import { Link } from 'react-router-dom';
import logo from './../../../assets/images/liber-logo.png';
import { Button, ListItem } from '@mui/material';

export default React.memo((props) => {

    return (
        <ListItem
            className="main-menu-logo"
        >
            <Button
                classes={{ root: "main-menu-logo-btn" }}
            >
                <Link
                    to={`${process.env.PUBLIC_URL}/`}
                    className="default-link"
                >
                    <img
                        className="main-menu-logo-img"
                        src={logo}
                        alt="Dashboard"
                    />
                </Link>
            </Button>
        </ListItem>
    );
});
