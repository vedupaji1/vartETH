import React from "react";
import { useState, useRef } from "react";
import { ethers } from "ethers";
import Loading from "./Loading";
import { Link } from "react-router-dom";


const Login = () => {
    const [infoMistakes, setInfoMistakes] = useState("No Mistakes"); // This State Wil Contains Mistake Message.
    const isLoading = useRef(false);

    const changeElemData = (message, isProcessing) => { // This Function Will Actually Change Properties Or Styling Of "Mistake Shower Div".
        setInfoMistakes(message)
        if (isProcessing === true) {
            document.getElementsByClassName("mistakeShower")[0].style = `margin-top:1rem;margin-bottom:1rem;width:100%;color:#3c3c3c;background-color:#d1ffd1;`;
        } else {
            document.getElementsByClassName("mistakeShower")[0].style = `margin-top:1rem;margin-bottom:1rem;width:100%;color:red;background-color:#ffd0d0;`;
        }
    }

    const checkInfo = () => {
        return new Promise((res, rej) => {
            const authData = document.getElementsByClassName("takeInfoBlock")[0].value
            if (authData === "" || document.getElementsByClassName("takeInfoBlock")[1].value === "") {
                changeElemData("Please Fill Add Details", false)
                res(false)
            } else if (((ethers.utils.isAddress(authData) === true) || (authData.indexOf("@") !== -1) || (authData.length < 35))) {
                res(true)
            } else {
                changeElemData("Invalid Details", false)
                res(false)
            }
        })
    }

    const sendInfo = async () => {
        if (await checkInfo() === true) {
            let authData = document.getElementsByClassName("takeInfoBlock")[0].value;
            let password = document.getElementsByClassName("takeInfoBlock")[1].value;
            isLoading.current = true;
            changeElemData("Wait....", true);

            const requestOptions = {
                method: 'POST',
                credentials: "include", // Remove Or Comment Out In Deployment.
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    authData: authData,
                    password: password
                })
            };
            let response = await fetch('/login', requestOptions) // Remove "http://localhost:8000" In Deployment. 
            let data = await response.json();
            isLoading.current = false;

            if (data.isValid === true) {
                changeElemData("Done", true);
                window.location.reload(true);
            }
            else {
                changeElemData(data.message, false);
            }
        }
    }
    return (
        <>
            <>
                <div className="mainDiv">
                    <div className="mainFormContainer">
                        <div className="subFormContainer">
                            <div className="formContainerHeading ">Login</div>
                            <div className="mistakeShower">
                                {infoMistakes}
                            </div>
                            <div style={{ margin: "0rem 1rem 0rem 1rem" }} id="dataTakerBlock1" className="dataShowerInfoBlock">
                                <input style={{ paddingLeft: "3rem" }} type="text" placeholder="Username, Email, Or Address" className="takeInfoBlock" />
                            </div>
                            <div style={{ margin: "2rem 1rem 0rem 1rem" }} id="dataTakerBlock1" className="dataShowerInfoBlock">
                                <input style={{ paddingLeft: "3rem" }} type="password" placeholder="Password, Or Private Key" className="takeInfoBlock" />
                            </div>

                            <div className="submitBTNMain" style={{ display: "flex", justifyContent: "center" }}>
                                <div onClick={() => sendInfo()} className="submitBTN">
                                    Submit
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "1.3rem", fontFamily: "'Source Sans Pro', sans-serif" }}>
                            <Link style={{ textDecoration: "none", color: "white" }} to="/signup">Create New Account</Link>
                        </div>
                    </div>
                </div>
            </>
            {
                isLoading.current === true ? <Loading /> : <></>
            }
        </>
    )
}

export default Login;