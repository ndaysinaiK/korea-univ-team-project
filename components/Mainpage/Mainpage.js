import React,{useState,useEffect} from 'react'
import {BsCart4} from 'react-icons/bs'
import {ImFileText2} from 'react-icons/im'
import {useAuth} from '../context/Context'
import { toast } from 'react-toastify';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import NP from 'number-precision';

import { 
    tokenAddr, logicAddr
  } from '../../contracts-config/config';

import Logic from '../../artifacts/contracts/Logic.sol/Logic.json';
import MCT from '../../artifacts/contracts/MCT.sol/MCT.json';
  


function Mainpage() {
    const {LoaduserInfo,currentUser} = useAuth();   
    const [survey,setSurvey]=useState(false);
    const [bal,setB]=useState(0)


    useEffect(() => {
        balance()
    },[currentUser])

      
async function Count (){
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

        toast.info("Successfully done!", {position:toast.POSITION.TOP_CENTER});
    
    } catch (error) {
        toast.error(`error occured ${error}`, {position:toast.POSITION.TOP_CENTER});
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
                <div className="text-white pt-3 text-xl">
                    <b className=" ml-5">Mental</b>
                </div>

                <div className="flex items-center justify-center">
                    <div className="flex items-center justify-between font-bold mt-10 text-white">

                    <p className="mr-20 underline underline-offset-8">내 지갑</p>
                    <p className="text-gray-200">내역.혜택</p>

                    </div>
                  

                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                <div className="bg-white shadow-md rounded-md w-5/6 z-10 -mt-10 h-50 ">
                    <div>
                        <div className="flex justify-between p-3 mt-2">
                            {currentUser&&<p className="border flex flex-col items-center justify-center w-2/4 p-1 text-xs border-black ml-3 mr-2 cursor-pointer">
                                <a style={{fontSize:'9px'}}><b>{currentUser.slice(0,2)+'..'+currentUser.slice(37,43)}</b> 님의 Mint 보유량</a>
                                <a style={{fontSize:'10px'}} className="font-bold">{bal} Mental Tokens</a>
                            </p>}
                            {!currentUser&&
                            <p onClick={()=>LoaduserInfo()} className=" w-2/4 rounded-full border flex items-center justify-center text-black p-3 text-sm border-black mr-3 cursor-pointer">메타마스크 연결</p>}
                            <p className=" w-2/4 rounded-full bg-green-500 border flex items-center justify-center text-white p-3 text-sm border-black mr-3 cursor-pointer">충전하기</p>
                        </div>

                        <div className="flex justify-between p-3">
                            {currentUser&&<p onClick={()=>setSurvey(true)} className="border flex flex-col w-2/4 items-center justify-center p-1 text-xs border-black ml-3 cursor-pointer">
                                <a className="text-3xl"><ImFileText2/></a>
                                <a className="animate-bounce mt-3">설문하기</a>
                            </p>}
                            {!currentUser&&<p className="border flex flex-col w-2/4 items-center justify-center p-1 text-xs border-black ml-3 cursor-pointer">
                                <a className="text-3xl"><ImFileText2/></a>
                                <a className="animate-bounce mt-3">로그인후 설문하기</a>
                            </p>}
                            <p className="border p-1 text-xs flex flex-col items-center justify-center w-2/4 border-black ml-3 cursor-pointer">
                                <a className="text-3xl"><BsCart4/></a>
                                <a className="mt-3">데이터 구매</a>
                            </p>
                        </div>
                        
                    </div>
                </div>

                <div className="bg-blue-50 w-5/6 rounded-lg mt-6 text-xs flex items-center justify-around p-2">
                    <p>매일매일 카드 조회하고 랜덤 포인트 쫍으세요</p>
                    <p className="text-green-500 font-bold"> {'>'} </p>
                </div>

                {survey&&<div className="border border-black w-6/6 p-2 mt-3">
               

                    <div className="flex justify-between items-center mt-2">
                        <p className="bg-green-500 p-2 border border-black flex items-center justify-center text-white w-2/4 mr-3 cursor-pointer">PHQ</p>
                        <p className="cursor-pointer p-2 border border-black flex items-center justify-center text-xs w-2/4">기본 우울증 테스트</p>
                    </div>

                    <div className="border border-black p-2 mt-3"> 

                        <div className="flex flex-col  text-xs"> 
                            <h2>. 지난 2주 동안, 얼마나 자주 다음과 같은 문제들로 곤란을 겪으셨습니까?</h2> <br />

                            <p>1. 일 또는 여가 활동을 하는데 흥미나 즐거움을 느끼지 못함</p>
                            <div className="flex items-center justify-center mt-2 mb-4">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1 ">Yes</b><input type="radio" name="1" className="radios" /></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input type="radio" name="1" className="radios"  /></p>
                            </div>
                            
                            <p className="mt-3">2. 기분이 가라앉거나, 우울하거나, 희망이 없음</p>
                            <div className="flex items-center justify-center mt-2 mb-4">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1">Yes</b><input className="radios" type="radio" name="2" /></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input className="radios" type="radio" name="2"/></p>
                            </div>
                            <p className="mt-3">3. 잠이 들거나 계속 잠을 자는 것이 어려움, 또는 잠을 너무 많이 잠</p>
                            <div className="flex items-center justify-center  mt-2 mb-4">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1">Yes</b><input className="radios" type="radio" name="3"/></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input className="radios" type="radio" name="3" /></p>
                            </div>

                            <p className="mt-3">4. 피곤하다고 느끼거나 기운이 거의 없음</p>
                            <div className="flex items-center justify-center  mt-2 mb-4">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1">Yes</b><input className="radios" type="radio" name="4" /></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input className="radios" type="radio" name="4"/></p>
                            </div>
                            <p className="mt-3">5. 입맛이 없거나 과식을 함</p>
                            <div className="flex items-center justify-center  mt-2 mb-4">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1">Yes</b><input className="radios" type="radio" name="5" /></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input className="radios" type="radio" name="5" /></p>
                            </div>
                            <p className="mt-3">6. 자신을 부정적으로 봄, 혹은 자신이 실패자라고 느끼거나 자신 또는 가족을 실망시킴</p>
                            <div className="flex items-center justify-center  mt-2 mb-4">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1">Yes</b><input className="radios" type="radio" name="6"/></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input className="radios" type="radio" name="6" /></p>
                            </div>
                            <p className="mt-3">7. 신문을 읽거나 텔레비전 보는 것과 같은 일에 집중하는 것이 어려움</p>
                            <div className="flex items-center justify-center  mt-2 mb-4">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1">Yes</b><input className="radios" type="radio" name="7"/></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input className="radios" type="radio" name="7" /></p>
                            </div>
                            <p className="mt-3">8. 다른 사람들이 주목할 정도로 너무 느리게 움직이거나 말을 함, 또는 반대로 평상시보다 많이 움직여서 너무 안절부절 못하 거나 들떠 있음</p>
                            <div className="flex items-center justify-center  mt-2 mb-4">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1">Yes</b><input className="radios" type="radio" name="8" /></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input className="radios" type="radio" name="8" /></p>
                            </div>
                            <p className="mt-3">9. 자신이 죽는 것이 더 낫다고 생각하거나 어떤 식으로든 자신을 해칠 것이라고 생각함</p>
                            <div className="flex items-center justify-center  mt-2">
                                <p className="flex items-center justify-center mr-10"><b className="mr-1">Yes</b><input className="radios" type="radio" name="9" /></p>
                                <p className="flex items-center justify-center"><b className="mr-1">No</b><input className="radios" type="radio" name="9" /></p>
                            </div>
                            



                        </div>

                    </div>

                    <div onClick={()=>Count()} className="flex items-center justify-center bg-green-600 mt-3 p-4 text-white border border-black cursor-pointer">
                        <p>설문완료</p>
                    </div>

                </div>}

            </div>

         
   
        </div>

        <div className="h-screen">
            
        </div>


     
        
    </div>
  )
}

export default Mainpage