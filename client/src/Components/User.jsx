import React from "react";
import '../App.css'

const User = (props) => {

    const userDataCalc = (type) => {
        let data = 0;
        for (let i = 0; i < (props.todoData !== null ? props.todoData.length : 0); i++) {
            if (props.todoData[i][type] === true) {
                data++;
            }
        }
        return data;
    }
    const logoutFromTodo = () => {
        fetch('/userLog', {
            method: 'GET',
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(response => response.json())
            .then(data => {
                console.log(data)
                window.location.reload();
            });
    }

    let userData = [
        { reqDetail: "Total Tasks", resDetail: props.todoData !== null ? props.todoData.length : 0 },
        { reqDetail: "Task Completed", resDetail: userDataCalc("taskCompleted") },
        { reqDetail: "Task Incomplete", resDetail: 0 },
        { reqDetail: "Task Expired", resDetail: userDataCalc("taskExpired") }
    ]
    userData[2].resDetail = userData[0].resDetail - userData[1].resDetail;
    return (
        <>
            <div className="getDetailsMainDiv">
                <div className="getDetailsMainChid"><div className="createTodo">
                    <div style={props.userMisc.email === null ? {} : { marginTop: '5.5rem' }} className="getDetailsText">
                        <div className="userNameText">
                            {
                                props.userMisc.userName === null ? "Todo Details" : props.userMisc.userName
                            }
                        </div>
                        <div style={{ fontSize: '1.2rem', color: 'white', display: props.userMisc.email === null ? 'none' : 'block' }} className="emailText">
                            {props.userMisc.email}
                        </div>
                    </div>
                </div>
                    <div className="getDetailsMainDivChild">
                        {
                            userData.map((data, i) =>
                            (
                                <div id={"resDetails" + i} onMouseOver={() => document.getElementById("resDetails" + i).style.height = "7rem"} onMouseOut={() => document.getElementById("resDetails" + i).style.height = "4rem"} key={i} className="detailListHead">
                                    <div className="detailChild" >{data.reqDetail}</div>
                                    <div className="detailAns">{data.resDetail}</div>
                                </div>
                            ))
                        }
                        <button
                            onMouseOver={() => { document.getElementsByClassName("dataSubmit")[0].style.backgroundColor = "rgb(193 2 2)"; }}
                            onMouseOut={() => { document.getElementsByClassName("dataSubmit")[0].style.backgroundColor = "rgb(237 18 18)"; }}
                            onClick={() => logoutFromTodo()} className="dataSubmit logoutBut">Log Out</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default User;