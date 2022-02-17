import React from "react";
import { useState, useRef } from "react";
import Loading from "../Loading";
import { Link } from "react-router-dom";
import FileSaver from 'file-saver'; // This Is Used For Automatically Download Text File Containing UserData In User Device.

const Signup = () => {
    const isOTPCheck = useRef(false);
    const [infoMistakes, setInfoMistakes] = useState("No Mistakes");
    const isLoading = useRef(false);

    const changeElemData = (message, isProcessing) => {
        setInfoMistakes(message)
        if (isProcessing === true) {
            document.getElementsByClassName("mistakeShower")[0].style = `margin-top:1rem;width:100%;color:#3c3c3c;background-color:#d1ffd1;`;
        } else {
            document.getElementsByClassName("mistakeShower")[0].style = `margin-top:1rem;width:100%;color:red;background-color:#ffd0d0;`;
        }
    }

    const checkIsValidInfo = () => {
        return new Promise((res, rej) => {
            let inputElem = document.getElementsByClassName("takeInfoBlock");
            if (((inputElem[0].value === "") && (inputElem[1].value === ""))) {
                changeElemData("Fill All Details", false)
            } else if ((inputElem[0].value === "")) {
                changeElemData("Username Field Is Empty", false)
            } else if ((inputElem[1].value === "")) {
                changeElemData("Email Field Is Empty", false)
            } else if ((inputElem[2].value === "")) {
                changeElemData("Password Field Is Empty", false)
            } else if ((inputElem[2].value.length < 8)) {
                changeElemData("Password Is Too Small ", false)
            } else if ((inputElem[0].value.length >= 35)) {
                changeElemData("Username Is Too Large", false)
            } else if (inputElem[0].value.indexOf("@") !== -1) {
                changeElemData("Username Should Not Have @", false)
            } else if ((((inputElem[0].value.length !== inputElem[0].value.replace(/ /g, '')).length) || ((inputElem[2].value.length !== inputElem[2].value.replace(/ /g, '')).length))) { // Visit "https://stackoverflow.com/questions/6623231/remove-all-white-spaces-from-text" For More Info About How To Remove All Whitespace From String.
                if (((inputElem[2].value.length !== inputElem[2].value.replace(/ /g, '')).length)) {
                    changeElemData("Password Have White Spaces", false)
                }
                else {
                    changeElemData("Username Have White Spaces", false)
                }
            }
            else {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputElem[1].value)) {
                    res(true);
                }
                else {
                    changeElemData("Invalid Email", false)
                }
            }
            res(false);
        })
    }

    const sendSignUpRequest = async () => {
        if (await checkIsValidInfo() === true) {
            let userName = document.getElementsByClassName("takeInfoBlock")[0].value;
            let email = document.getElementsByClassName("takeInfoBlock")[1].value;
            let password = document.getElementsByClassName("takeInfoBlock")[2].value;
            isLoading.current = true;
            changeElemData("Wait....", true);
            localStorage.setItem("userMail", email); // Here We Will Store User Mail Id In Local Storage, We Will Use Them For OTP Checking And Send It To Server With Entered OTP.

            const requestOptions = {
                method: 'POST',
                credentials: "include", // Remove Or Comment Out In Deployment.
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: userName,
                    email: email,
                    password: password
                })
            };
            let response = await fetch('/signup', requestOptions) // Remove "http://localhost:8000" In Deployment. 
            let data = await response.json()

            isLoading.current = false;

            if (data.isValid === undefined) {
                localStorage.removeItem("userMail");
                changeElemData(data.message, false);
            }
            else {
                isOTPCheck.current = true;
                changeElemData("OTP Sended On Mail Id", true);
            }

        } else {
            console.log("Fill Details Properly")
        }
    }

    const checkOTP = async () => {
        let inputElem = document.getElementsByClassName("takeInfoBlock");
        if ((inputElem[0].value.length !== 6) || ((inputElem[0].value.length !== inputElem[0].value.replace(/ /g, '')).length)) {
            changeElemData("Invalid OTP", false);
        } else {
            let email = localStorage.getItem("userMail");
            if ((email === undefined) || (email === null) || (email.length < 2) || (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) !== true)) {

                changeElemData("Invalid OTP", false)
            } else {
                isLoading.current = true;
                changeElemData("Wait....", true);
                const requestOptions = {
                    method: 'POST',
                    credentials: "include", // Remove Or Comment Out In Deployment.
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        otp: inputElem[0].value
                    })
                };
                let response = await fetch('/signup/emailValidation', requestOptions) // Remove "http://localhost:8000" In Deployment. 
                let data = await response.json()

                isLoading.current = false;

                if (data.privateKey === undefined) {
                    changeElemData(data.message, false);
                }
                else {
                    let userDataToStore=` Dear User We Are Thankful Of You For Using Our Service.\n Do Not Share This File Of This Files's Data, Make Several Copies Of This File And Store It To Several Places.\n Address:- ${data.address}\n Private Key:- ${data.privateKey}\n`                  
                    var blob = new Blob([userDataToStore], { type: "text/plain;charset=utf-8" }); // It Will Create And Automatically Download Text File In User Device, Visit "https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server" For More Info.
                    FileSaver.saveAs(blob, "userData.txt");
                    localStorage.removeItem("userMail");
                    changeElemData(data.message, true);
                    window.location.reload(true);
                }
            }
        }
    }
    return (
        <> {isOTPCheck.current === false ?
            // This Group Of Code Is Used For Taking information's From User. It Will Take UserName, Email ID, And Password.
            <>
                <div className="mainDiv">
                    <div className="mainFormContainer">
                        <div className="subFormContainer">
                            <div className="formContainerHeading ">Sign Up</div>
                            <div className="mistakeShower">
                                {infoMistakes}
                            </div>

                            <div id="dataTakerBlock1" className="dataShowerInfoBlock">
                                <div className="infoBlockHeading takeInfo">Username</div>
                                <input type="text" placeholder="Enter Unique Username" className="takeInfoBlock" />
                            </div>

                            <div id="dataTakerBlock2" style={{ marginTop: "2rem" }} className="dataShowerInfoBlock">
                                <div className="infoBlockHeading takeInfo">Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                <input type="text" placeholder="Enter Email ID" className="takeInfoBlock" />
                            </div>

                            <div id="dataTakerBlock3" style={{ marginTop: "2rem" }} className="dataShowerInfoBlock">
                                <div className="infoBlockHeading takeInfo">Password</div>
                                <input type="password" placeholder="Enter Secure Password" className="takeInfoBlock" />
                            </div>

                            <div className="submitBTNMain" style={{ display: "flex", justifyContent: "center" }}>
                                <div onClick={() => sendSignUpRequest()} className="submitBTN">
                                    Create
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "1.3rem", fontFamily: "'Source Sans Pro', sans-serif" }}>
                            <Link style={{ textDecoration: "none", color: "white" }} to="/login">Already Have Account</Link>
                        </div>
                    </div>
                </div>
            </> :
            <><div className="mainDiv">
                <div className="mainFormContainer">
                    <div className="subFormContainer">
                        <div className="formContainerHeading ">Sign Up</div>
                        <div className="mistakeShower">
                            {infoMistakes}
                        </div>
                        <div style={{ marginTop: "2rem" }} id="dataTakerBlock1" className="dataShowerInfoBlock">
                            <div className="infoBlockHeading takeInfo">OTP</div>
                            <input type="number" placeholder="Enter OTP" className="takeInfoBlock" />
                        </div>
                        <div className="submitBTNMain" style={{ display: "flex", justifyContent: "center" }}>
                            <div onClick={() => checkOTP()} className="submitBTN">
                                Create
                            </div>
                        </div>
                    </div>
                </div>
            </div></>}

            {
                isLoading.current === true ? <Loading /> : <></>
            }
        </>
    )
}

export default Signup;