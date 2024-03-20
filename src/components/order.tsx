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
import { useHistory } from 'react-router-dom';

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

const SellerAndCustomerInfo = styled.form`
  background-color:${(props) => props.theme.bgColor};
  border-radius:15px;
  padding:10px;
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
 ? "https://trade-2507d8197825.herokuapp.com"
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
  const history = useHistory();
  const { data: buyerInfo, isLoading }  = useQuery<IBuyerInfo>(
    ["buyerInfo", "MEMBER"], () => getMyinfo(token)
  )

  console.log("buyerInfo",buyerInfo);
  
  const handleOptionSelect = (option:boolean) => {
    setMaintenanceYN(option);
  };
  const onSave = async () => {
  const { customer, maintenance_cost, customerPhone } = getValues();
  try {
    if(customer === ''){
      alert('로그인 후 이용해 주세요!💛')
      return;
    } else if(customerPhone === ''){
      alert('고객님의 번호를 입력해 주세요!💛')
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
        price:robot.price,   
        maintenanceYN,
        maintenance_cost: numSeletedManitenance, //{ maintenanceYN: true, maintenance_cost: '100' }
        total: numTotal, 
      },
    })
  }).then(res => res.ok? alert('고객님이 선택하신 제품을 카트에 담았고 쇼핑을 계속하세요!💛') : alert('🚫고객님이 선택하신 제품의 저장을 실패 하였습니다. '))
   
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});
 const onOrder = async() => {
    //판매자 추가
    const {seller,sellerPhone, customer , maintenance_cost } = getValues()
    const numPrice = robot.price;
    const numSeletedManitenance = maintenance_cost === undefined ? 0 : robot.maintenance_cost;
    const numTotal = numPrice + numSeletedManitenance;
    
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
          address:customerFullAddress,
          items:{
            robot: robot,  
            options:{
              maintenanceYN: maintenanceYN,
              maintenance_cost: numSeletedManitenance, 
            }
          },
          total:numTotal, 
        })
      }).then((response) => response.ok ? window.location.href = "/order/info" : history.go(0));
  }
  return (
    <div className=' w-2/4'>
      <Robot>
        <SellerAndCustomerInfo className='ml-2'>
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
        </SellerAndCustomerInfo>
      </Robot>
      <ButttonContainer className=' mt-10'>
        <button 
          onClick={onSave} 
          className=' text-2xl font-semibold w-full mx-auto mt-2 mr-6 mb-4 border-2 border-gray-100 bg-white p-6 rounded-md shadow-lg hover:bg-pink-300 transition duration-500'
        > Pre-Save
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
 
