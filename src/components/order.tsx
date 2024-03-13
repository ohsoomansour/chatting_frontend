import { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { IDeal, IRobot } from '../pages/TradePlatform';
import { useRecoilValue } from 'recoil';
import { tokenState } from '../recoil/atom_token';
import { userIdState } from '../recoil/atom_user';
import BuyerPostcode from './address/buyer-address';
import { buyerAddress, buyerDetail, buyerPostal, buyerRoad } from '../recoil/atom_address';
import { ButttonContainer } from '../pages/storedGoods';
import { useQuery } from 'react-query';
import { getMyinfo } from '../api';

const PlusSvg = styled.svg`
  fill:red;
  width:30px;
  height:30px;
  margin: 0 5px;
`;
const Equalsvg = styled.svg`
  fill:red;
  width:30px;
  height:30px;
  margin: 0 5px;
`;
const TransactionSvg = styled.svg`
  position:relative;
  top:20px;
  fill:#374D9A;
  width:35px;
  height:35px;
  margin: 0 5px;
`;


const MantenanceOption = styled.div``;
const Robot = styled.div``;

interface IBuyerInfo{
  address:string;
  id:number;
  memberRole:string;
  mobile_phone: number;
  name:string;
  userId: string;
}

interface OrderProps{
  robot:IRobot;
  deal: IDeal;
}
const BASE_PATH = process.env.NODE_ENV === "production" 
 ? "https://trade.herokuapp.com"
 : "http://localhost:3000";

export const Order = ({robot, deal}:OrderProps) => {
  const token = useRecoilValue<string>(tokenState);
  const userId = useRecoilValue<string>(userIdState);
  const customerFullAddress = useRecoilValue<string>(buyerAddress); 
  const roadAddress = useRecoilValue<string>(buyerRoad);
  const postalCode = useRecoilValue<string>(buyerPostal);
  const DetailedAdd = useRecoilValue<string>(buyerDetail);
  const [maintenanceYN, setMaintenanceYN] = useState(false);
  const {register, getValues} = useForm();
  const { data: buyerInfo, isLoading }  = useQuery<IBuyerInfo>(
    ["buyerInfo", "MEMBER"], () => getMyinfo(token)
  )

  console.log("buyerInfo",buyerInfo);
  
  const handleOptionSelect = (option:boolean) => {
    setMaintenanceYN(option);
  };
  const onSave = async () => {
  const { customer, price , maintenance_cost } = getValues();
  try {
    if(customer === ''){
      alert('로그인 후 이용해 주세요!💛')
      return;
    } else if (!(/^\d{5}$/.test(postalCode.toString()) || /^\d{3,5}-\d{3,5}$/.test(postalCode.toString()))) {
      alert('우편번호가 올바른 지 확인 해주세요!💛');
      return;
    }  else if(roadAddress === "") {
      alert('도로 주소가 올바른 지 확인해 주세요!💛');
      return;
    } else if(DetailedAdd.length < 5){
      alert('상세 주솟값이 올바른 지 확인해 주세요!💛');
      return;
    } else if(customerFullAddress === "") {
      alert('전체 주솟값 올바른 지 확인해 주세요!💛')
    }
  } catch (e) {
    console.error(e);
  }
  const numSeletedManitenance = maintenance_cost === undefined ? 0 : robot.maintenance_cost;
  const numTotal = robot.price + numSeletedManitenance;
    
  
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
        price:robot.price,   //relation으로 price 여기에 포함되어있고 가져오면됨  
        maintenanceYN,
        maintenance_cost: numSeletedManitenance, //{ maintenanceYN: true, maintenance_cost: '100' }
        total: numTotal, //문제: total: ''  빈값 + string 값
      },
    })
  }).then(res => res.ok? alert('고객님이 선택하신 제품을 카트에 담았고 쇼핑을 계속하세요!💛') : alert('🚫고객님이 선택하신 제품의 저장을 실패 하였습니다. '))
   
}
/*
      <TransactionSvg
        className=' ml-4 mr-4 justify-between' 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 640 512"
      >
        <path d="M323.4 85.2l-96.8 78.4c-16.1 13-19.2 36.4-7 53.1c12.9 17.8 38 21.3 55.3 7.8l99.3-77.2c7-5.4 17-4.2 22.5 2.8s4.2 17-2.8 22.5l-20.9 16.2L512 316.8V128h-.7l-3.9-2.5L434.8 79c-15.3-9.8-33.2-15-51.4-15c-21.8 0-43 7.5-60 21.2zm22.8 124.4l-51.7 40.2C263 274.4 217.3 268 193.7 235.6c-22.2-30.5-16.6-73.1 12.7-96.8l83.2-67.3c-11.6-4.9-24.1-7.4-36.8-7.4C234 64 215.7 69.6 200 80l-72 48V352h28.2l91.4 83.4c19.6 17.9 49.9 16.5 67.8-3.1c5.5-6.1 9.2-13.2 11.1-20.6l17 15.6c19.5 17.9 49.9 16.6 67.8-2.9c4.5-4.9 7.8-10.6 9.9-16.5c19.4 13 45.8 10.3 62.1-7.5c17.9-19.5 16.6-49.9-2.9-67.8l-134.2-123zM16 128c-8.8 0-16 7.2-16 16V352c0 17.7 14.3 32 32 32H64c17.7 0 32-14.3 32-32V128H16zM48 320a16 16 0 1 1 0 32 16 16 0 1 1 0-32zM544 128V352c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V144c0-8.8-7.2-16-16-16H544zm32 208a16 16 0 1 1 32 0 16 16 0 1 1 -32 0z"/>
      </TransactionSvg>
*/
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});
 const onOrder = async() => {
    //판매자 추가
    const {seller,sellerPhone, customer , maintenance_cost } = getValues()
    console.log("seller:")
    console.log(seller);
    const numPrice = robot.price;
    const numSeletedManitenance = maintenance_cost === undefined ? 0 : robot.maintenance_cost;
    const numTotal = numPrice + numSeletedManitenance;
    
    const newOrder = await(
    //결제 서비스 추가 가정: 주문 정보 확인 후 -> 결제 요청 -> (카카오, 네이버)페이 앱 연결 -> 결제 승인, 응답 -> order주문: 승인상태 값 등록   
      await fetch(`${BASE_PATH}/order/make`, {
        headers:{
          'x-jwt':token,
          'Content-Type': 'application/json; charset=utf-8',
        },
        method:'POST',
        body:JSON.stringify({
          dealId: deal.id,
          seller,
          salesManager_mobile_phone: sellerPhone ,
          customer,
          //customer_mobile_phone: customerPhone,
          address:customerFullAddress,
          items:{
            robot: robot,   //relation으로 price 여기에 포함되어있고 가져오면됨  
            options:{
              maintenanceYN: maintenanceYN,
              maintenance_cost: numSeletedManitenance, //{ maintenanceYN: true, maintenance_cost: '100' }
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
    <div className=' w-2/4'>
      
      <Robot>
      <form className='ml-2'>
        <div className=' flex mb-4'>
          <div className='w-2/4 flex-col'>
            <h2 className=' ml-4 text-lg text-center font-bold '>Seller Information</h2>
            <input 
              {...register('seller', {required: true})}
              type='text'
              value={deal.seller.userId}
              size={30} 
              className='w-full mb-1 flex-1 border-4 rounded-md focus:border-pink-400   shadow-md border-gray-300  px-2 py-1 outline-none'
              placeholder='Please write your name'
            />
            <input 
              {...register('sellerPhone', {required: true})}
              value={deal.salesManager_mobilephone}
              className='w-full  flex-1 border-4 rounded-md focus:border-pink-400   shadow-md border-gray-300  px-2 py-1 outline-none'
              placeholder='Please write your phone number'
            /> 

          </div>

          <div className=' w-2/4 flex-col ml-1 '>  
            <h2 className=' ml-4 text-lg text-center font-bold '>Customer Information</h2>
            <input 
              {...register('customer', {required: true})}
              type='text'
              value={userId}
              className=' w-full mb-1 flex-1 border-4 rounded-md focus:border-pink-400   shadow-md border-gray-300  px-2 py-1 outline-none'
              placeholder='Please write your name'
              />
            <input 
              {...register('customerPhone', {required: true})}
              className=' w-full  flex-1 border-4 rounded-md focus:border-pink-400   shadow-md border-gray-300  px-2 py-1 outline-none'
              value={buyerInfo?.mobile_phone}
              placeholder='Please write your name'
              />   
          </div>
        </div>
        <BuyerPostcode />
        <h2 className=' text-center text-lg font-bold '>Description</h2>
        <input
          {...register('description', {required: true})}
          type='text'
          
          className='text-center font-semibold text-gray-500 w-full mx-auto border-4 rounded-md focus:border-pink-400   shadow-md border-gray-300  px-2 py-1 outline-none'
          value={robot.description}
        />
        <MantenanceOption className=" mt-10 mb-5">
          <div className="flex ml-2">
            <h2 className="text-center text-xl font-bold mr-2">Do you need maintenance?</h2>
            <div
              className={`py-2 px-4 mr-2 rounded-lg text-white font-semibold cursor-pointer ${
                maintenanceYN === true  ? 'bg-red-500' : 'bg-gray-300'
              }`}
              onClick={() => handleOptionSelect(true)}
            >
              Yes
            </div>
            <div
              className={`py-2 px-4 rounded-lg text-white font-semibold cursor-pointer ${
                maintenanceYN === false ? 'bg-red-500' : 'bg-gray-300'
              }`}
              onClick={() => handleOptionSelect(false)}
            >
              No
            </div>
          </div>
        </MantenanceOption>
        <hr className=' border border-solid border-gray-300 shadow-lg mb-1  '/>
        <div className=' flex justify-around'>
          <h2 className='text-lg  text-center font-bold '>Price</h2>
          <h2 className=' text-lg text-gray-400 text-center font-semibold '>Maintenance Cost</h2>
          <h2 className=' text-lg text-center font-bold  '>{"Total"}</h2>
        </div>
        <div className=' flex w-full'>
          <div className=' flex-col flex w-full'>
            <input 
              {...register('price', {required: true})}
              //type='number'
              className=' w-full  border-4 rounded-md focus:border-pink-400   shadow-md border-gray-300  px-2 py-1 outline-none'  
              defaultValue={formatter.format(robot.price)}
              placeholder="We will strive to adust to a more reasonable price "
            />
          </div>
          <div className=' flex-col  w-full'>
            {maintenanceYN? (
              <>
              <div className=' flex w-full'>
                <PlusSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                 <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
                </PlusSvg>
                <input 
                  {...register('maintenance_cost')}
                  //type='number'
                  //size={30}
                  className=' w-full  border-4 rounded px-2 py-1  focus:outline-none  focus:border-pink-400 '  
                  defaultValue={formatter.format(robot.maintenance_cost)}
                  placeholder="We will strive to adust to a more reasonable price "
                />
              </div>    
              </>  
            ): null}
          </div>
          <div className=' flex-col w-full'>
            <div className=' flex w-full'>
              <Equalsvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M48 128c-17.7 0-32 14.3-32 32s14.3 32 32 32H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H48zm0 192c-17.7 0-32 14.3-32 32s14.3 32 32 32H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H48z"/>
              </Equalsvg>
              <input 
                {...register('total', {required: true})}
                className= ' w-full text-lg  border-4 rounded px-2 py-1  focus:outline-none  focus:border-pink-400'                   
                value={formatter.format(robot.price + (maintenanceYN === false ? 0 : robot.maintenance_cost) )}
                placeholder="We will strive to adust to a more reasonable price "
              />
            </div>
          </div>
        </div>
      </form>
      <div className="flex ml-2">
        
      </div>
      </Robot>
      <ButttonContainer className=' mt-10'>
        <button 
          onClick={onSave} 
          className=' text-2xl font-semibold w-full mx-auto mt-2 mr-6 mb-4 border-2 border-gray-100 bg-white p-6 rounded-md shadow-lg hover:bg-pink-300 transition duration-500'
        > Store
        </button>  
        <button 
          onClick={onOrder} 
          className=' text-2xl font-semibold w-full mx-auto mt-2 mb-4 border-2 border-gray-100 bg-white p-6 rounded-md shadow-lg hover:bg-green-200 transition duration-500'
        > Order
        </button>
      </ButttonContainer>
      
    </div>
  );
}
 
