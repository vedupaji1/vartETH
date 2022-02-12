import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom"

const Service = (props) => {

    const [formStatus, setFormStatus] = useState({ valid: true, message: "Form Is Empty" })
    const history = useHistory();

    const changeStyle = (i) => {
        if (document.getElementsByClassName("serveInfoChild")[i].clientWidth === 140) {
            document.getElementsByClassName("trans")[i].style.transform = "rotate(0deg)"
            document.getElementsByClassName("serveInfoChild")[i].style.width = "0rem";
        }
        else {
            document.getElementsByClassName("trans")[i].style.transform = "rotate(90deg)"
            document.getElementsByClassName("serveInfoChild")[i].style.width = "13rem";
        }
    }

    const getServiceData = () => {
        let inpElem = document.getElementsByClassName("dataTaker");
        let data;
        if (inpElem[0].checked === false && inpElem[1].checked === false) {
            setFormStatus({ valid: false, message: "Form Is Empty" })
        }
        else if (inpElem[0].checked === true && inpElem[1].checked === true) {
            setFormStatus({ valid: false, message: "Invalid Input" })
        }
        else {
            if (inpElem[0].checked === true) {
                data = true;
                let postInfo = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ isSimple: data, userName: null, email: null, isNull: false })
                }
                fetch('/userRealData', postInfo).then((resData) => { // Sended Post Request, That Data Will Store Express Session
                    props.dataReceived({ isSimple: data, userName: null, email: null, isNull: false });
                })
            }
            else {
                history.replace("/emailVerification")
            }
        }
    }
    return (
        <>
            <div className="getDetailsMainDiv">
                <div className="getDetailsMainChid"><div className="createTodo">
                    <div className="getDetailsText"> <span>Services</span></div>
                </div>
                    {
                        formStatus.valid === false ? <div className="warningDiv"> {formStatus.message}</div> : <></>
                    }
                    <div className="getDetailsMainDivChild">
                        <div className="inpRadioHead">
                            <span>Simple </span>
                            <input className="dataTaker" style={{ marginLeft: '5rem' }} type="radio" name="serviceInp" id="simpleServe" />
                            <div className="infoOfServe">
                                <div className="serveInfoChild">No Notification</div>
                                <div className="showInfoIcon">
                                    <i onClick={() => changeStyle(0)} className="fa fa-angle-down trans" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>
                        <div className="inpRadioHead">
                            <span>Advance </span>
                            <input className="dataTaker" style={{ marginLeft: '4rem' }} type="radio" name="serviceInp" id="advServe" />
                            <div className="infoOfServe">
                                <div className="serveInfoChild">Notification Via Mail</div>
                                <div className="showInfoIcon">
                                    <i onClick={() => changeStyle(1)} className="fa fa-angle-down trans" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => getServiceData()}
                            style={{ width: "27rem", marginTop: "2rem", boxShadow: " 0rem 0rem 0.4rem 0.01rem #b0b0b0" }}
                            onMouseOver={() => { document.getElementsByClassName("dataSubmit")[0].style.backgroundColor = "#1955a4"; }}
                            onMouseOut={() => { document.getElementsByClassName("dataSubmit")[0].style.backgroundColor = "#1b61bf"; }}
                            className="dataSubmit">Submit
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Service;