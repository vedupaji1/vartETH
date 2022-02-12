import React, { createContext } from 'react'; // For Creating Context, Context Is Used For Data Sharing
import Navbar from './Components/Navbar.jsx';
import MainTemp from './Components/MainTemp';
import PageFooter from './Components/PageFooter';
import Header from './Components/Header';
import OfflineErrorPage from './Components/OfflineErrorPage.jsx';
import {useState} from 'react';

let IsNavActive=createContext();
function App() {
  let [navActive,setNavActive]=useState(true);
  let headerDetails = {
    headerName: "MyWork",
    slogan: "Cholo Score Dekhe"
  }

  const changeNavFunc=(data)=>
  {
    setNavActive(data);
  }

  if (sessionStorage.getItem('errorImage')===null) {
    var request = new XMLHttpRequest();
    request.open('GET', 'noSignal.svg', true);
    request.responseType = 'blob';
    request.onload = () => {
    var reader = new FileReader();
    reader.readAsDataURL(request.response);
    reader.onload =  function(e){
        sessionStorage.setItem('errorImage',e.target.result)
    };
   };
  request.send();
  }
  

  return (
    <>{console.log(navigator.onLine)}
      <Header headerName={headerDetails.headerName} slogan={headerDetails.slogan} isSlogan={false} />
      {
       navigator.onLine===true?    
        <>
        <IsNavActive.Provider value={{isActive:navActive,changeNavFunc:changeNavFunc}}>
        <Navbar/>  
        <MainTemp/>   
        </IsNavActive.Provider>
        <PageFooter/>  
       </>           
      :<OfflineErrorPage/>
      }   
    </>
  );
}

export default App;
export {IsNavActive};