import React, {
    useState,
    useContext,
    useEffect
} from 'react';

import {
    BrowserRouter,
    Route,
    Routes,
} from 'react-router-dom';
import Home from '../../pages/Home/Home';
import NotFound from '../../pages/NotFound/NotFound';
import { BROADCAST_CHANNEL, SESSION_KEYS } from '../../Constants';
import { Context, initialGlobalState } from '../../Store';
import Layout from '../../Layout/Layout';


export default () => {
    const [globalState, globalStateDispatcher] = useContext(Context);

    useEffect(() => {
        var bcChannel = new BroadcastChannel(BROADCAST_CHANNEL.channelName);

        globalStateDispatcher({ broadCastChannel: bcChannel });

        // if accessToken is not set, ask the other tabs to share you the accessToken & other data
        if (sessionStorage.getItem(SESSION_KEYS.accessToken) === null || sessionStorage.getItem(SESSION_KEYS.accessToken).length <= 0) {
            bcChannel.postMessage({
                'cmd': BROADCAST_CHANNEL.requestUserAuthenticationData
            });
        }

        bcChannel.onmessage = (e) => {

            if (e.data.cmd === BROADCAST_CHANNEL.logoutUser) {
                deAuthenticateUser()
            }
            if (e.data.cmd === BROADCAST_CHANNEL.requestUserAuthenticationData) {
                sendUserAuthenticationData(bcChannel);
            } else if (e.data.cmd === BROADCAST_CHANNEL.responseUserAuthenticationData) {
                recieveUserAuthenticationData(e.data.data);
            }
        }
    }, []);

    const deAuthenticateUser = () => {
        sessionStorage.removeItem(SESSION_KEYS.accessToken);
        sessionStorage.removeItem(SESSION_KEYS.user);

        globalStateDispatcher({
            user: {
                ...initialGlobalState.user,
                loggedIn: false,
                data: null
            }
        });
    }

    const recieveUserAuthenticationData = (data) => {
        if (data[SESSION_KEYS.accessToken] == null || data[SESSION_KEYS.accessToken] === 'null') {
            return false;
        }

        sessionStorage.setItem(SESSION_KEYS.accessToken, data[SESSION_KEYS.accessToken]);
        sessionStorage.setItem(SESSION_KEYS.user, data[SESSION_KEYS.user]);

        globalStateDispatcher({
            user: {
                ...globalState?.user,
                loggedIn: true,
                data: JSON.parse(data[SESSION_KEYS.user])
            }
        });
    }

    const sendUserAuthenticationData = (bcChannel) => {
        bcChannel.postMessage({
            cmd: BROADCAST_CHANNEL.responseUserAuthenticationData,
            data: {
                [SESSION_KEYS.accessToken]: sessionStorage.getItem(SESSION_KEYS.accessToken),
                [SESSION_KEYS.refreshToken]: sessionStorage.getItem(SESSION_KEYS.refreshToken),
                [SESSION_KEYS.user]: sessionStorage.getItem(SESSION_KEYS.user),
            }
        });
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="home" element={<Home />} />

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
