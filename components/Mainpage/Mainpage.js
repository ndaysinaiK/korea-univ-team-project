import React,{useState,useEffect} from 'react'
import {BsCart4} from 'react-icons/bs'
import {ImFileText2} from 'react-icons/im'
import {useAuth} from '../context/Context'
import { toast } from 'react-toastify';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import NP from 'number-precision';
import loadinggif from '../assets/images/loader.gif';
import finalpic from '../assets/images/finalpic.png';
import logo from '../assets/images/logo.png';

import Image from "next/image"

import { 
    tokenAddr, logicAddr
  } from '../../contracts-config/config';

import Logic from '../../artifacts/contracts/Logic.sol/Logic.json';
import MCT from '../../artifacts/contracts/MCT.sol/MCT.json';
  


function Mainpage() {
    const {LoaduserInfo,currentUser} = useAuth();   
    const [survey,setSurvey]=useState(false);
    const [bal,setB]=useState(0)
    const [minting,setMinting]=useState(false);
    const [showdone,setDone]=useState(false);


    useEffect(() => {
        balance()
    },[currentUser])

      
async function Count (){
    setMinting(true)
    var radios = document.getElementsByClassName('radios');
    var sum=0;
    for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
        sum+=1
    }
    } 

    console.log(sum)

    try {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)    
        const signer = provider.getSigner()
    
        let contract = new ethers.Contract(logicAddr, Logic.abi, signer)
        let mint = await contract.survey(Number(sum))
        
        await mint.wait()
        balance()
        toast.info("Successfully done!", {position:toast.POSITION.TOP_CENTER});
        setMinting(false)
        setDone(true)
    
    } catch (error) {
        toast.error(`error occured ${error}`, {position:toast.POSITION.TOP_CENTER});
        setMinting(false)
    }



}

async function balance () {
    
    try {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)    
        const signer = provider.getSigner()
    
        let Token = new ethers.Contract(tokenAddr, MCT.abi, signer)
        const balance = await Token.balanceOf(currentUser)

        console.log(String(balance/1000000000000000000))
        setB(NP.strip(String(balance/1000000000000000000)))

    
    } catch (error) {
        console.log(`error occured ${error}`);
    }

}

  return (
    <div className="flex flex-col justify-center items-center bg-gray-200">

        <div className="bg-white rounded-t-3xl shadow-lg w-4/5 sm:w-1/4 mt-20 p-4 ">

            <div className="flex items-center justify-center">
                <div className="bg-gray-100 h-2 rounded-full w-1/5 mt-3 ">

                </div>

            </div>

            <div className="bg-green-500 rounded-md h-40 mt-5">
                <div className="text-white flex items-center text-xl">
                    <Image src={logo} height="100px" width="80px"/>
                    <b className="-ml-3">Mental</b>
                </div>

                <div className="flex items-center justify-center">
                    <div className="flex items-center justify-between font-bold mt-10 text-white">

                    <p className="mr-20 underline underline-offset-8">??? ??????</p>
                    <p className="text-gray-200">??????.??????</p>

                    </div>
                  

                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                <div className="bg-white shadow-md rounded-md w-5/6 z-10 -mt-10 h-50 ">
                    <div>
                        <div className="flex justify-between p-3 mt-2">
                            {currentUser&&<p className="border flex flex-col items-center justify-center w-2/4 p-1 text-xs border-black ml-3 mr-2 cursor-pointer">
                                <a style={{fontSize:'9px'}}><b>{currentUser.slice(0,2)+'..'+currentUser.slice(37,43)}</b> ?????? Mint ?????????</a>
                                <a style={{fontSize:'10px'}} className="font-bold">{bal} Mental Tokens</a>
                            </p>}
                            {!currentUser&&
                            <p onClick={()=>LoaduserInfo()} className=" w-2/4 rounded-full border flex items-center justify-center text-black p-3 text-sm border-black mr-3 cursor-pointer">??????????????? ??????</p>}
                            <p className=" w-2/4 rounded-full bg-green-500 border flex items-center justify-center text-white p-3 text-sm border-black mr-3 cursor-pointer">????????????</p>
                        </div>

                        <div className="flex justify-between p-3">
                            {currentUser&&<p onClick={()=>setSurvey(true)} className="border flex flex-col w-2/4 items-center justify-center p-1 text-xs border-black ml-3 cursor-pointer">
                                <a className="text-3xl"><ImFileText2/></a>
                                <a className="animate-bounce mt-3">????????????</a>
                            </p>}
                            {!currentUser&&<p className="border flex flex-col w-2/4 items-center justify-center p-1 text-xs border-black ml-3 cursor-pointer">
                                <a className="text-3xl"><ImFileText2/></a>
                                <a className="animate-bounce mt-3">???????????? ????????????</a>
                            </p>}
                            <p className="border p-1 text-xs flex flex-col items-center justify-center w-2/4 border-black ml-3 cursor-pointer">
                                <a className="text-3xl"><BsCart4/></a>
                                <a className="mt-3">????????? ??????</a>
                            </p>
                        </div>
                        
                    </div>
                </div>

                <div className="bg-blue-50 w-5/6 rounded-lg mt-6 text-xs flex items-center justify-around p-2">
                    <p>???????????? ?????? ???????????? ?????? ????????? ????????????</p>
                    <p className="text-green-500 font-bold"> {'>'} </p>
                </div>

                {survey&&!showdone&&<div className="border border-black w-6/6 p-2 mt-3">
               

                    <div className="flex justify-between items-center mt-2">
                        <p className="bg-green-500 p-2 border border-black flex items-center justify-center text-white w-2/4 mr-3 cursor-pointer">PHQ</p>
                        <p className="cursor-pointer p-2 border border-black flex items-center justify-center text-xs w-2/4">?????? ????????? ?????????</p>
                    </div>

                    <div className="border border-black p-2 mt-3"> 

                        <div className="flex flex-col  text-xs"> 
                            <h2>. ?????? 2??? ??????, ????????? ?????? ????????? ?????? ???????????? ????????? ???????????????????</h2> <br />

                            <p>1. ??? ?????? ?????? ????????? ????????? ????????? ???????????? ????????? ??????</p>
                            <div className="flex items-center justify-center mt-2 mb-4">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1 ">Yes</b><input type="radio" name="1" className="radios" /></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input type="radio" name="1" className="radios"  /></p>
                            </div>
                            
                            <p className="mt-3">2. ????????? ???????????????, ???????????????, ????????? ??????</p>
                            <div className="flex items-center justify-center mt-2 mb-4">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1">Yes</b><input className="radios" type="radio" name="2" /></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input className="radios" type="radio" name="2"/></p>
                            </div>
                            <p className="mt-3">3. ?????? ????????? ?????? ?????? ?????? ?????? ?????????, ?????? ?????? ?????? ?????? ???</p>
                            <div className="flex items-center justify-center  mt-2 mb-4">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1">Yes</b><input className="radios" type="radio" name="3"/></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input className="radios" type="radio" name="3" /></p>
                            </div>

                            <p className="mt-3">4. ??????????????? ???????????? ????????? ?????? ??????</p>
                            <div className="flex items-center justify-center  mt-2 mb-4">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1">Yes</b><input className="radios" type="radio" name="4" /></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input className="radios" type="radio" name="4"/></p>
                            </div>
                            <p className="mt-3">5. ????????? ????????? ????????? ???</p>
                            <div className="flex items-center justify-center  mt-2 mb-4">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1">Yes</b><input className="radios" type="radio" name="5" /></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input className="radios" type="radio" name="5" /></p>
                            </div>
                            <p className="mt-3">6. ????????? ??????????????? ???, ?????? ????????? ??????????????? ???????????? ?????? ?????? ????????? ????????????</p>
                            <div className="flex items-center justify-center  mt-2 mb-4">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1">Yes</b><input className="radios" type="radio" name="6"/></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input className="radios" type="radio" name="6" /></p>
                            </div>
                            <p className="mt-3">7. ????????? ????????? ???????????? ?????? ?????? ?????? ?????? ???????????? ?????? ?????????</p>
                            <div className="flex items-center justify-center  mt-2 mb-4">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1">Yes</b><input className="radios" type="radio" name="7"/></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input className="radios" type="radio" name="7" /></p>
                            </div>
                            <p className="mt-3">8. ?????? ???????????? ????????? ????????? ?????? ????????? ??????????????? ?????? ???, ?????? ????????? ??????????????? ?????? ???????????? ?????? ???????????? ?????? ?????? ?????? ??????</p>
                            <div className="flex items-center justify-center  mt-2 mb-4">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1">Yes</b><input className="radios" type="radio" name="8" /></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input className="radios" type="radio" name="8" /></p>
                            </div>
                            <p className="mt-3">9. ????????? ?????? ?????? ??? ????????? ??????????????? ?????? ???????????? ????????? ?????? ???????????? ?????????</p>
                            <div className="flex items-center justify-center  mt-2">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1">Yes</b><input className="radios" type="radio" name="9" /></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input className="radios" type="radio" name="9" /></p>
                            </div>
                            



                        </div>

                    </div>

                    <div  className="flex items-center flex-col justify-center ">

                        {!minting&&<div onClick={()=>Count()} className="bg-green-600 mt-3 mb-8 p-4 text-white border border-black cursor-pointer"><p>????????????</p></div>}
                   
                        {minting&&<div className="flex flex-col items-center justify-center mb-1" >
                            <Image src={loadinggif} height="100px" width="150px"/>
                        </div>}

                    </div>

                </div>}

                {showdone&&<div className="">  {/** final screen */}
                    <Image src={finalpic}/>
                    <div className="flex items-center justify-center bg-green-600 mt-3 mb-8 p-4 text-white border border-black cursor-pointer"><p>????????????</p></div>
                </div>}

            </div>

  

            

         
   
        </div>

        <div className="h-screen">
            
        </div>


     
        
    </div>
  )
}

export default Mainpage