import React, { useState, useRef, useEffect, createContext } from 'react';
import './App.css'
import { ethers } from "ethers";
//import moneyTransfer from './contract/moneyTransfer.json';
import Dashboard from './Components/Dashboard'
import SendETH from './Components/SendETH';
import SendETHSimp from './Components/SendETHSimp';
import Loading from './Components/Loading';
import Header from "./Components/Header";
import SignUp from './Components/Signup';
import Login from "./Components/Login";
import Error404 from './Components/Error404';
import { Route, Switch, useHistory, useLocation } from "react-router-dom";

import io from "socket.io-client";
const socket = io.connect('/'); // Replace This URL To '/' In Deployment, If Front End Is Deployed On Same Server. In Case Of Different Domain Of Server Use Its Domain

const UserDataContext = createContext();
const loginData = createContext();

let moneyTransfer={
  "_format": "hh-sol-artifact-1",
  "contractName": "moneyTransfer",
  "sourceName": "contracts/moneyTransfer.sol",
  "abi": [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "moneySended",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "myAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "myRecords",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "addr",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "time",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isReceived",
              "type": "bool"
            }
          ],
          "internalType": "struct moneyTransfer.recordStruct[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "sendMoney",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "showBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "bytecode": "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506109ab806100606000396000f3fe60806040526004361061004a5760003560e01c806326b85ee11461004f578063338ccd781461007a578063570eabc8146100aa57806381b2d07b146100d55780638da5cb5b14610100575b600080fd5b34801561005b57600080fd5b5061006461012b565b6040516100719190610784565b60405180910390f35b610094600480360381019061008f91906105fd565b610133565b6040516100a191906107f8565b60405180910390f35b3480156100b657600080fd5b506100bf610484565b6040516100cc91906107d6565b60405180910390f35b3480156100e157600080fd5b506100ea6105a5565b6040516100f7919061081a565b60405180910390f35b34801561010c57600080fd5b506101156105c4565b6040516101229190610784565b60405180910390f35b600033905090565b6060600034905060008373ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f193505050509050600115158115151415610444577f9eda4c0aa6d460b109f019319b1eca2387162919e02638b0dacf032851071e733385846040516101b39392919061079f565b60405180910390a1600060405180608001604052808673ffffffffffffffffffffffffffffffffffffffff168152602001848152602001428152602001600015158152509050600060405180608001604052803373ffffffffffffffffffffffffffffffffffffffff168152602001858152602001428152602001600115158152509050600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002082908060018154018082558091505060019003906000526020600020906004020160009091909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550602082015181600101556040820151816002015560608201518160030160006101000a81548160ff0219169083151502179055505050600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081908060018154018082558091505060019003906000526020600020906004020160009091909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550602082015181600101556040820151816002015560608201518160030160006101000a81548160ff02191690831515021790555050506040518060400160405280601881526020017f596f7572204d6f6e6579204973205472616e736665726564000000000000000081525094505050505061047f565b6040518060400160405280601281526020017f5472616e73616374696f6e204661696c65640000000000000000000000000000815250925050505b919050565b6060600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b8282101561059c57838290600052602060002090600402016040518060800160405290816000820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160018201548152602001600282015481526020016003820160009054906101000a900460ff161515151581525050815260200190600101906104e5565b50505050905090565b60003373ffffffffffffffffffffffffffffffffffffffff1631905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000813590506105f78161095e565b92915050565b60006020828403121561060f57600080fd5b600061061d848285016105e8565b91505092915050565b60006106328383610711565b60808301905092915050565b610647816108e4565b82525050565b6106568161088a565b82525050565b6106658161088a565b82525050565b600061067682610845565b6106808185610868565b935061068b83610835565b8060005b838110156106bc5781516106a38882610626565b97506106ae8361085b565b92505060018101905061068f565b5085935050505092915050565b6106d2816108ae565b82525050565b60006106e382610850565b6106ed8185610879565b93506106fd81856020860161091a565b6107068161094d565b840191505092915050565b608082016000820151610727600085018261064d565b50602082015161073a6020850182610766565b50604082015161074d6040850182610766565b50606082015161076060608501826106c9565b50505050565b61076f816108da565b82525050565b61077e816108da565b82525050565b6000602082019050610799600083018461065c565b92915050565b60006060820190506107b4600083018661065c565b6107c1602083018561063e565b6107ce6040830184610775565b949350505050565b600060208201905081810360008301526107f0818461066b565b905092915050565b6000602082019050818103600083015261081281846106d8565b905092915050565b600060208201905061082f6000830184610775565b92915050565b6000819050602082019050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b6000610895826108ba565b9050919050565b60006108a7826108ba565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60006108ef826108f6565b9050919050565b600061090182610908565b9050919050565b6000610913826108ba565b9050919050565b60005b8381101561093857808201518184015260208101905061091d565b83811115610947576000848401525b50505050565b6000601f19601f8301169050919050565b6109678161089c565b811461097257600080fd5b5056fea2646970667358221220ff28f4aecb5815d3cd5497bc1a2761b93766099089ffe082d2a518a069e6050364736f6c63430008000033",
  "deployedBytecode": "0x60806040526004361061004a5760003560e01c806326b85ee11461004f578063338ccd781461007a578063570eabc8146100aa57806381b2d07b146100d55780638da5cb5b14610100575b600080fd5b34801561005b57600080fd5b5061006461012b565b6040516100719190610784565b60405180910390f35b610094600480360381019061008f91906105fd565b610133565b6040516100a191906107f8565b60405180910390f35b3480156100b657600080fd5b506100bf610484565b6040516100cc91906107d6565b60405180910390f35b3480156100e157600080fd5b506100ea6105a5565b6040516100f7919061081a565b60405180910390f35b34801561010c57600080fd5b506101156105c4565b6040516101229190610784565b60405180910390f35b600033905090565b6060600034905060008373ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f193505050509050600115158115151415610444577f9eda4c0aa6d460b109f019319b1eca2387162919e02638b0dacf032851071e733385846040516101b39392919061079f565b60405180910390a1600060405180608001604052808673ffffffffffffffffffffffffffffffffffffffff168152602001848152602001428152602001600015158152509050600060405180608001604052803373ffffffffffffffffffffffffffffffffffffffff168152602001858152602001428152602001600115158152509050600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002082908060018154018082558091505060019003906000526020600020906004020160009091909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550602082015181600101556040820151816002015560608201518160030160006101000a81548160ff0219169083151502179055505050600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081908060018154018082558091505060019003906000526020600020906004020160009091909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550602082015181600101556040820151816002015560608201518160030160006101000a81548160ff02191690831515021790555050506040518060400160405280601881526020017f596f7572204d6f6e6579204973205472616e736665726564000000000000000081525094505050505061047f565b6040518060400160405280601281526020017f5472616e73616374696f6e204661696c65640000000000000000000000000000815250925050505b919050565b6060600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b8282101561059c57838290600052602060002090600402016040518060800160405290816000820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160018201548152602001600282015481526020016003820160009054906101000a900460ff161515151581525050815260200190600101906104e5565b50505050905090565b60003373ffffffffffffffffffffffffffffffffffffffff1631905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000813590506105f78161095e565b92915050565b60006020828403121561060f57600080fd5b600061061d848285016105e8565b91505092915050565b60006106328383610711565b60808301905092915050565b610647816108e4565b82525050565b6106568161088a565b82525050565b6106658161088a565b82525050565b600061067682610845565b6106808185610868565b935061068b83610835565b8060005b838110156106bc5781516106a38882610626565b97506106ae8361085b565b92505060018101905061068f565b5085935050505092915050565b6106d2816108ae565b82525050565b60006106e382610850565b6106ed8185610879565b93506106fd81856020860161091a565b6107068161094d565b840191505092915050565b608082016000820151610727600085018261064d565b50602082015161073a6020850182610766565b50604082015161074d6040850182610766565b50606082015161076060608501826106c9565b50505050565b61076f816108da565b82525050565b61077e816108da565b82525050565b6000602082019050610799600083018461065c565b92915050565b60006060820190506107b4600083018661065c565b6107c1602083018561063e565b6107ce6040830184610775565b949350505050565b600060208201905081810360008301526107f0818461066b565b905092915050565b6000602082019050818103600083015261081281846106d8565b905092915050565b600060208201905061082f6000830184610775565b92915050565b6000819050602082019050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b6000610895826108ba565b9050919050565b60006108a7826108ba565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60006108ef826108f6565b9050919050565b600061090182610908565b9050919050565b6000610913826108ba565b9050919050565b60005b8381101561093857808201518184015260208101905061091d565b83811115610947576000848401525b50505050565b6000601f19601f8301169050919050565b6109678161089c565b811461097257600080fd5b5056fea2646970667358221220ff28f4aecb5815d3cd5497bc1a2761b93766099089ffe082d2a518a069e6050364736f6c63430008000033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

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
