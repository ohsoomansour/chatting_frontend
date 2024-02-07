import React, { useState } from 'react';
import styled from 'styled-components';

import { useForm } from 'react-hook-form';
import { IRobot } from './TradePlatform';

const MantenanceOption = styled.div``;
const Robot = styled.div``;

interface OrderProps{
  robot:IRobot;
}

// 주문 로직  export const Order:React.FC<OrderProps> = ({robot}) => {
export const Order = ({robot}:OrderProps) => {
  console.log();
  const [maintenance, setMaintenance] = useState(false);
  const {register} = useForm();
  const handleOptionSelect = (option:boolean) => {
    setMaintenance(option)
  };

  return (
    <div>
      <MantenanceOption className="container mx-auto max-w-xs mt-10">
        <div className="flex ml-2">
          <h2 className="text-center text-xl font-bold mr-2">Maintenance</h2>
          <button
            className={`py-2 px-4 mr-2 rounded-lg text-white font-semibold ${
              maintenance  ? 'bg-red-500' : 'bg-gray-300'
            }`}
            onClick={() => handleOptionSelect(true)}
          >
            Yes
          </button>
          <button
            className={`py-2 px-4 rounded-lg text-white font-semibold ${
              maintenance === false ? 'bg-red-500' : 'bg-gray-300'
            }`}
            onClick={() => handleOptionSelect(false)}
          >
            No
          </button>
        </div>
      </MantenanceOption>
      <Robot>
      <form>
        
        <h2 className=' text-lg font-bold mr-2'>Price</h2>
        <input 
          {...register('price')}
          value={`$${robot.price}`}
          placeholder="We will strive to adust to a more reasonable price "
        />

      </form>
      <div className="flex ml-2">
        
      </div>
      </Robot>
    </div>
  );
}
 
