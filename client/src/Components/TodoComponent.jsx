import React from "react";
import { useState } from "react";

const TodoComponent = (props) => {
    let arr = new Array(props.todoData.length).fill(null)
    const [TodoTime, setTodoTime] = useState(arr)

    const showTodoTaskTime = (data) => {
        let tempArr = TodoTime.slice();
        if (tempArr[data] == null) {
            let timeObj = new Date(props.todoData[data].taskTime);
            let curTime = new Date();
            let actualTime;

            if (curTime.getDate() === timeObj.getDate() && curTime.getMonth() === timeObj.getMonth() && curTime.getFullYear() === timeObj.getFullYear()) {
                actualTime = timeObj.getHours() + ":" + timeObj.getMinutes()
            }
            else {
                actualTime = timeObj.getHours() + ":" + timeObj.getMinutes() + "     " + timeObj.getDate() + "/" + timeObj.getMonth() + "/" + timeObj.getFullYear();
                document.getElementsByClassName("showTodoTime")[data].style.width = "15rem";
            }
            tempArr[data] = actualTime;
        }
        else {
            tempArr[data] = null;
            if (document.getElementsByClassName("showTodoTime")[data].clientWidth === 150) {
                document.getElementsByClassName("showTodoTime")[data].style.width = "10rem";
            }
        }
        setTodoTime(tempArr);
    }

    const changeIconStyle = (i) => {
        if (document.getElementsByClassName("transIcon")[i].style.marginTop === "-1rem") {
            document.getElementsByClassName("transIcon")[i].style.marginTop = "-2rem"
            document.getElementsByClassName("todoModifier")[i].style.opacity = "0"
            document.getElementsByClassName("todoModifier")[i].style.visibility = "hidden"
        }
        else {
            document.getElementsByClassName("transIcon")[i].style.marginTop = "-1rem"
            document.getElementsByClassName("todoModifier")[i].style.visibility = "visible"
            document.getElementsByClassName("todoModifier")[i].style.opacity = "1"
        }
    }

    const deleteTask = (i) => {
        props.taskDeleteFunc(i)
        let tempTodoTime = TodoTime;
        document.getElementsByClassName("todoModifier")[i].style.opacity = "0"
        document.getElementsByClassName("todoModifier")[i].style.visibility = "hidden"
        document.getElementsByClassName("transIcon")[i].style.marginTop = "-2rem"
        tempTodoTime.splice(i, 1);
        setTodoTime(tempTodoTime);
    }



    const checkIsExpired = setInterval(() => {
        for (let i = 0; i < props.todoData.length; i++) {
            let taskTime = new Date(props.todoData[i].taskTime);
            let curTime = new Date();

            if ((props.todoData[i].taskCompleted === false) && (props.todoData[i].taskExpired === false)) {
                if (taskTime.getTime() < curTime.getTime()) {
                    props.taskExpiredFunc(i);
                    clearInterval(checkIsExpired);
                }
            }
        }
    }, 60000)

    return (
        <>
            {
                props.todoData.map((tempTodoData, i) => (
                    <div key={i} className="bodyDivChild">
                        <div className="todoModifier">
                            <div onClick={() => props.taskCompleteFunc(i)} style={tempTodoData.taskCompleted === false ? {} : { visibility: "hidden" }} className="todoDone todoModifierButtons"><span>Complete</span></div>
                            <div onClick={() => deleteTask(i)} className="todoDelete todoModifierButtons"><span>Delete</span></div>
                        </div>
                        <div className="todoTaskBar">
                            <div className="todoTitleDiv">
                                <span >{tempTodoData.taskName}</span>
                            </div>
                            <div className="taskCompletedSign">
                                <i style={tempTodoData.taskCompleted === true ? { display: "block", color: '#04AA6D' } : { display: "none", color: '#04AA6D' }} className="fa fa-check" aria-hidden="true"></i>
                                <i style={tempTodoData.taskExpired === true ? { display: "block", color: "red" } : { display: "none", color: "red" }} className="fa fa-exclamation-circle" aria-hidden="true"></i>
                            </div>
                            <div onMouseOver={() => showTodoTaskTime(i)} onMouseOut={() => showTodoTaskTime(i)} className="showTodoTime">
                                <span >{TodoTime[i] == null ? "Time" : TodoTime[i]}</span>
                            </div>
                            <div className="iconHead">
                                <div onClick={() => changeIconStyle(i)} className="iconChild">
                                    <i className="fa fa-angle-down" aria-hidden="true"></i>
                                    <i className="fa fa-angle-down transIcon" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>

                        <div className="todoTaskDescription"><span>{tempTodoData.taskDetails}</span></div>

                    </div>
                ))
            }
        </>
    )
}
export default TodoComponent;