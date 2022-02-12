import React from 'react';
import GetTodoDetails from './GetTodoDetails'
import TodoComponent from './TodoComponent'
import Error404 from './Error404';
import User from './User';
import Service from './Service';
import EmailVerification from './EmailVerification'
import { Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../App.css'
import openSocket from 'socket.io-client';
const socket = openSocket('/');


const MainTemp = () => {

    const [realTodoData, setRealTodoData] = useState(null)
    const [userMiscData, setUserMiscData] = useState(null)

    const showNotification = (messData) => {
        if (Notification.permission === 'granted') {
            navigator.serviceWorker.getRegistration().then(function (reg) {
                var options = {
                    body: messData.message,
                    icon: '../logo.png',
                    vibrate: [100, 50, 100],
                    data: {
                        dateOfArrival: Date.now(),
                        primaryKey: 1
                    }
                };
                reg.showNotification(messData.title, options);
            });
        }
        else if (Notification.permission === "default") {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    navigator.serviceWorker.getRegistration().then(function (reg) {
                        var options = {
                            body: messData.message,
                            icon: '../logo.png',
                            vibrate: [100, 50, 100],
                            data: {
                                dateOfArrival: Date.now(),
                                primaryKey: 1
                            }
                        };
                        reg.showNotification(messData.title, options);
                    });
                }
            });
        }
    }

    try {
        let tempMiscData = JSON.parse(localStorage.getItem("VARtMyWorkData"));
        if (JSON.stringify(tempMiscData) !== JSON.stringify(realTodoData)) {
            setRealTodoData(tempMiscData)
        }
    } catch (error) {
        showNotification({
            title: "Warning", message: `    We Have Found Immoral Activity From Your Side.

        We Have To Delete Your All Task Data And We Have Deleted Your Task Data.`});
        localStorage.clear();
        setRealTodoData(null)
        if (userMiscData.isSimple === false) {
            let messTempData = {
                email_op_10: userMiscData.email,
                subjectText: `Deleted Your Task Data`,
                otp_op_10: `Hi ${userMiscData.userName}, We Have Found Immoral Activity From Your Side.
  We Are Sorry To But Because Of Your Immoral Activity We Have To Delete Your All Task Data And We Have Deleted Your Task Data.
  Please Don't Repeat Such Type Of Mistake In Future.
      
        Thanks`
            }
            socket.emit("sendMessage", messTempData)
        }
    }

    useEffect(() => {
        if (userMiscData === null || userMiscData.length === 0) {
            try {
                fetch("/userRealData").then(response => response.json())
                    .then(data => {
                        setUserMiscData(data)
                    });
            } catch (error) {
                console.log("Network Problem")
            }
        }
    })

    const addNewTodo = () => {
        let newTodoDataFromLocalStorage = JSON.parse(localStorage.getItem("VARtMyWorkData"));
        setRealTodoData(newTodoDataFromLocalStorage);
    }

    const addTaskCompletedData = (i) => {
        let newData = realTodoData;
        newData[i].taskCompleted = true;
        newData[i].taskExpired = false;
        localStorage.setItem('VARtMyWorkData', JSON.stringify(newData))
        setRealTodoData([...newData]);

        showNotification({ title: "Task Completed", message: `    Hi, Your Task ${realTodoData[i].taskName} Is Completed.` });
        if (userMiscData.isSimple === false) {
            let messTempData = {
                email_op_10: userMiscData.email,
                subjectText: `${realTodoData[i].taskName} Task Completed`,
                otp_op_10: `Hi ${userMiscData.userName}, Your Task ${realTodoData[i].taskName} Is Completed.

        Task Details:-
   ${realTodoData[i].taskDetails} 

        Thanks`
            }
            socket.emit("sendMessage", messTempData)
        }
    }
    const taskDeleteFunc = (i) => {
        let newData = realTodoData;
        let tempDataHolder;

        if (userMiscData.isSimple === false) {
            tempDataHolder = realTodoData;
        }
        else {
            tempDataHolder = realTodoData[i].taskName;
        }
        newData.splice(i, 1);
        localStorage.setItem('VARtMyWorkData', JSON.stringify(newData))
        setRealTodoData([...newData]);

        showNotification({ title: "Task Deleted", message: `    Hi, Your Task ${userMiscData.isSimple === false ? tempDataHolder[i].taskName : tempDataHolder} Is Deleted.` });// Simple Notification Function
        if (userMiscData.isSimple === false) {
            let messTempData = {
                email_op_10: userMiscData.email,
                subjectText: `${tempDataHolder[i].taskName} Task Deleted`,
                otp_op_10: `Hi ${userMiscData.userName}, Your Task ${tempDataHolder[i].taskName} Is Deleted.

        Task Details:-
   ${tempDataHolder[i].taskDetails} 

        Thanks`
            }
            socket.emit("sendMessage", messTempData)
        }
    }

    const taskExpiredFunc = (i) => {
        let newData = realTodoData;
        newData[i].taskExpired = true;
        localStorage.setItem('VARtMyWorkData', JSON.stringify(newData))
        setRealTodoData([...newData]);

        showNotification({ title: "Task Expired", message: `    Hi, Your Task ${realTodoData[i].taskName} Is Expired.` });// Simple Notification Function
        if (userMiscData.isSimple === false) {
            let messTempData = {
                email_op_10: userMiscData.email,
                subjectText: `${realTodoData[i].taskName} Task Expired`,
                otp_op_10: `Hi ${userMiscData.userName}, Your Task ${realTodoData[i].taskName} Is Expired.

        Task Details:-
   ${realTodoData[i].taskDetails} 

        Thanks`
            }
            socket.emit("sendMessage", messTempData)
        }
    }

    const dataReceived = (data) => { // This Function Will Change 'userMiscData' State
        setUserMiscData(data)
    }

    return (
        <>
            <div className="mainBodyDiv">
                <div className="bodyDiv">
                    <Switch>
                        <Route exact path='/emailVerification' render={(props) => (
                            <EmailVerification {...props} dataReceived={dataReceived} />
                        )} />
                        {(userMiscData === null) ? <></> :
                            <Switch>
                                <Route exact path="/addWork" render={(props) => (
                                    (userMiscData.isNull === true) ? <Service {...props} dataReceived={dataReceived} /> : <GetTodoDetails {...props} addNewTodoFunction={addNewTodo} />
                                )} />
                                <Route exact path='/user' render={(props) => (
                                    (userMiscData.isNull === true) ? <Service {...props} dataReceived={dataReceived} /> : /*(realTodoData === null || realTodoData.length === 0) ? <GetTodoDetails  {...props} addNewTodoFunction={addNewTodo} /> :*/ <User {...props} userMisc={userMiscData} todoData={realTodoData} />

                                )} />
                                <Route exact path="/" render={(props) => (
                                    (userMiscData.isNull === true) ? <Service {...props} dataReceived={dataReceived} /> : (realTodoData === null || realTodoData.length === 0) ? <GetTodoDetails  {...props} addNewTodoFunction={addNewTodo} /> : <TodoComponent  {...props} todoData={realTodoData} taskCompleteFunc={addTaskCompletedData} taskDeleteFunc={taskDeleteFunc} taskExpiredFunc={taskExpiredFunc} />
                                )} />
                                <Route component={Error404} />
                            </Switch>
                        }
                    </Switch>
                </div>
            </div>
        </>
    );
}

export default MainTemp;
