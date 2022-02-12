import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { IsNavActive } from '../App';

const sleepOp = (sleepTime) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res();
        }, sleepTime);
    })
}

const GetTodoDetails = (props) => {
    const [formStatus, setFormStatus] = useState({ valid: true, formComplete: false, message: "Form Is Empty" })
    const dataLink = useContext(IsNavActive) //Received  Data From App.js Using 'useContext'

    const saveDataInSession = (todoData) => {
        let sessionData = JSON.parse(localStorage.getItem('VARtMyWorkData'));
        if (sessionData === null || sessionData.length === 0) {
            todoData.id = 1;
            localStorage.setItem('VARtMyWorkData', JSON.stringify([todoData]))
        }
        else {
            todoData.id = sessionData[sessionData.length - 1].id + 1;
            sessionData.push(todoData);
            localStorage.setItem('VARtMyWorkData', JSON.stringify(sessionData))
        }
        sessionData = JSON.parse(localStorage.getItem('VARtMyWorkData'));
        props.addNewTodoFunction();//'addNewTodoFunction' Is Not Actually Function, This Is Name Of Props Actual Function Name Is 'addNewTodo'
    }

    const getInputData = async (e) => {
        dataLink.changeNavFunc(false); //Calling Function, Which Is In App.js

        let todoDataFromUser = {
            taskName: document.getElementsByClassName("taskNameInput")[0].value.trim(),
            taskDetails: document.getElementById("taskDesc").value,
            taskTime: document.getElementById("taskTime").value,
            taskCompleted: false,
            taskExpired: false
        };

        if (todoDataFromUser.taskName === "" || todoDataFromUser.taskDetails === "" || todoDataFromUser.taskTime === "") {
            let newStateObjData = {
                valid: false,
                formComplete: formStatus.formComplete,
                message: formStatus.message
            }
            setFormStatus(newStateObjData)
        }
        else {
            let curTime = new Date();
            let taskTime = new Date(todoDataFromUser.taskTime);
            if (curTime.getTime() >= taskTime.getTime()) {
                let newStateObjData = {
                    valid: false,
                    formComplete: formStatus.formComplete,
                    message: "Invalid Date"
                }
                setFormStatus(newStateObjData);
            }
            else if (todoDataFromUser.taskName.length > 32) {
                let newStateObjData = {
                    valid: false,
                    formComplete: formStatus.formComplete,
                    message: "Maximum Length Of Task Name Is 32"
                }
                setFormStatus(newStateObjData);
            }
            else {

                let newStateObjData = {
                    valid: true,
                    formComplete: true,
                    message: "Todo Created"
                }
                setFormStatus(newStateObjData);
                await sleepOp(2000);

                document.getElementsByClassName("taskNameInput")[0].value = "";
                document.getElementById("taskDesc").value = "";
                document.getElementById("taskTime").value = "";
                document.getElementById("taskDesc").style.height = "3rem";
                newStateObjData = { valid: true, formComplete: false, message: "Form Is Empty" }
                setFormStatus(newStateObjData)
                let taskTime = new Date(todoDataFromUser.taskTime);
                todoDataFromUser.taskTime = taskTime.getTime();
                saveDataInSession(todoDataFromUser);
                dataLink.changeNavFunc(true); //Recalling Function 
            }
        }
    }


    return (
        <>
            <div className="getDetailsMainDiv">
                <div className="getDetailsMainChid"><div className="createTodo">
                    <div className="getDetailsText"> <span>Create Todo</span></div>
                </div>
                    {
                        formStatus.valid === false ? <div className="warningDiv"> {formStatus.message}</div> :
                            formStatus.formComplete === true ? <div style={{ backgroundColor: '#c3ffc3', color: '#3c3c3c' }} className="warningDiv"> {formStatus.message}</div> : <></>
                    }

                    <div className="getDetailsMainDivChild">
                        <input type="text" className="taskNameInput" placeholder="Task Name" /><br />
                        <textarea
                            onChange={() => {
                                document.getElementById("taskDesc").style.height = 'auto'
                                let realHeight = document.getElementById("taskDesc").scrollHeight;
                                document.getElementById("taskDesc").style.height = realHeight - 12 + 'px';
                            }}
                            name="taskDesc" id="taskDesc" placeholder="Task Description"></textarea>
                        <input type="datetime-local" name="taskTime" id="taskTime" />
                        <button
                            onMouseOver={() => { document.getElementsByClassName("dataSubmit")[0].style.backgroundColor = "#1955a4"; }}
                            onMouseOut={() => { document.getElementsByClassName("dataSubmit")[0].style.backgroundColor = "#1b61bf"; }}
                            onClick={(e) => getInputData(e.target.value, true)} className="dataSubmit">Create Todo</button>
                    </div></div>
            </div>
        </>
    )
}

export default GetTodoDetails;

