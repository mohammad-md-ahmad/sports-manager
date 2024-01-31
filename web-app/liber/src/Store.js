import React from 'react';
import Reducer from "./Reducer";
import {
    createContext,
    useReducer,
} from "react";

export const initialGlobalState = {
    user: {
        loggedIn: true,//sessionStorage.getItem("accessToken") ? true : false,
        data: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
    },
    modal: {
        title: '',
        open: false,
        form: {
            id: '',
            name: '',
            submitCallback: '',
            openedFromMainMenu: false,
            data: {},
        }
    },
    globalLoader: {
        open: false
    },
    mainMenu: {
        activeTab: ''
    },
    notificationBar: {
        open: false,
        text: '',
        severity: ''
    },
    afterActionCallbackFunction: '',
    broadCastChannel: null
};

const Store = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialGlobalState);

    return (
        <Context.Provider
            value={[state, dispatch]}
        >
            {children}
        </Context.Provider>
    );
};

export const Context = createContext(initialGlobalState);
export default Store;
