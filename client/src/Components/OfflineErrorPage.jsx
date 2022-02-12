import React from "react";
import { changeStyleOnOver, changeStyleOnOut } from "./Navbar";
let errorTextStyle = {
    backgroundColor: '#ffdbdb',
    color: 'red',
    padding: '0rem 1rem',
    borderRadius: '0.4rem'
}
const OfflineErrorPage = () => {
    return (
        <>
            <div className="navbarHead">
                <div className="navbarHeadChild">
                    <div className="navbarlists">
                        <ul>
                            <li onMouseOver={() => changeStyleOnOver(0)} onMouseOut={() => changeStyleOnOut(0)} >My Work</li>
                            <li style={{ marginRight: '1.1rem' }} onMouseOver={() => changeStyleOnOver(1)} onMouseOut={() => changeStyleOnOut(1)} >Add Work</li>
                            <li onMouseOver={() => changeStyleOnOver(2)} onMouseOut={() => changeStyleOnOut(2)}>User</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mainBodyDiv">
                <div style={{ marginBottom: '5rem' }} className="bodyDiv">
                    <img className="offlineSvg" src={sessionStorage.getItem('errorImage') === null ? "./noSignal.svg" : sessionStorage.getItem('errorImage')} alt="Offline" />
                    <div></div>
                    <div className="errorDiv">
                        <div className="errorText">You Are <span style={errorTextStyle}>Offline</span></div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default OfflineErrorPage;