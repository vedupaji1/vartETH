import React, { useState, useRef, useEffect, createContext } from 'react';
import './App.css'
import { ethers } from "ethers";
import moneyTransfer from './contract/moneyTransfer.json';
import Dashboard from './components/DashBoard/Dashboard'
import SendETH from './components/DashBoard/MetamaskLogin/SendETH';
import SendETHSimp from './components/DashBoard/SimpleLogin/SendETHSimp';
import Loading from './components/Loading';
import Header from "./components/Header";
import SignUp from './components/SignUp/Signup';
import Login from "./components/Login";
import Error404 from './components/Error404';
import { Route, Switch, useHistory, useLocation } from "react-router-dom";

import io from "socket.io-client";
const socket = io.connect('/'); // Replace This URL To '/' In Deployment, If Front End Is Deployed On Same Server. In Case Of Different Domain Of Server Use Its Domain

const UserDataContext = createContext();
const loginData = createContext();

function App() {
  //location.reload();
  const [userData, setUserData] = useState(null);
  const [ETHContract, setETHContract] = useState(null);
  const [isMetamask, setIsMetamask] = useState(null);
  const isLogin = useRef(false);
  const history = useHistory();
  const location = useLocation();

  const reloadPage = () => {
    window.location.reload();
  }

  if (window.ethereum) { // This Statement Will Caught When Metamask Account Will Changed.
    window.ethereum.on('accountsChanged', () => reloadPage());
  }

  useEffect( () => {
    const initialProcessing= async()=>
    {
 // This Fetch Statement Will Send Request And Then Receive Info About Whether Cookie Contains Token Or Valid Token.
    // If Response Will True So It Means Uses Has Created Account And They Can Use This App Without Metamask.
    // If Response Will False So User Has To Create Account For Using App.
    let response = await fetch('/isLogin', { credentials: "include" })
    let data = await response.json() // Provides JSON Data
    isLogin.current = data.message; // Response Stored In "isLogin" useRef.
    console.log(data);


    if ((window.ethereum !== undefined) && (isLogin.current === false)) { // This Statement Checks That Whether User Have Metamask Or Not, 
      //If There Is A Metamask And Cookie Does Not Contains Token Then Statement Written Inside Will Execute. 
      setIsMetamask(true);

      const provider = new ethers.providers.Web3Provider(
        window.ethereum
      );

      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      let contract = new ethers.Contract('0x5149609a8e02B4A86D52249C58811C202972a546', moneyTransfer.abi, signer)

      setETHContract(contract);
      // await contract.sendMoney('0x58A7F5F4715333b6185Ef1AF19bC2e42fCB4b55f', { value: "1000000000000000000" });
      console.log(moneyTransfer.abi)
      let fetchedData = {
        address: await signer.getAddress(),
        balance: ethers.utils.formatEther(await signer.getBalance()),
        transactions: await contract.myRecords()
      }
      setUserData(fetchedData);
    }
    else {
      // If There Will Be Not Metamask Installed Then setIsMetamask Will Set To False Otherwise True.
      if ((window.ethereum === undefined)) {
        setIsMetamask(false);
        console.log(window.ethereum)
      } else {
        setIsMetamask(true);
        console.log(window.ethereum)
      }

      // If isLogin Value Will Be False So It Indicates That There Is Not Cookie Available And User Is Not Log, In This Situation Page Will Redirect To "/signup" Otherwise Page Will Redirect To "/" Or Main Page.
      if (isLogin.current === false) {
        if (location.pathname !== "/signup") {
          history.push('/login');
        }
      }
      else {
        history.push('/');
        let response = await fetch('/getInfo', { credentials: "include" })
        let userDataOp = await response.json()
        setUserData(userDataOp.data);
      }
    }
    }
    initialProcessing();
  }, [])


  return (
    <>
      <loginData.Provider value={{ isLogin: isLogin.current, isMetamask: isMetamask }}>
        <Header />

        <Switch>
          <Route exact path='/login'>
            <Login />
          </Route>
          <Route exact path='/signup'>
            <SignUp />
          </Route>
          <Route exact path='/'>
            <UserDataContext.Provider value={{ userInfo: userData, contractData: ETHContract }}>
              <Dashboard />
              {
                userData === null ? <Loading /> : isLogin.current === true ? <SendETHSimp /> : <SendETH />
              }

            </UserDataContext.Provider>
          </Route>
          <Route>
            <Error404 />
          </Route>
        </Switch>
      </loginData.Provider>
    </>
  )
}

export default App
export { UserDataContext, loginData } // Exporting Context
