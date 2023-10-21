import React from "react";


import { useSelector } from "react-redux";
import Loader from "../common/loader";

export default function BaseComponent({ children }: { children: React.ReactNode }): React.JSX.Element {
    const loading = useSelector(state => state.loading);

    return (
        <>
            <Loader loading={loading} />
            {children}
        </>

    );
}


