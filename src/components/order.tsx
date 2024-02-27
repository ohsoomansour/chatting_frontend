import { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { IDeal, IRobot } from '../pages/TradePlatform';
import { useRecoilValue } from 'recoil';
import { tokenState } from '../recoil/atom_token';
import { userIdState } from '../recoil/atom_user';
import BuyerPostcode from './address/buyer-postalcode';
import { buyerAddress } from '../recoil/atom_address';
import { ButttonContainer } from '../pages/storedGoods';


const MantenanceOption = styled.div``;
const Robot = styled.div``;

interface OrderProps{
  robot:IRobot;
  deal: IDeal;
}
const BASE_PATH = process.env.NODE_ENV === "production" 
 ? "https://trade.herokuapp.com"
 : "http://localhost:3000";

export const Order = ({robot, deal}:OrderProps) => {
  const token = useRecoilValue(tokenState);
  const userId = useRecoilValue(userIdState);
  const customerAddress = useRecoilValue(buyerAddress); 
  const [maintenanceYN, setMaintenanceYN] = useState(false);

  const handleOptionSelect = (option:boolean) => {
    setMaintenanceYN(option);
  };
 
  const {register, getValues} = useForm();
  const onSave = async () => {
  const { customer, price , maintenance_cost } = getValues();
  const numPrice = parseFloat(price);
  const numManitenance = maintenance_cost === undefined ? 0 : parseFloat(maintenance_cost);
  const numTotal = numPrice + numManitenance;
    
  const isStored = await(
    //결제 서비스 추가 가정: 주문 정보 확인 후 -> 결제 요청 -> (카카오, 네이버)페이 앱 연결 -> 결제 승인, 응답 -> order주문: 승인상태 값 등록   

    await fetch(`${BASE_PATH}/order/storegoods`, {
      headers:{
        'x-jwt':token,
        'Content-Type': 'application/json; charset=utf-8',
      },
      method:'POST',
      body:JSON.stringify({
        dealId: deal.id,
        customer,
        payment:{
          price:numPrice,   //relation으로 price 여기에 포함되어있고 가져오면됨  
          maintenanceYN,
          maintenance_cost: numManitenance, //{ maintenanceYN: true, maintenance_cost: '100' }
          total:numTotal , //문제: total: ''  빈값 + string 값
        },
      })
    })
  ).ok   
  isStored ? alert('고객님이 선택하신 제품을 카트에 담았고 쇼핑을 계속하세요!💛') : alert('🚫고객님이 선택하신 제품의 저장을 실패 하였습니다. ')
  console.log(isStored);
}


 const onOrder = async() => {
    //판매자 추가
    const {seller, customer, price , maintenance_cost } = getValues()
    console.log("seller:")
    console.log(seller);
    const numPrice = parseFloat(price);
    const numManitenance = maintenance_cost === undefined ? 0 : parseFloat(maintenance_cost);
    const numTotal = numPrice + numManitenance;
    
    const newOrder = await(
    //결제 서비스 추가 가정: 주문 정보 확인 후 -> 결제 요청 -> (카카오, 네이버)페이 앱 연결 -> 결제 승인, 응답 -> order주문: 승인상태 값 등록   

      await fetch('http://localhost:3000/order/make', {
        headers:{
          'x-jwt':token,
          'Content-Type': 'application/json; charset=utf-8',
        },
        method:'POST',
        body:JSON.stringify({
          dealId: deal.id,
          seller,
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
    //history.push(`/order/info/${newOrder.order.id}`)
  
    /*🌟주문 정보로 이동하 window.location.href = 'order/info/`${newOrder.order.id}`' 
      -> 라우팅된 주문정보 페이지로 이동 
      -> useParams 
      -> 주문 정보 페이지에서 let {orderId} = useParams로 fetch('order/info/`{orderId}`)
      -> 

  */
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
        <h2 className=' text-lg font-bold '>Seller</h2>
        <input 
          {...register('seller', {required: true})}
          type='text'
          
          value={deal.seller.userId}
          size={30} 
          
          className='flex-1 border-4 rounded-md focus:border-pink-400   shadow-md border-gray-300  px-2 py-1 outline-none'
          placeholder='Please write your name'
          />
        <h2 className=' text-lg font-bold '>Customer</h2>
        <input 
          {...register('customer', {required: true})}
          type='text'
          
          value={userId}
          size={30}
          className='flex-1 border-4 rounded-md focus:border-pink-400   shadow-md border-gray-300  px-2 py-1 outline-none'
          placeholder='Please write your name'
          /> 
        
        <BuyerPostcode />
        <h2 className=' text-lg font-bold '>Description</h2>
        <input
          {...register('description', {required: true})}
          type='text'
          size={30}
          className='border-4 rounded-md focus:border-pink-400   shadow-md border-gray-300  px-2 py-1 outline-none'
          value={robot.description}
        />

        <h2 className=' text-lg font-bold mr-2'>Price</h2>
        <input 
          {...register('price', {required: true})}
          type='number'
          size={30}
          className='flex-1 border-4 rounded-md focus:border-pink-400   shadow-md border-gray-300  px-2 py-1 outline-none'  
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
              className='flex-1 border-4 rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-pink-400'  
              defaultValue={robot.maintenance_cost}
              placeholder="We will strive to adust to a more reasonable price "
            />
          </>  
        ): null}
        <h2 className=' text-lg font-bold mr-2 '>{"Total"}</h2>
        <input 
          {...register('total', {required: true})}
          className='flex-1 border-4 rounded px-2 py-1 mt-2 focus:outline-none  focus:border-pink-400'  
          size={30}                      
          value={robot.price + (maintenanceYN === false ? 0 : parseFloat(robot.maintenance_cost))}
          placeholder="We will strive to adust to a more reasonable price "
        />
      </form>
      <div className="flex ml-2">
        
      </div>
      </Robot>
      <ButttonContainer className=' mt-10'>
        <button 
          onClick={onSave} 
          className=' text-2xl font-semibold w-full mx-auto mt-2 mr-6 mb-4 border-2 border-gray-100 bg-white p-6 rounded-md shadow-lg hover:bg-pink-300 transition-colors'
        > Store
        </button>  
        <button 
          onClick={onOrder} 
          className=' text-2xl font-semibold w-full mx-auto mt-2 mb-4 border-2 border-gray-100 bg-white p-6 rounded-md shadow-lg hover:bg-green-200 transition-colors'
        > Order
        </button>
      </ButttonContainer>
      
    </div>
  );
}
 
