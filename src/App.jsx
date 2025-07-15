// import { useState, useEffect } from 'react'
// import './App.css'
// import { TabsDemo } from '../src/components/tabs/TabsDemo'
// import Bg from './assets/bg.jpg'
// import { useDispatch, useSelector } from 'react-redux';
// import { VortexDemo } from './components/login/loginSignup';

// function App() {
//   const isLoggedInFromState = useSelector((state) => state.isLoggedIn);
//   const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInFromState);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     setIsLoggedIn(isLoggedInFromState);
//   }, [isLoggedInFromState]); 

//   return (
//     <>
//       <div className='relative h-screen w-screen'>
//         <img src={Bg} className='absolute h-screen bg-cover bg-center w-screen' alt="" />
//         <div className='w-screen h-screen absolute bg-black opacity-55'></div>
//         {isLoggedIn?<TabsDemo/>:<VortexDemo/>}
//       </div>
//     </>
//   )
// }

// export default App



import { useEffect } from "react";
import "./App.css";
import { TabsDemo } from "../src/components/tabs/TabsDemo";
import Bg from "./assets/bg.jpg";
import { useDispatch, useSelector } from "react-redux";
<<<<<<< HEAD

function App() {
=======
import { VortexDemo } from "./components/login/loginSignup";
import FadeInBox from './components/fadeinbox/FadeInBox'

function App() {

>>>>>>> 453c03fa9883aa3b651e7e8b5b60fff9184af268
  return (
    <>
      <div className='relative h-screen w-screen'>
        <img src={Bg} className='absolute h-screen bg-cover bg-center w-screen' alt="" />
        <div className='w-screen h-screen absolute bg-black opacity-55'></div>
<<<<<<< HEAD
        <TabsDemo />
=======
        <TabsDemo  />

        <FadeInBox/> 
>>>>>>> 453c03fa9883aa3b651e7e8b5b60fff9184af268
      </div>
    </>
  );
}

export default App;
