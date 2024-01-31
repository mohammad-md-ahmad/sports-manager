import React, { useContext, useEffect, useState } from 'react';

import './MainMenuBottomItems.scss';


// import { Context } from '../../../../Store';

import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PersonIcon from '@mui/icons-material/Person';

import MainMenuItem from '../MainMenuItem/MainMenuItem.lazy';

// import { BROADCAST_CHANNEL, SESSION_KEYS } from '../../../../Constants';
import { IconButton, ListItem } from '@mui/material';

export default React.memo((props) => {

    //const [globalState, globalStateDispatcher] = useContext(Context);

    const logout = () => {

        // sessionStorage.removeItem(SESSION_KEYS.accessToken);
        // sessionStorage.removeItem(SESSION_KEYS.user);

        // globalStateDispatcher({
        //     user: {
        //         loggedIn: false,
        //         data: {}
        //     }
        // });

        // globalState.broadCastChannel.postMessage({
        //     'cmd': BROADCAST_CHANNEL.logoutUser
        // });
    }



    return (
        <div
            className={"main-menu-bottom-items"}
        >
            <MainMenuItem
                link="profile"
                title={"My Profile"}
                icon={
                    <PersonIcon
                        classes={{ root: "main-menu-list-item-icon" }}
                    />
                }
            />

            <ListItem
                classes={{ root: "main-menu-list-item" }}
            >
                <IconButton
                    classes={{ root: "main-menu-list-item-icon-btn", label: "main-menu-list-item-icon-label" }}
                    edge="start"
                    color="inherit"
                    onClick={() => logout()}
                >
                    <PowerSettingsNewIcon
                        classes={{ root: "main-menu-list-item-icon" }}
                    /> {"Logout"}
                </IconButton>
            </ListItem>
        </div>
    );
});
