import { useQuery } from "react-query"
import { useRecoilValue } from "recoil"
import { tokenState } from "../recoil/atom_token"
import { storedGoods } from "../api"
import { Loading } from "../components/loading";
import styled from "styled-components";
import { IRobot } from "./takeordersInfo";
import { userIdState } from "../recoil/atom_user";
import StoredGoodsPostcode from "../components/address/storedGoods-address";
import { storedGoddsDetailed, storedGoodsAddress, storedGoodsPostal, storedGoodsRoad } from "../recoil/atom_address";
import { Helmet } from "react-helmet";
import { BASE_PATH } from "./logIn";
import { useForm } from "react-hook-form";

interface ISeller {
  address:string;
  id:number;
  memberRole:string; 
  name:string; 
  userId:string; 
}

interface IStoredDeal {
  compaBrand_ImgURL:string;
  compa_name:string
  createdAt: string;
  id:number;
  robot:IRobot;
  robotId:number;
  salesManager_mobilephone:string;
  seller:ISeller;
  sellerId:number;
  seller_address:string;
  updatedAt:string;
}
interface IMember{
  address: string;
  createdAt:string;
  id:number;
  lastActivityAt: string;
  memberRole: string;
  name:string;
  userId:string;
}

interface IPayment{
  maintenanceYN:boolean;
  maintenance_cost: number;
  price:number;
  total:number;
}

interface IStore {
  deal:IStoredDeal;
  id:number;
  member:IMember;
  payment:IPayment;
}

interface IMyStoredDeals {
  mySavings:IStore[];
  totalPages:number;
}

const Wrapper = styled.div``;
const DealContainer= styled.div``;

const CompaWrapper = styled.div`
  display:flex;
`
const CompaName = styled.span`
  margin-left:90px;
`;
export const ButttonContainer = styled.div`
  display:flex;
`
let page:number = 1; 
export const StoredGoods = () => {
  const onNextPage = () => { page = page + 1 ;  refetch(); }
  const onPrevPage = () => { page = page - 1 ; refetch(); }
  const token = useRecoilValue(tokenState);
  const me = useRecoilValue(userIdState);
  const addressYo = useRecoilValue(storedGoodsAddress)
  const postalCode = useRecoilValue(storedGoodsPostal);
  const streetAddress = useRecoilValue(storedGoodsRoad);
  const detailedAddress = useRecoilValue(storedGoddsDetailed);

  const {data: mystoredDeals, isLoading, refetch } = useQuery<IMyStoredDeals>(
    ["getStoredGoods","ORDER"], () => storedGoods(token, page)
  )
  console.log("storedDeals:")
  console.log(mystoredDeals)

  const stores = isLoading 
    ? []
    : mystoredDeals
    ? mystoredDeals.mySavings
    : [];
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  const onDelete = async (storageId:number) => {
    const isDel = 
    await fetch(`${BASE_PATH}/order/deletestoredgoods/${storageId}`, {
      method: 'DELETE',
      headers:{
        'x-jwt':token,
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then(response => response.ok ? refetch() : null );
    
    console.log('isDel');
    console.log(isDel);
  }
  const onOrder = async(store:IStore) => {
  //결제 서비스 추가: 주문 정보 확인 후 -> 결제 요청 -> (카카오, 네이버)페이 모듈 연결 -> 결제 승인, 응답 -> order주문: 승인상태 값 등록   
    if(  !(/^\d{5}$/.test(postalCode.toString()) || /^\d{3,5}-\d{3,5}$/.test(postalCode.toString())) ){
      alert('우편 번호가 정상 코드가 아닙니다!💛');
      return;
    } else if(streetAddress === "") {
      alert("도로 주솟값이 없습니다!💛");
      return;
    } else if(detailedAddress.length < 5) {
      alert('상세 주솟값을 5자 이상 작성해 주세요!💛');
      return;
    }
  
    const newOrder = await(
      await fetch(`${BASE_PATH}/order/make`, {
        headers:{
          'x-jwt':token,
          'Content-Type': 'application/json; charset=utf-8',
        },
        method:'POST',
        body:JSON.stringify({
          dealId: store.deal.id,
          seller: store.deal.seller.userId,
          salesManager_mobile_phone: store.deal.salesManager_mobilephone,
          customer: me,
          address: addressYo,
          items:{
            robot: store.deal.robot,   //relation으로 price 여기에 포함되어있고 가져오면됨  
            options:{
              maintenanceYN: store.payment.maintenanceYN,
              maintenance_cost: store.payment.maintenance_cost, //{ maintenanceYN: true, maintenance_cost: '100' }
            }
          },
          total: store.payment.total , //문제: total: ''  빈값 + string 값 
          
        })
      })
    ).json();
    onDelete(store.id);
    console.log('newOrder:')
    console.log(newOrder);
    
  }
  return (
    <Wrapper className=" mt-6">
      <Helmet>
        <title>Stored Goods</title>
      </Helmet>
      <h1 className=" text-2xl text-center font-semibold mb-4" > {me+ "님 안녕하세요" }</h1>
      <p className=" mb-6 text-xl text-center font-semibold">{"아래의 로봇 제품들은 고객님께서 미리 담기를 선택하신 목록입니다. "}</p>
      {isLoading 
        ? <Loading /> 
        : (stores.map((store, index) => (
          <DealContainer key={index} className="mb-2 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"> 
            <CompaWrapper >
              <img alt='company logo' src={store.deal.compaBrand_ImgURL} width={"23%"} height={"20%"} className=" inline-block"></img>
              <CompaName className="text-lg font-semibold ">{store.deal.compa_name} Co., Ltd</CompaName>
            </CompaWrapper>

            <div className="flex justify-between mt-2 mb-2">
              <p className="text-sm">{'Sales Manager'}</p>
              <p className="text-sm font-semibold">{store.deal.seller.name}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">{"Sales Manager Moible Phone"}</p>
              <p className="text-sm font-semibold">{store.deal.salesManager_mobilephone}</p>
            </div>
            <hr className="my-6" />
            <StoredGoodsPostcode />
            <div className="flex justify-between mb-2">
              <p className="text-sm">{store.deal.robot.name}</p>
              <p className="text-sm font-semibold">{formatter.format(store.payment.price)}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">Your Selection of the Maintenance:</p>
              <p className="text-sm font-semibold">({store.payment.maintenanceYN ? 'selected' : 'deselected'})</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">{"Maintenance Cost"}</p>
              <p className="text-sm font-semibold">{formatter.format(store.payment.maintenance_cost)}</p>
            </div>
            <hr className="my-6" />
            <div className="flex justify-between">
              <p className="text-lg">Total Amount:</p>
              <p className="text-lg font-semibold">{formatter.format(store.payment.total)}</p>
            </div>
            <ButttonContainer>
              <button onClick={() => onOrder(store)} className=' font-semibold w-full mx-auto mt-6 mb-2 mr-2 border-2 border-gray-100 bg-white p-6 rounded-md shadow-lg hover:bg-green-200 transition duration-500'>Order</button>
              <button onClick={() => onDelete(store.id)} className=' font-semibold w-full mx-auto mt-6 mb-2 border-2 border-gray-100 bg-white p-6 rounded-md shadow-lg hover:bg-red-400 transition duration-500'>Delete</button>
            </ButttonContainer>
          </DealContainer>
        ))

      )}
      <div className=" grid grid-cols-3 text-center max-w-xs items-center mx-auto">
          {page > 1 ? (<button
            onClick={onPrevPage}
            className=" focus:outline-none font-bold text-3xl">
            &larr;
          </button>
          ) : (
          <div></div>  
          )}
          <span>
            Page {page} of {mystoredDeals?.totalPages}
          </span>
          {page !== mystoredDeals?.totalPages? (
            <button
              onClick={onNextPage}
              className=" focus:outline-none font-bold text-3xl">
              &rarr;
            </button>
          ) : (
            <div></div>  
          )}
        </div>
    </Wrapper>
  )

}