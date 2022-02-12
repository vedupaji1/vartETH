import React, { useContext } from "react";
import svgImage from '../../svgImages/moneyTransfer.svg';
import svgImageBack from '../../svgImages/mainSvgBackground.svg';
import DataShower from "./MetamaskLogin/DataShower";
import TransactionShower from "./MetamaskLogin/TransactionShower";
import DataShowerSimp from "./SimpleLogin/DataShowerSimp"
import TransactionShowerSimp from "./SimpleLogin/TransactionShowerSimp";
import { loginData } from "../../App"

const Dashboard = () => {
    const contextData = useContext(loginData);

    return (
        <>
            <div className="mainHeader">
                <div className="svgImageShower">
                    <div className="svgBackgroundImage"><img src={svgImage} alt="logo" /></div>
                    <div className="backSVGImage">
                        <img src={svgImageBack} alt="svgBackground" />
                    </div>

                    <div className="infoShowerMain">
                        {
                            contextData.isLogin === true ?
                                <>
                                    <DataShowerSimp />
                                    <TransactionShowerSimp />
                                </> :
                                <>
                                    <DataShower />
                                    <TransactionShower />
                                </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;