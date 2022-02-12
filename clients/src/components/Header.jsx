import React, { useContext } from "react";
import metamaskLogo from ".././icons/metamaskLogo.png";
import { loginData } from ".././App";
import { useLocation, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
const Header = () => {
    const location = useLocation();
    const history = useHistory();
    const contextData = useContext(loginData);
    console.log(contextData)

    const logout = async (isLogout) => {
        let response = await fetch('/logout', { credentials: "include" })
        let data = await response.json() // Provides JSON Data   
        if (isLogout === true) {
            history.push("/login");
        }
        window.location.reload(true);
    }
    return (
        <>
            <div className="headerMainTop">
                <div className="headerSub">
                    <h1 className="mainTitle"><span style={{ cursor: "pointer" }}>VARt</span> <span className="subTitle">Eth</span></h1>
                </div>
                {
                    location.pathname === "/" ?
                        <div className="operationDiv">
                            {
                                contextData.isMetamask === true && contextData.isLogin === true ?
                                    <div className="operationBtn1">
                                        <img onClick={() => logout(false)} src={metamaskLogo} alt="Metamask" />
                                    </div> :
                                    <></>
                            }
                            {
                                contextData.isLogin === true ?
                                    <div className="operationBtn2">
                                        <i onClick={() => logout(true)} className="fa fa-sign-out" aria-hidden="true"></i>
                                    </div> :
                                    <div className="operationBtn2">
                                        <Link style={{ textDecoration: "none", color: "inherit" }} to="/login"><i className="fa fa-sign-in" aria-hidden="true"></i></Link>
                                    </div>
                            }
                        </div> :
                        <></>
                }
            </div>
        </>
    )
}
export default Header;