import React from "react";

const Header = (props) => {
    const changeNavbarHeight = () => { 
        if (document.getElementsByClassName("navbarHead")[0].clientHeight === 70) {
            document.getElementsByClassName("navbarHead")[0].style.height = "19.3rem";
        }
        else {
            document.getElementsByClassName("navbarHead")[0].style.height = "7rem";
        }
    }

    return (
        <>
            <div className="headerPart">
                <div className="headerTextDiv">
                    <div className="tempDivForDesign">
                        <h1 className="headerName"><span className="subHeaderName" style={{ color: 'red', fontSize: '125%' }}>VARt</span>{props.headerName}</h1>
                    </div>
                </div>
                <div className="headerBackground"></div>
                <div onClick={() => changeNavbarHeight()} className="newTempDivForDesign"><i className="fa fa-bars" aria-hidden="true"></i></div>
            </div>
        </>
    )
}
export default Header;