import { useContext, useState, useRef } from 'react'
import { ethers } from 'ethers';
import { UserDataContext } from '../App';
import Loading from './Loading';

const SendETHSimp = () => {
    const contextData = useContext(UserDataContext);
    const userData = contextData.userInfo;
    const [confirmCode, setConfirmCode] = useState(null);
    const isLoading = useRef(false);
    const [infoMistakes, setInfoMistakes] = useState("No Mistakes");

    let infoBlockStyle;

    const changeElemData = (message, isProcessing) => {
        setInfoMistakes(message)
        if (isProcessing === true) {
            document.getElementsByClassName("mistakeShower")[0].style = `margin-top:1rem;margin-bottom:1rem;width:100%;color:#3c3c3c;background-color:#d1ffd1;`;
        } else {
            document.getElementsByClassName("mistakeShower")[0].style = `margin-top:1rem;margin-bottom:1rem;width:100%;color:red;background-color:#ffd0d0;`;
        }
    }

    const sendNotification = (notificationData) => {
        return new Promise(async (res, rej) => {
            if (Notification.permission === "denied") {
                alert(notificationData.errorMess)
                res(false);
            }
            else if (Notification.permission === "default") {
                await Notification.requestPermission();
                const greeting = new Notification('Hi, How are you?');
                console.log(greeting)
            }
            else {
                const greeting = new Notification(notificationData.title, {
                    body: notificationData.code
                    // body: 'Have a good day',
                    // icon: './img/goodday.png'
                });
                console.log(greeting)
            }
            res(true);
        })
    }

    const dataValidation = (reqData) => {
        return new Promise((res, rej) => {
            if (reqData.to === "" || reqData.amount === "" || reqData.password === "") {
                changeElemData("Input Fields Are Empty", false);
            } else if (isNaN(parseInt(reqData.amount))) {
                changeElemData("Invalid Amount", false);
            } else if (reqData.amount > (userData.balance)) {
                changeElemData("Insufficient Balance", false);
            } else if (ethers.utils.isAddress(reqData.to) === false) {
                changeElemData("Invalid Address", false);
            } else if (reqData.password.length < 8) {
                changeElemData("Invalid Password", false);
            }
            else {
                res(true);
                document.getElementsByClassName("mistakeShower")[0].style = "width:0%;"
            }
            res(false);
        })
    }

    // const resendCode = async () => {
    //     let digits = '0123456789';
    //     let randomCode = '';
    //     for (let i = 0; i < 4; i++) {
    //         randomCode += digits[Math.floor(Math.random() * 10)];
    //     }
    //     let notificationData = {
    //         title: "Confirmation Code",
    //         code: randomCode,
    //         errorMess: "Please Allow For Notifications, We Will Send Confirmation Code Via Notification"
    //     }
    //     await sendNotification(notificationData);
    //     setConfirmCode(randomCode)
    // }

    const sendRequest = async () => {
        let reqData = {
            to: document.getElementsByClassName("sendETHAddress")[0].value,
            amount: document.getElementsByClassName("sendETHAmount")[0].value,
            password: document.getElementsByClassName("sendETHPassword")[0].value,
        }
        if (await dataValidation(reqData) === true) {
            let wei = ethers.utils.parseEther(reqData.amount); // Converting Ethers To Wei, Visit "https://docs.ethers.io/v4/api-utils.html" For More Info.
            reqData.amount = wei.toString();

            isLoading.current = true;
            setConfirmCode(null);
            changeElemData("Wait....", true);

            const requestOptions = {
                method: 'POST',
                credentials: "include", // Remove Or Comment Out In Deployment.
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqData)
            };

            let response = await fetch('/sendETH', requestOptions) // Remove "http://localhost:8000" In Deployment. 
            let data = await response.json()
            console.log(data)
            isLoading.current = false;

            if (data.isDone === true) {
                changeElemData(data.message, true);
                window.location.reload(true);
            }
            else {
                changeElemData(data.message, false);
            }
        }
    }

    const sendMoney = async () => {
        let reqData = {
            to: document.getElementsByClassName("sendETHAddress")[0].value,
            amount: document.getElementsByClassName("sendETHAmount")[0].value,
            password: document.getElementsByClassName("sendETHPassword")[0].value,
        }
        console.log(reqData)
        if (await dataValidation(reqData) === true) {
            reqData.amount = ethers.utils.parseEther(reqData.amount);
            console.log(reqData)
            if (confirmCode === null) {
                let digits = '0123456789';
                let randomCode = '';
                for (let i = 0; i < 4; i++) {
                    randomCode += digits[Math.floor(Math.random() * 10)];
                }
                let notificationData = {
                    title: "Confirmation Code",
                    code: randomCode,
                    errorMess: "Please Allow For Notifications, We Will Send Confirmation Code Via Notification"
                }
                if (await sendNotification(notificationData) === true) {
                    document.getElementsByClassName("confirmCode")[0].style = `visibility:visible;opacity:1;margin-top:1.5rem;`;
                    document.getElementsByClassName("sendETHSubmitBTN")[0].style.marginTop = "3rem";
                    setConfirmCode(randomCode);
                }
            }
            else {
                if (document.getElementsByClassName("sendETHCode")[0].value === confirmCode) {
                    await sendRequest();
                    // console.log(parseInt(document.getElementsByClassName("sendETHCode")[0].value), confirmCode)
                    // document.getElementsByClassName("sendETHAddress")[0].value = "";
                    // document.getElementsByClassName("sendETHAmount")[0].value = "";
                    // document.getElementsByClassName("sendETHPassword")[0].value = "";
                    document.getElementsByClassName("sendETHCode")[0].value = "";
                    document.getElementsByClassName("confirmCode")[0].style = `opacity:0;visibility:hidden;margin-top:0rem;`;
                    document.getElementsByClassName("sendETHSubmitBTN")[0].style.marginTop = "0rem";
                }
                else {
                    changeElemData("Invalid Code", false);
                }
            }
        }
    }

    const getHeightForInfo = () => {
        if ((document.getElementsByTagName("body")[0].offsetWidth <= 490)) {
            let newWidth = Math.round((document.getElementsByTagName("body")[0].offsetWidth - ((document.getElementsByTagName("body")[0].offsetWidth * 4) / 100)) - 90) + "px";
            infoBlockStyle = {
                width: newWidth
            }
        }
        else {
            infoBlockStyle = {}
        }
    }
    getHeightForInfo();
    return (
        <>
            <div className="sendETHBody">
                <div className="sendETHMain">
                    <div className="dataShowerHeading sendETHHeading"><i className="fa fa-paper-plane" aria-hidden="true"></i> ETH</div>
                    <div className="mistakeShower">
                        {infoMistakes}
                    </div>
                    <div style={{ marginTop: "0rem" }} className=" dataShowerInfoBlock">
                        <div className="infoBlockHeading">Address</div>
                        <input style={infoBlockStyle} type="text" placeholder="Enter Receiver Address" className="sendETHAddress sendETHTakeInfo" />
                    </div>
                    <div style={{ marginTop: "2rem" }} className=" dataShowerInfoBlock">
                        <div className="infoBlockHeading">Amount</div>
                        <input style={infoBlockStyle} type="number" placeholder="Enter Amount To Send" className="sendETHAmount sendETHTakeInfo" />
                    </div>
                    <div style={{ marginTop: "2rem" }} className=" dataShowerInfoBlock">
                        <div className="infoBlockHeading">Key</div>
                        <input style={infoBlockStyle} type="password" placeholder="Enter Your Key" className="sendETHPassword sendETHTakeInfo" />
                    </div>
                    <div className=" confirmCode dataShowerInfoBlock">
                        <div className="infoBlockHeading">Code</div>
                        <input style={infoBlockStyle} type="number" placeholder="Enter Confirmation Code" className="sendETHCode sendETHTakeInfo" />
                    </div>
                    <div className="submitBTNMain" style={{ display: "flex", justifyContent: "center" }}>
                        <div onClick={() => sendMoney()} className="sendETHSubmitBTN">
                            Transfer
                        </div>
                    </div>
                </div>
            </div>
            {
                isLoading.current === true ? <Loading /> : <></>
            }
        </>
    )
}

export default SendETHSimp;