import React, { useContext } from "react";
import svgImage from '../moneyTransfer.svg';
import svgImageBack from '../mainSvgBackground.svg';
import DataShower from "./DataShower";
import TransactionShower from "./TransactionShower";
import DataShowerSimp from "./DataShowerSimp"
import TransactionShowerSimp from "./TransactionShowerSimp";
import { loginData } from "../App"

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