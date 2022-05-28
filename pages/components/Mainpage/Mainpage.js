import React from 'react'
import {BsCart4} from 'react-icons/bs'
import {ImFileText2} from 'react-icons/im'

function Mainpage() {
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

                    <p className="mr-20">내 지갑</p>
                    <p className="text-gray-300">내역.혜택</p>

                    </div>
                  

                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                <div className="bg-white shadow-md rounded-md w-5/6 z-10 -mt-10 h-50 ">
                    <div>
                        <div className="flex justify-between p-3 mt-2">
                            <p className="border flex flex-col items-center justify-center w-2/4 p-1 text-xs border-black ml-3 mr-2">
                                <a style={{fontSize:'9px'}}>XXXX님의 Mint 보유량</a>
                                <a style={{fontSize:'10px'}} className="font-bold">123 Mental Coins</a>
                            </p>
                            <p className=" w-2/4 rounded-full bg-green-500 border flex items-center justify-center text-white p-3 text-sm border-black mr-3">충전하기</p>
                        </div>

                        <div className="flex justify-between p-3">
                            <p className="border flex flex-col w-2/4 items-center justify-center p-1 text-xs border-black ml-3">
                                <a className="text-3xl"><ImFileText2/></a>
                                <a className="animate-bounce mt-3">설문하기</a>
                            </p>
                            <p className="border p-1 text-xs flex flex-col items-center justify-center w-2/4 border-black ml-3">
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

                <div className="border border-black w-5/6 p-2 mt-3">
                    Survey

                </div>

            </div>

         
   
        </div>

        <div className="h-screen">
            
        </div>


     
        
    </div>
  )
}

export default Mainpage