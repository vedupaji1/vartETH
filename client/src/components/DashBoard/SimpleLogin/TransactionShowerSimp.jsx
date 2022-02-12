import { useContext } from 'react'
import { UserDataContext } from '../../../App';
import { ethers } from 'ethers';
const TransactionShowerSimp = () => {

    const contextData = useContext(UserDataContext);
    const userData = contextData.userInfo;
    console.log(userData);

    let infoBlockStyle;

    const getTransactionTime = (time) => {
        let transTime = new Date(time._hex * 1000)
        return (transTime.getHours() + ":" + transTime.getMinutes());;
    }

    const getTransactionDate = (time) => {
        let transTime = new Date(time._hex * 1000)
        let curTime = new Date();
        let months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
        if ((curTime.getDate() === transTime.getDate()) && (curTime.getMonth() === transTime.getMonth()) && (curTime.getFullYear() === transTime.getFullYear())) {
            return;
        }
        else {
            return `${transTime.getDate()} ${months[transTime.getMonth()]} ${transTime.getFullYear()}`;
        }
    }

    const getHeightForInfo = () => {
        if ((document.getElementsByTagName("body")[0].offsetWidth <= 380)) {
            let newWidth = Math.round((document.getElementsByTagName("body")[0].offsetWidth - ((document.getElementsByTagName("body")[0].offsetWidth * 4) / 100)) - 80) + "px";
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
            {
                userData === null ? <></> : <div className="transShowerMain">
                    <div className="dataShowerHeading"><i className="fa fa-exchange"></i></div>
                    <div onMouseOver={() => (
                        document.getElementsByClassName("transactionContainer")[0].offsetHeight >= 380 ?
                            document.getElementsByClassName("transactionContainer")[0].style.overflowY = "scroll" : <></>
                    )} onMouseOut={() => (
                        document.getElementsByClassName("transactionContainer")[0].style.overflowY = "hidden"
                    )} className='transactionContainer'>
                        {
                            userData.transactions.length === 0 ? <><div className="noTransactionShower">No Transactions</div></> : userData.transactions.slice(0).reverse().map((data, i) => (
                                <div key={i} className="transShowerInfoBlock">
                                    <div style={{ display: "flex" }}>
                                        <div className="infoBlockHeading" style={{ paddingTop: "0.3rem", paddingBottom: "0.3rem" }}>
                                            {
                                                data.isReceived === true ?
                                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                                        <i style={{ color: "lime" }} className="fa fa-chevron-up"></i>
                                                        <i style={{ marginTop: "-0.5rem", color: "#97ff97" }} className="fa fa-chevron-up"></i>
                                                    </div> :
                                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                                        <i style={{ color: "#ff787c" }} className="fa fa-chevron-down"></i>
                                                        <i style={{ marginTop: "-0.5rem", color: "#ff2a2a" }} className="fa fa-chevron-down"></i>
                                                    </div>
                                            }

                                        </div>
                                        <div className="infoBlockData">{ethers.utils.formatEther(data.amount)} Eth</div>
                                    </div>

                                    <div style={{ display: "flex", backgroundColor: "#9799d1" }}>
                                        <div className="infoBlockHeading" style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                {data.isReceived === true ? <span>From</span> : <span>To</span>}
                                            </div>
                                        </div>
                                        <div style={infoBlockStyle} className="infoBlockData">{data.addr}</div>
                                    </div>

                                    <div style={{ display: "flex" }}>
                                        <div className="infoBlockHeading" style={{ paddingTop: "0.3rem", paddingBottom: "0.3rem" }}>
                                            Date
                                        </div>
                                        <div className="infoBlockData">{getTransactionTime(data.time)}&nbsp;&nbsp;&nbsp;&nbsp;{getTransactionDate(data.time)}</div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default TransactionShowerSimp;