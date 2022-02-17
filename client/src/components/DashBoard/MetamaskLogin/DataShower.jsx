import { useContext } from 'react'
import { UserDataContext } from '../../../App';
const DataShower = () => {

    const contextData = useContext(UserDataContext);
    const userData = contextData.userInfo;
    let infoBlockStyle;
  
    const getHeightForInfo = () => {
        if ((document.getElementsByTagName("body")[0].offsetWidth <= 380)) {
            let newWidth = ((document.getElementsByTagName("body")[0].offsetWidth - ((document.getElementsByTagName("body")[0].offsetWidth * 4) / 100)) - 80) + "px";
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
                userData === null ? <></> : <div className="dataShowerMain">
                    <div className="dataShowerHeading"><i className="fa fa-user" aria-hidden="true"></i></div>
                    <div className="dataShowerAddress dataShowerInfoBlock firstDataShowerInfoBlock ">
                        <div className="infoBlockHeading">Address</div>
                        <div style={infoBlockStyle} className="infoBlockData">{userData.address}</div>
                    </div>
                    <div className="dataShowerAddress dataShowerInfoBlock">
                        <div className="infoBlockHeading">Balance</div>
                        <div style={infoBlockStyle} className="infoBlockData">{userData.balance} Eth</div>
                    </div>
                    <div className="dataShowerAddress dataShowerInfoBlock">
                        <div className="infoBlockHeading">TOT</div>
                        <div style={infoBlockStyle} className="infoBlockData">{userData.transactions.length} Transactions</div>
                    </div>
                </div>
            }
        </>
    )
}

export default DataShower;