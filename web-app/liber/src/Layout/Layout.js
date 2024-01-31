import { Outlet, Link } from "react-router-dom";
import MainMenu from "../components/Menu/MainMenu/MainMenu.lazy";
import Login from "../pages/Login/Login.lazy";
import { Context } from "../Store";
import { useContext } from "react";

const Layout = () => {
    const [globalState, globalStateDispatcher] = useContext(Context);
    return (
        <>
            {
                globalState?.user?.loggedIn ?
                    <>
                        <MainMenu />
                        <Outlet />
                    </>
                    :
                    <Login />
            }

        </>
    )
};

export default Layout;