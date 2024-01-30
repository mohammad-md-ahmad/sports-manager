import React, { useContext } from 'react';

import './MainMenu.scss';

import {
    Divider,
    Drawer,
    List
} from '@mui/material';

import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

import MainMenuItem from '../MainMenuItem/MainMenuItem.lazy';
import MainMenuLogo from '../MainMenuLogo/MainMenuLogo.lazy';
import { MAIN_MENU_TABS_NAMES } from '../../../Constants';
import MainMenuBottomItems from '../MainMenuBottomItems/MainMenuBottomItems.lazy';



export default React.memo((props) => {

    return (
        <div
            id="main-menu"
        >
            <Drawer
                variant="permanent"
                anchor="left"
                classes={{ paper: "main-menu-drawer" }}
            >
                <List
                    classes={{ root: "main-menu-list" }}
                >
                    <MainMenuLogo />
                    <Divider
                        classes={{ root: "main-menu-divider" }}
                    />
                    <MainMenuItem
                        link="home"
                        tabName={MAIN_MENU_TABS_NAMES.homePage}
                        title={"Home Page"}
                        icon={
                            <BusinessCenterIcon
                                classes={{ root: "main-menu-list-item-icon" }}
                            />
                        }
                    />
                    <MainMenuItem
                        link="aa"
                        tabName={MAIN_MENU_TABS_NAMES.homePage}
                        title={"Second Page"}
                        icon={
                            <AssignmentIcon
                                classes={{ root: "main-menu-list-item-icon" }}
                            />
                        }
                    />
                    <MainMenuItem
                        link="bb"
                        tabName={MAIN_MENU_TABS_NAMES.homePage}
                        title={"3rd Page"}
                        icon={
                            <AccessAlarmsIcon
                                classes={{ root: "main-menu-list-item-icon" }}
                            />
                        }
                    />

                    <MainMenuBottomItems />
                </List>
            </Drawer>
        </div>
    );
});
