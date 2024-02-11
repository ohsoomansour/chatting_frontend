import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { IDeal, IRobot } from './TradePlatform';
import { useRecoilValue } from 'recoil';
import { tokenState } from '../recoil/atom_token';
import { userIdState } from '../recoil/atom_user';

import BuyerPostcode from './address/buyer-postcode';
import { buyerAddress } from '../recoil/atom_address';

const MantenanceOption = styled.div``;
const Robot = styled.div``;

interface OrderProps{
  robot:IRobot;
  deal: IDeal;
}




export const Order = ({robot, deal}:OrderProps) => {
  const token = useRecoilValue(tokenState);
  const userId = useRecoilValue(userIdState);
  const customerAddress = useRecoilValue(buyerAddress); 
  const [maintenanceYN, setMaintenanceYN] = useState(false);



  const handleOptionSelect = (option:boolean) => {

    setMaintenanceYN(option);

  };
  const {register, getValues} = useForm();

 const onOrder = async() => {

    const {customer, price , maintenance_cost } = getValues()
    const numPrice = parseFloat(price);
    const numManitenance = maintenance_cost === undefined ? 0 : parseFloat(maintenance_cost);
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
          address:customerAddress,
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
        
        <BuyerPostcode />
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
 
