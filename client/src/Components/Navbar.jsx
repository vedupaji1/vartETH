import React from "react";
import { Link } from 'react-router-dom'; //Importing React Router For Routing
import { useContext } from "react";
import { IsNavActive } from '../App';


const changeStyleOnOver = (index) => {
    let pp = `font-size: 2.06rem;margin-right: 0;
    background-color: #20232a;
    color: #61dafb;`;
    document.getElementsByTagName("li")[index].style = pp;
}
const changeStyleOnOut = (index) => {
    let pp;
    if (index === 1) {
        pp = `font-size: 1.8rem;
        margin-right: 1.1rem;
        background-color: white;
        color: black;`;
    }
    else {
        pp = `font-size: 1.8rem;
        margin-right: 1rem;
        background-color: white;
        color: black;`;
    }
    document.getElementsByTagName("li")[index].style = pp;
}
const Navbar = () => {
    const dataForLink = useContext(IsNavActive)

    return (
        <>
            <div className="navbarHead">
                <div className="navbarHeadChild">
                    <div className="navbarlists">
                        <ul>
                            <Link to={dataForLink.isActive === true ? "/" : "/addWork"} ><li onMouseOver={() => changeStyleOnOver(0)} onMouseOut={() => changeStyleOnOut(0)} >My Work</li></Link>
                            <Link to="/addWork"><li style={{ marginRight: '1.1rem' }} onMouseOver={() => changeStyleOnOver(1)} onMouseOut={() => changeStyleOnOut(1)} >Add Work</li></Link>
                            <Link to="/user"><li onMouseOver={() => changeStyleOnOver(2)} onMouseOut={() => changeStyleOnOut(2)}>User</li></Link>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Navbar;
export { changeStyleOnOver, changeStyleOnOut }

