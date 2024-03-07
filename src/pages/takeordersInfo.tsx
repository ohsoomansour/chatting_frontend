import { useQuery } from "react-query";
import { BASE_PATH, takeOrders } from "../api";
import { useRecoilValue } from "recoil";
import { tokenState } from "../recoil/atom_token";
import styled from "styled-components";
import { Loading } from "../components/loading";
import { Helmet } from "react-helmet";

const Wrapper = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
`;
const TotalSales = styled.div``;

interface ICustomer{
  address:string;
  id:number;
  name:string;
  userId:string;
}

interface IDeal{
  compaBrand_ImgURL:string;
  compa_name:string;
  createdAt: string;
  id:number; 
  robotId:number;
  sellerId:number;
  seller_address:string;
}
interface Iitems{
  createdAt:string;
  id:number;
  robot:IRobot;
  options:{
    maintenanceYN:boolean;
    maintenance_cost:number;
  }
}
export interface IRobot{
  description:string;
  id:number;
  name:string;
  price:number;
  maintenance_cost:number;
  rbURL:string;
}
interface ITakingOrders {
  createdAt:string;
  address:string; //판매자 주소
  id:number;  //판매자 id
  customer:ICustomer;
  deal:IDeal;
  items:Iitems;
  status:string;
  total:number;
  memberRole:string; //사이트에서 판매자는 client 
  takingorders:ITakingOrders[] //판매자가 받은 주문 리스트들
}
interface ISellerTakingOrders {
  takingOrders:ITakingOrders[];
  totalPages:number;
  salesCount:number;
  totalSales:number;
}

let page:number = 1; 
export const TakingOrderInfo = () => {
  const token = useRecoilValue(tokenState);
  const onNextPage = () => { page = page + 1 ;  refetch(); }
  const onPrevPage = () => { page = page - 1 ; refetch(); }   

  // next버튼, page:1 ->  prev버튼 page:2 -> 1   
  const { data: takingOrderInfos, isLoading, refetch }  = useQuery<ISellerTakingOrders>(
    ["takeOrdersInfo", "ORDER"], () => takeOrders(token, page)
  )
  console.log('takeOrdersInfos:')
  console.log(takingOrderInfos);
  const takeOrderInfos = isLoading
    ? []
    : takingOrderInfos
    ? takingOrderInfos.takingOrders
    : [];
    const totalSales = takingOrderInfos?.totalSales!;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
   
    const  onUpdateStats = async(orderId:number) => {
      await fetch(`${BASE_PATH}/order/update_orderstatus/${orderId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PATCH',
      }).then(response => response.ok ? refetch() : null)
    }
  //주문 정보에 카카오 PAY의 결제 승인 response -> 존재하면 주문 정보 보여준다. 
  
  return (
    <Wrapper className="mt-6 ">
      <Helmet>
        <title>Trader | My Sales</title>
      </Helmet>
      <TotalSales className=" w-2/4 border-4 border-gray-100 p-4 shadow-lg rounded-lg">
        <h1 className=" text-xl text-center font-semibold">Sales Status</h1>
        <hr className="my-4" />
        <div className="flex justify-between ">
          <p className="text-lg">Total number of orders:</p>
          <p className="text-lg font-semibold">{takingOrderInfos?.salesCount}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-lg">Total Sales:</p>
          <p className="text-lg font-semibold">{ formatter.format(totalSales)}</p>
        </div>
      </TotalSales>
      <div className=" grid grid-cols-3 mt-10 gap-x-5 gap-y-10">
        {isLoading 
          ? <Loading /> 
          :  ( takeOrderInfos.map((order, index) => (
            //<div key={index} className="mb-2 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">  
            <div key={index} className=" mb-2 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md ">  
              <h2 className="text-2xl text-center font-semibold mb-4">Electronic Receipt</h2>
              <div className="flex justify-between mb-4">
                <p className="text-sm text-gray-600">Date: {order.createdAt}</p>
                <p className="text-sm text-gray-600">Order Number:{order.id}</p>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-sm text-gray-600">Order Status:</p>
                <button
                  className="font-semibold w-2/4 mx-auto mt-6 mb-2 mr-2 border-2 border-gray-100 bg-white p-2 rounded-md shadow-lg hover:bg-indigo-200 transition duration-500" 
                  onClick={() => onUpdateStats(order.id)}
                >
                  {order.status}
                </button>
              </div>
              <hr className="my-6" />
              <div className="flex justify-between mb-4">
              <p className="text-sm text-gray-600">Address: {order.address}</p>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-sm text-gray-600">Customer name:</p>
                <p className="text-sm font-semibold">{order.customer.name}</p>
              </div>
              <div className="flex justify-between mb-4">
                <p className="text-sm text-gray-600">Customer Email:</p>
                <p className="text-sm font-semibold">{order.customer.userId}</p>
              </div>
              <hr className="my-6" />
              <h3 className="text-lg font-semibold mb-2">Items Ordered</h3>
              <div className="flex justify-between ">
                <p className="text-sm">{order.items.robot.name}</p>
                <p className="text-sm font-semibold">{formatter.format(order.items.robot.price)}</p>
              </div>
              <div className="flex justify-between ">
                <p className="text-sm">Your Selection of the Maintenance:</p>
                <p className="text-sm font-semibold">({order.items.options.maintenanceYN ? 'selection' : 'deselection'})</p>
              </div>
              <div className="flex justify-between ">
                <p className="text-sm">Maintenance Cost</p>
                <p className="text-sm font-semibold">{formatter.format(order.items.options.maintenance_cost)}</p>
              </div>
              <hr className="my-6" />
              <div className="flex justify-between">
                <p className="text-lg">Total Amount:</p>
                <p className="text-lg font-semibold">{formatter.format(order.total)}</p>
              </div>
              
            </div>

          )) 
        )}
      </div>
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
            Page {page} of {takingOrderInfos?.totalPages}
          </span>
          {page !== takingOrderInfos?.totalPages ? (
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
  );
}