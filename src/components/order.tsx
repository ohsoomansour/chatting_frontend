import React, { useState } from 'react';
import styled from 'styled-components';

import { useForm } from 'react-hook-form';
import { IDeal, IRobot } from './TradePlatform';
import { useRecoilValue } from 'recoil';
import { tokenState } from '../recoil/atom_token';
import { userIdState } from '../recoil/atom_user';

const MantenanceOption = styled.div``;
const Robot = styled.div``;

interface OrderProps{
  robot:IRobot;
  deal: IDeal;
}




export const Order = ({robot, deal}:OrderProps) => {
  const token = useRecoilValue(tokenState);
  const userId = useRecoilValue(userIdState);
  const [maintenanceYN, setMaintenanceYN] = useState(false);
  console.log('handleOptionSelect 밖 maintenanceYN:')
  console.log(maintenanceYN) //


  const handleOptionSelect = (option:boolean) => {
    //setMaintenance(option)
    setMaintenanceYN(option);
    console.log('handleOptionSelect 안 maintenanceYN:')
    console.log(maintenanceYN) //
  };
  const {register, getValues} = useForm();
  /* 문제는 NaN 이 값은 숫자가 아닌 연산의 결과물로 발생하는 경우 
    랜더링 될 때 기본값은 undefined 그 다음의 getValues값은 input 태그의 각각의 값인거지 
  
  */
  
  /*/ 
  //✅ 이해하고 넘어가기
  console.log(price)   //랜더링 undefined
  console.log(maintenance_cost)  //랜더링 undefined
  console.log(total)  //랜더링 undefined

  const numPrice = parseFloat(price);   
  console.log('numPrice');
  console.log(numPrice);   //처음 랜더링: NaN
  const numMaintenace_cost = parseFloat(maintenance_cost); //처음 랜더링: NaN
  console.log('numMaintenace_cost:') 
  console.log(numMaintenace_cost)
  const numTotal = numPrice + numMaintenace_cost;
  console.log(numTotal)//처음 랜더링: NaN
  
  */
  
  

  
 const onOrder = async() => {
     //✅ 이해하고 넘어가기: 체음 랜더링시 undefined -> parseFormat(total): NaN 
     // 랜더링 후의 값을 불러온다. 따라서 input태그의 value를 불러옴
    const {customer, address, description, price , maintenance_cost } = getValues()
    const numPrice = parseFloat(price);
    const numManitenance = parseFloat(maintenance_cost);
    const numTotal = numPrice + numManitenance;

    const newOrder = await(
      await fetch('http://localhost:3000/order/make', {
        headers:{
          'x-jwt':token,
          'Content-Type': 'application/json; charset=utf-8',
        },
        method:'POST',
        body:JSON.stringify({
          dealId: deal.id,
          customer,
          address,
          description,
          items:{
            robot: robot,   //relation으로 price 여기에 포함되어있고 가져오면됨  
            options:{
              maintenanceYN: maintenanceYN,
              maintenance_cost: numManitenance, //{ maintenanceYN: true, maintenance_cost: '100' }
            }
          },
          total:  numTotal , //문제: total: ''  빈값 + string 값 

        })
      })
    ).json();
    console.log('newOrder:')
    console.log(newOrder);
  }
   
  

  return (
    <div className=''>
      <MantenanceOption className="container mx-auto max-w-xs mt-10">
        <div className="flex ml-2">
          <h2 className="text-center text-xl font-bold mr-2">Maintenance</h2>
          <button
            className={`py-2 px-4 mr-2 rounded-lg text-white font-semibold ${
              maintenanceYN === true  ? 'bg-red-500' : 'bg-gray-300'
            }`}
            onClick={() => handleOptionSelect(true)}
          >
            Yes
          </button>
          <button
            className={`py-2 px-4 rounded-lg text-white font-semibold ${
              maintenanceYN === false ? 'bg-red-500' : 'bg-gray-300'
            }`}
            onClick={() => handleOptionSelect(false)}
          >
            No
          </button>
        </div>
      </MantenanceOption>
      <Robot>
      <form className='ml-2'>
         
        <h2 className=' text-lg font-bold '>Customer</h2>
        <input 
          {...register('customer', {required: true})}
          type='text'
          
          value={userId}
          size={30}
          className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-pink-400'
          placeholder='Please write your name'
          /> 
        <h2 className=' text-lg font-bold '>address</h2>
        <input 
          {...register('address', {required: true})}
          type='text'
          size={30}
          className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-pink-400'
          placeholder='Please write your address'
          
        />
        <h2 className=' text-lg font-bold '>Description</h2>
        <input
          {...register('description', {required: true})}
          type='text'
          size={30}
          className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-pink-400'
          value={robot.description}
        />

        <h2 className=' text-lg font-bold mr-2'>Price</h2>
        <input 
          {...register('price', {required: true})}
          type='number'
          size={30}
          className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-pink-400'  
          defaultValue={robot.price}
          placeholder="We will strive to adust to a more reasonable price "
        />
        {/*전역에서 가져오고 그래서 클릭하면 전역 변수 값을 가져오고 */}
        {maintenanceYN? (
          <>  
            <h2 className=' text-lg font-bold mr-2'>Maintenance Cost</h2>
            <input 
              {...register('maintenance_cost')}
              type='number'
              size={30}
              className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-pink-400'  
              defaultValue={robot.maintenance_cost}
              placeholder="We will strive to adust to a more reasonable price "
            />
          </>  
        ): null}
        <h2 className=' text-lg font-bold mr-2'>{"Total"}</h2>
        <input 
          {...register('total', {required: true})}
          className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-pink-400'  
          size={30}                      
          value={robot.price + (maintenanceYN === false ? 0 : parseFloat(robot.maintenance_cost))}
          placeholder="We will strive to adust to a more reasonable price "
        />
      </form>
      <div className="flex ml-2">
        
      </div>
      </Robot>
      <button 
        onClick={onOrder} 
        className=' font-semibold min-w-full mx-auto mt-2 mb-4 border-2 border-gray-100 bg-white p-6 rounded-md shadow-lg hover:bg-green-200 transition-colors'
      > Order
      </button>
    </div>
  );
}
 
