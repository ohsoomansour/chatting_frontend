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
interface IForm{
  customer: string;
  address: string;
  description: string;
  price:string;
  maintenance_cost:string;
  total:string;
}



export const Order = ({robot, deal}:OrderProps) => {
  const token = useRecoilValue(tokenState);
  const userId = useRecoilValue(userIdState);
  const [maintenanceYN, setMaintenanceYN] = useState(false);
  console.log('현재maintenanceYN:')
  console.log(maintenanceYN)

  const {register, getValues} = useForm<IForm>();
  const {customer, address, description, price, maintenance_cost, total } = getValues()
  console.log('address:')
  console.log(address)
  
  const onOrder = async() => {
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
              maintenance_cost: maintenance_cost, //{ maintenanceYN: true, maintenance_cost: '100' }
            }
          },
          total, //문제: total: ''  빈값 + string 값 

        })
      })
    ).json();
    console.log('newOrder:')
    console.log(newOrder);
  }
   
  const handleOptionSelect = (option:boolean) => {
    //setMaintenance(option)
    setMaintenanceYN(option);
    
  };

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
          {...register('customer')}
          type='text'
          value={userId}
          size={30}
          className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-pink-400'
          placeholder='Please write your name'
          /> 
        <h2 className=' text-lg font-bold '>address</h2>
        <input 
          {...register('address')}
          type='text'
          size={30}
          className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-pink-400'
          placeholder='Please write your address'
          
        />
        <h2 className=' text-lg font-bold '>Description</h2>
        <input
          {...register('description')}
          type='text'
          size={30}
          className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-pink-400'
          value={robot.description}
        />

        <h2 className=' text-lg font-bold mr-2'>Price</h2>
        <input 
          {...register('price')}
          size={30}
          className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-pink-400'  
          value={robot.price}
          placeholder="We will strive to adust to a more reasonable price "
        />
        
        {maintenanceYN? (
          <>  
            <h2 className=' text-lg font-bold mr-2'>Maintenance Cost</h2>
            <input 
              {...register('maintenance_cost')}
              size={30}
              className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-pink-400'  
              value={robot.maintenance_cost}
              placeholder="We will strive to adust to a more reasonable price "
            />
          </>  
        ): null}
        <h2 className=' text-lg font-bold mr-2'>{"Total"}</h2>
        <input 
          {...register('total')}
          className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-pink-400'  
          size={30}
          value={parseFloat(price) + (maintenanceYN === true? parseFloat(maintenance_cost) : parseFloat('0'))}
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
 
