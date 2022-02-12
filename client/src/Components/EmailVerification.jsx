import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const EmailVerification = (props) => {
    const history = useHistory();
    const [formStatus, setFormStatus] = useState({ valid: true, formComplete: false, message: "Form Is Empty" })
    const [isOtp, setIsOtp] = useState(false)
    const [userSendedData, setUserSendedData] = useState(null);
    useEffect(() => {
        fetch("/userRealData").then(response => response.json())
            .then(data => {
                if (data.isNull === false) {
                    history.replace('/')
                }
            }, []);
    })

    const getInputData = () => {
        let userDetail = {
            isSimple: false,
            userName: document.getElementsByClassName("userName")[0].value,
            email: document.getElementsByClassName("userMail")[0].value,
            isNull: false
        };
        let newStateObjData = {
            valid: true,
            formComplete: false,
            message: "Form Is Empty"
        }
        if (userDetail.userName === "" || userDetail.userName === "") {
            newStateObjData.valid = false;
            setFormStatus(newStateObjData)
        }
        else {
            if (userDetail.email.length < 11 || (userDetail.email.slice(userDetail.email.length - 10)) !== "@gmail.com" || userDetail.email.indexOf(' ') >= 0) {
                newStateObjData.valid = false;
                newStateObjData.message = "Invalid Gmail Id"
                setFormStatus(newStateObjData)
            }
            else {
                newStateObjData.valid = true;
                newStateObjData.formComplete = true;
                newStateObjData.message = "Receiving Your Details";
                userDetail["pp"] = null;
                setUserSendedData(userDetail)
                setFormStatus(newStateObjData);
                let postInfo = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userDetail)
                }
                fetch('/getMailData', postInfo).then((resData) => { // Sended Post Request, That Data Will Store Express Session
                    setFormStatus({
                        valid: true,
                        formComplete: false,
                        message: "Form Is Empty"
                    })
                    setIsOtp(true);
                })
            }
        }
    }

    const checkOTP = () => {
        let userDetail = {
            otp: document.getElementsByClassName("otpNum")[0].value,
        };
        let newStateObjData = {
            valid: true,
            formComplete: false,
            message: "Form Is Empty"
        }
        if (userDetail.otp === "") {
            newStateObjData.valid = false;
            setFormStatus(newStateObjData)
        }
        else {
            if (userDetail.otp.length !== 6) {
                newStateObjData.valid = false;
                newStateObjData.message = "Invalid OTP"
                setFormStatus(newStateObjData)
            }
            else {
                let postInfo = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userDetail)
                }
                fetch('/getValOTP', postInfo).then((resData) => { // Sended Post Request, That Data Will Store Express Session

                    if (resData.status === 201) {
                        newStateObjData.valid = true;
                        newStateObjData.formComplete = true;
                        newStateObjData.message = "Valid OTP";
                        setFormStatus(newStateObjData);
                        props.dataReceived(userSendedData);
                        history.replace('/')
                    }
                    else {
                        newStateObjData.valid = false;
                        newStateObjData.message = "Invalid OTP"
                        setFormStatus(newStateObjData)
                    }
                })
            }
        }
    }

    return (
        <>
            <div className="getDetailsMainDiv">
                <div className="getDetailsMainChid">
                    <div className="createTodo">
                        <div className="getDetailsText"> <span>Register</span></div>
                    </div>
                    {
                        formStatus.valid === false ? <div className="warningDiv"> {formStatus.message}</div> :
                            formStatus.formComplete === true ? <div style={{ backgroundColor: '#c3ffc3', color: '#3c3c3c' }} className="warningDiv"> {formStatus.message}</div> : <></>
                    }

                    <div className="getDetailsMainDivChild">
                        {isOtp === false ?
                            <>
                                <input type="text" name="userName" className="userName" placeholder="Username" />
                                <input type="email" name="userMail" id="userMail" className="userMail" placeholder="Gmail ID" />
                                <button
                                    onMouseOver={() => { document.getElementsByClassName("dataSubmit")[0].style.backgroundColor = "#1955a4"; }}
                                    onMouseOut={() => { document.getElementsByClassName("dataSubmit")[0].style.backgroundColor = "#1b61bf"; }}
                                    onClick={(e) => getInputData()} className="dataSubmit">Submit</button>
                            </>
                            :
                            <>
                                <input type="number" name="otpNum" className="otpNum" placeholder="Enter OTP" />
                                <button
                                    onMouseOver={() => { document.getElementsByClassName("dataSubmit")[0].style.backgroundColor = "#1955a4"; }}
                                    onMouseOut={() => { document.getElementsByClassName("dataSubmit")[0].style.backgroundColor = "#1b61bf"; }}
                                    onClick={(e) => checkOTP()} className="dataSubmit">Submit</button>
                            </>
                        }
                    </div>
                </div>
            </div >
        </>
    )
}
export default EmailVerification;