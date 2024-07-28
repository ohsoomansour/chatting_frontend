import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { IDeal, IProduct } from '../pages/ProductsTrade';
import { useRecoilValue } from 'recoil';
import BuyerPostcode from './address/buyer-address';
import { buyerAddress, buyerDetail, buyerPostal, buyerRoad } from '../recoil/atom_address';
import { ButttonContainer } from '../pages/storedGoods';
import { useQuery } from 'react-query';
import { getMyinfo } from '../api';
import { useHistory } from 'react-router-dom';
import { getCookie } from '../utils/cookie';

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
const Product = styled.div``;
const SelecOpContainer =  styled.div`
  display:flex;
  justify-content: space-around;
`;
const ProdOpSelect = styled.select`
  width: 200px;
  margin-bottom: 10px;
`;
const ProdLabel = styled.label`
  font-weight:bold;
  width: 100px;
`;
const OptTitle = styled.h2`
  font-size:20px;
  font-weight:bold;
  margin-left: 10px;
  margin-bottom:10px;
`;  
const OpQntLabel = styled.div`
  margin: 5px 15px;
`;
const OpCountDisplay = styled.input`
  width: 50px;
  text-align: center;
  font-size: 20px;
  margin: 0 10px;
`;
const OpQntUpDown = styled.span`
  cursor:pointer;
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content: space-around;
`;
const DelOpQntSVG = styled.svg`
  display:flex;
  align-items:center;
  justify-content:center;
  width: 20px;
  height: 20px;
  padding:3px;
  cursor:pointer;
  margin-left: 20px;
  border-radius: 100%;
  background-color: #e9ecef;
  transition: background-color 0.3s ease-in-out;
  &:hover{
    background-color:#de0a26;
  } 
  
`;
const UpSvg = styled.svg`
  width:20px;
  height:20px;
  background-color: #e9ecef;
  transition: fill 0.3s ease-in-out; 
  &:hover{
    fill: red; 
  }
`;
const DownSvg = styled.svg`
  width:20px;
  height:20px;
  background-color: #e9ecef;
  cursor:pointer;
  transition: 0.3s fill ease-in-out;
  &:hover{
    fill: red;
  }
`;
const VxQ = styled.span``;
const OpQntParts = styled.div`
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:center;
`;

interface IBuyerInfo{
  address:string;
  id:number;
  memberRole:string;
  mobile_phone: number;
  name:string;
  userId: string;
}
interface OrderProps{
  product:IProduct;
  deal: IDeal;
}
interface ISelecOp { 
  selec_label: string;
  op_idx:string;
  op_name:string;
  op_value:string;
  op_quantity:number;
}

const BASE_PATH = process.env.NODE_ENV === "production" 
 ? "https://trade-2507d8197825.herokuapp.com"
 : "http://localhost:3000";


export const Order = ({product, deal}:OrderProps) => {
  const ckToken = getCookie('token');
  const customerFullAddress = useRecoilValue<string>(buyerAddress); 
  const roadAddress = useRecoilValue<string>(buyerRoad);
  const postalCode = useRecoilValue<string>(buyerPostal);
  const DetailedAdd = useRecoilValue<string>(buyerDetail);
  const [maintenanceYN, setMaintenanceYN] = useState(false);
  const [opTotalVal, setOpTotalVal] = useState<number>(0);
  const [selectedOps, setSelectedOps] = useState<ISelecOp[]>([]);
  const {register, getValues} = useForm();
  const history = useHistory();
  const { data: buyerInfo, isLoading }  = useQuery<IBuyerInfo>(
    ["buyerInfo", "MEMBER"], () => getMyinfo(ckToken!)
  )
  const handleOpSelectedChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
    /* ## 선택된 옵션 리스트들 -> 고객 영수증에 표출 필요 따라서, 각 옵션을 리스트에 담아 줘야 함 
      - 필요한 형태: 김치   <option value="12000">1팩</option>     + 몇 개 추가 
                  단무지  <option value="5000">1팩</option>      + 몇 개 추가
                  선택없음
    */
    const selectedOp_lists = event.target.options;
    if(selectedOp_lists[selectedOp_lists.selectedIndex].text === "선택 없음") return;
    
    // 1. 새로운 객체  = {op_idx: '',label_id: '김치', op_name: '', op_value: '' } 의 리스트  === 새로 선택된  {label_id: '김치', op_name: '', op_value: '' } -> includes
    const new_selecOp={
      selec_label: event.target.id,
      op_idx: selectedOp_lists[selectedOp_lists.selectedIndex].id,
      op_name: selectedOp_lists[selectedOp_lists.selectedIndex].text,
      op_value: selectedOp_lists[selectedOp_lists.selectedIndex].value,
      op_quantity:1
    };
    console.log("new_selecOp:", new_selecOp)
    // 중복되는 옵션이 아니라면 선택된 전체 옵션 리스트들에 넣는다.
    let existingOp= selectedOps?.find((op) => op.op_idx === new_selecOp.op_idx);
    console.log("existingOp", existingOp);
    if(!existingOp){
      setSelectedOps((prev) => [...prev!, new_selecOp]);
      console.log("selectedOps", selectedOps)      
    } else {
      alert('이미 선택한 옵션입니다!');
      return;
    }
    
    console.log("selectedOps:", selectedOps);
    console.log("selected_option_index:", selectedOp_lists[selectedOp_lists.selectedIndex])
    console.log("selected_option_label", event.target.id) //select 태그의 id : 김치 
    console.log("selected_option_lists:", selectedOp_lists); // 전체 리스트 이거랑 비교해서 
    console.log("options_list_index", selectedOp_lists.selectedIndex)
    console.log("selected_option_list", selectedOp_lists[selectedOp_lists.selectedIndex])  // 이거랑
    console.log("selected_option_list_value", selectedOp_lists[selectedOp_lists.selectedIndex].value )

    //console.log("test", test) //5000 -> 12000
    //***끝나기 전에 값을 총 합에 넣으려면 setState hook을 사용하지 않느냐 vs hook 사용 후 정상적으로 값이 들어가느냐-> 로직, 총합은 다음 state 값으로 적절해 보임  ***
  }
  
  useEffect(() => {
    if(Array.isArray(selectedOps!)){
      //선택 옵션들이 변경되면 다시 전체 옵션 값 0으로 설정 
      let OpTotalValues = 0;
      for(const value of selectedOps!){
        // 가격 * 개수  = 몇 개 값 (1옵션 당)
        OpTotalValues += Number(value.op_value ) * value.op_quantity 
      }      
      setOpTotalVal(OpTotalValues);  //*필참:반드시 useEffect hook 또는 이벤트 헨들러 안에서 사용
    }
  }, [selectedOps]);


  const increasingQnt = (op_id:string) => {
    console.log("op_id:", op_id)
    setSelectedOps(selectedOps.map((op) => 
      op.op_idx === op_id ? {...op, op_quantity: op.op_quantity + 1 } : op
    ))
  } 
  const decreasingQnt = (op_id:string) => {
    setSelectedOps(selectedOps.map((op) => 
      op.op_idx === op_id && op.op_quantity > 1 ? {...op, op_quantity: op.op_quantity - 1} : op
    ))
  }
  const delOpQnt = (op_id:string) => {
    setSelectedOps(selectedOps.filter((op) => op.op_idx !== op_id)
    )
  }

  const handleMaintSelect = (option:boolean) => {
    setMaintenanceYN(option);
  };
  const onSave = async () => {
  const { customer, maintenance_cost, customerPhone } = getValues();
  try {
    if(customer === ''){
      alert('로그인 후 이용해 주세요!')
      return;
    } 
    if(customerPhone === ''){
      alert('고객님의 번호를 입력해 주세요!')
    } 
    if (!(/^\d{5}$/.test(postalCode.toString()) || /^\d{3,5}-\d{3,5}$/.test(postalCode.toString()))) {
      alert('우편번호가 올바른 지 확인 해주세요!');
      return;
    }  
    if(roadAddress === "") {
      alert('도로 주소가 올바른 지 확인해 주세요!');
      return;
    } 
    if(DetailedAdd.length < 5){
      alert('상세 주솟값이 올바른 지 확인해 주세요!');
      return;
    } 
    if(customerFullAddress === "") {
      alert('전체 주솟값 올바른 지 확인해 주세요!')
    }
  } catch (e) {
    console.error(e);
  }

  const numSeletedManitenance = maintenance_cost === undefined ? 0 : product.maintenance_cost;
  const numTotal = product.price + opTotalVal + numSeletedManitenance;
  
  //결제 서비스 추가 가정: 주문 정보 확인 후 -> 결제 요청 -> (카카오, 네이버)페이 앱 연결 -> 결제 승인, 응답 -> order주문: 승인상태 값 등록   
  await fetch(`${BASE_PATH}/order/storegoods`, {
    headers:{
      'x-jwt':ckToken!,
      'Content-Type': 'application/json; charset=utf-8',
    },
    method:'POST',
    body:JSON.stringify({
      dealId: deal.id,
      customer,
      payment:{
        price:product.price,   
        maintenanceYN,
        maintenance_cost: numSeletedManitenance, //{ maintenanceYN: true, maintenance_cost: '100' }
        total: numTotal, 
      },
    })
  }).then(res => res.ok? alert('고객님이 선택하신 제품을 카트에 담았고 쇼핑을 계속하세요!💛') : alert('🚫고객님이 선택하신 제품의 저장을 실패 하였습니다. '))
   
}

const formatter = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW'
});

 const onOrder = async() => {
    //판매자 추가
    const {seller,sellerPhone, customer , maintenance_cost } = getValues()
    const numProdPrice = product.price;
    const numSeletedManitenance = maintenance_cost === undefined ? 0 : product.maintenance_cost;
    // 옵션 값 추가 selectedOptionsValues
    const numTotal = numProdPrice + opTotalVal + numSeletedManitenance;
    
    //결제 서비스 추가 가정: 주문 정보 확인 후 -> 결제 요청 -> (카카오, 네이버)페이 앱 연결 -> 결제 승인, 응답 -> order주문: 승인상태 값 등록   
      await fetch(`${BASE_PATH}/order/make`, {
        headers:{
          'x-jwt':ckToken!,
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
            product: product,  
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
      <Product>
        <SellerAndCustomerInfo className='ml-2'>
          <div className=' flex mb-4'>
            <div className='w-2/4 flex-col'>
              <h2 className=' ml-4 text-lg text-center font-bold '>Seller Information</h2>
              <input 
                {...register('seller', {required: true})}
                type='text'
                value={deal?.seller?.userId || ""}
                size={30} 
                className='w-full mb-1 flex-1 border-4 rounded-md focus:border-pink-400   shadow-md border-gray-300  px-2 py-1 outline-none'
                placeholder='Please write your name'
              />
              <input 
                {...register('sellerPhone', {required: true})}
                value={deal?.salesManager_mobilephone || ""}
                className='w-full  flex-1 border-4 rounded-md focus:border-pink-400   shadow-md border-gray-300  px-2 py-1 outline-none'
                placeholder='Please write your phone number'
              /> 

            </div>

            <div className=' w-2/4 flex-col ml-1 '>  
              <h2 className=' ml-4 text-lg text-center font-bold '>Customer Information</h2>
              <input 
                {...register('customer', {required: true})}
                type='text'
                value={buyerInfo?.userId || ""}
                className=' w-full mb-1 flex-1 border-4 rounded-md focus:border-pink-400   shadow-md border-gray-300  px-2 py-1 outline-none'
                placeholder='Please write your name'
                />
              <input 
                {...register('customerPhone', {required: true})}
                className=' w-full  flex-1 border-4 rounded-md focus:border-pink-400   shadow-md border-gray-300  px-2 py-1 outline-none'
                value={buyerInfo?.mobile_phone || ""}
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
            value={product.description}
          />
         {deal.product.maintOpYN? <MantenanceOption className=" mt-10 mb-5">
            <div className="flex ml-2">
              <h2 className="text-center text-xl font-bold mr-2">Do you need maintenance?</h2>
              <div
                className={`py-2 px-4 mr-2 rounded-lg text-white font-semibold cursor-pointer ${
                  maintenanceYN === true  ? 'bg-red-500' : 'bg-gray-300'
                }`}
                onClick={() => handleMaintSelect(true)}
              >
                Yes
              </div>
              <div
                className={`py-2 px-4 rounded-lg text-white font-semibold cursor-pointer ${
                  maintenanceYN === false ? 'bg-red-500' : 'bg-gray-300'
                }`}
                onClick={() => handleMaintSelect(false)}
              >
                No
              </div>
            </div>
          </MantenanceOption> : null}
          <hr className=' border border-s border-gray-300 shadow-lg mb-1 mt-2  '/>
          <OptTitle>상품에 필요한 옵션을 고르세요.</OptTitle>
          {deal?.product.options?.map((op, index) => (
            <SelecOpContainer key={op.option_index}  >
              <ProdLabel htmlFor={op.option_title} >{op.option_title}</ProdLabel>
              <ProdOpSelect
                id={op.option_title}   
                onChange={(e) => 
                  handleOpSelectedChange(e)
                } 
              >
                {op.option_parts.map((op_parts) => (
                  <>
                  <option>{"선택 없음"}</option>
                  <option id={op_parts.optPart_idx} key={op_parts.optPart_idx} value={op_parts.price}>{op_parts.part_name}</option>
                  </>
                ))}
              </ProdOpSelect>
            </SelecOpContainer>
          ))}
           <hr className=' border border-solid border-gray-300 shadow-lg mb-1 mt-2  '/>
          {selectedOps?.map((op, idx) => (
            <div key={idx}>
              <OpQntLabel >{op.selec_label} {op.op_name}</OpQntLabel>
              <OpQntUpDown >
                <OpQntParts>
                  <UpSvg onClick={() => decreasingQnt(op.op_idx)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
                  </UpSvg>
                  <OpCountDisplay readOnly value={op.op_quantity} /> 
                  <DownSvg onClick={() => increasingQnt(op.op_idx)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                  </DownSvg>
                </OpQntParts>
                <OpQntParts>
                  <VxQ>{Number(op.op_value) * op.op_quantity}</VxQ>
                    <DelOpQntSVG
                      onClick={() => delOpQnt(op.op_idx)} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 384 512"
                    >
                      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                    </DelOpQntSVG>
                </OpQntParts>
              </OpQntUpDown>
            </div>
          ))}
          <hr className=' border border-solid border-gray-300 shadow-lg mb-4  mt-2'/>
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
                defaultValue={formatter.format(product.price)}
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
                    defaultValue={formatter.format(product.maintenance_cost)}
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
                  value={formatter.format(product.price + (maintenanceYN === false ? 0 : product.maintenance_cost) +  opTotalVal)}
                  placeholder="We will strive to adust to a more reasonable price "
                />
              </div>
            </div>
          </div>
        </SellerAndCustomerInfo>
      </Product>
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
 
