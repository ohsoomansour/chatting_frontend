import styled from "styled-components";
import { useQuery } from "react-query";
import { BASE_PATH, getMyOrder } from "../api";
import { useRecoilValue } from "recoil";
import { tokenState } from "../recoil/atom_token";
import { Loading } from "../components/loading";
import { Helmet } from "react-helmet";
import { HandleScroll } from "../components/handleScroll";
import { getCookie } from "../utils/cookie";

const Wrapper = styled.div``;
export const CancelSVG = styled.svg`
  position:relative;
  top:3px;
  width:20px;
  height:20px;
  fill:#130f40;
  transition: fill 0.3s ease-in-out;
  &:hover {
    fill: red;
  }
`;
export enum OrderStatus {
  PaymentApproval = "PaymentApproval",
  OrderCompleted = "OrderComplete",
  Pending = "Pending",
  ReadyForDelivery = "ReadyForDelivery",
  OrderCancel = "OrderCancel",
  InDelivery = "InDelivery", 
  DeliveryCompleted = "DeliveryCompleted",
};


interface IRobot{
  description:string;
  id:number;
  name:string;
  price:number;
  maintenance_cost:number;
  rbURL:string;
  
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
interface ISeller{
  address:string;
  id: number;
  memberRole:string;
  mobile_phone:string; 
  name:string;  
  userId:string;
}
interface ICustomer{
  address:string;
  id:number;
  memberRole:string;
  mobile_phone:string;
  name:string;
  userId:string;
}

interface IMyOrder {
  address:string; 
  createdAt:string;
  id:number;
  items:Iitems;
  salesManager_mobile_phone:string;
  customer:ICustomer;
  seller:ISeller;
  status:string;
  total:number;
  deliveryCompleted_date:string;  
}
interface MyOrderInfos{
  myOrders:IMyOrder[];
  totalPages:number;
}

let page:number = 1;
export const OrderInfo = () => {
  //const token = useRecoilValue(tokenState);
  const ckToken = getCookie('token');
  const { data: myOrderInfo, isLoading, refetch }  = useQuery<MyOrderInfos>(
    ["customerOrderInfo", "ORDER"], () => getMyOrder(ckToken!, page) )
    
  const myOrders = isLoading 
    ? []
    : myOrderInfo
    ? myOrderInfo.myOrders
    : []
    console.log("myOrderInfo:",myOrderInfo);
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });

  const onNextPage = () => { page = page + 1 ;  refetch(); }
  const onPrevPage = () => { page = page - 1 ; refetch(); }   
  const onCancel = async(orderId:number) => {
    await fetch(`${BASE_PATH}/order/cancel_myorder/${orderId}`, {
      headers:{
        'Content-Type': 'application/json; charset=utf-8',
      },
      method:'DELETE'
    }).then(response => response.ok? refetch() : null )
  }
  
  return (
    <Wrapper className="mt-6">
      <Helmet>
        <title>Trader | My Order</title>
      </Helmet>
      {isLoading 
      ? <Loading /> 
      :(myOrders.map((order, index) => (
        <div key={index} className="mb-2 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl text-center font-semibold mb-4">Electronic Receipt</h2>
          <hr className="my-6" />
          <h3 className="text-lg font-semibold mb-2">Order status: </h3>
          <div className="text-right mb-4">
            <p className="text-sm text-gray-600">Order Number: {order.id}</p>
          </div>
          <div className="flex justify-between mb-4">
            <p className="text-sm text-gray-600">O/Date:</p>
            <p className="text-sm ">{`${new Date(order.createdAt)}`}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full bg-white rounded-xl shadow-md overflow-hidden p-1 mb-4">
              {order.status === OrderStatus.Pending ?
                <div className="relative h-6 flex items-center justify-center">
                  <div className="absolute top-0 bottom-0 left-0 rounded-lg w-[50%] bg-indigo-200"></div>
                  <div className="relative text-red-900 font-medium text-sm">Pending</div>
                </div>
              : null}
              {order.status === OrderStatus.ReadyForDelivery ? 
                <div className="relative h-6 flex items-center justify-center">
                  <div className="absolute top-0 bottom-0 left-0 rounded-lg w-[66.67%] bg-indigo-200"></div>
                  <div className="relative text-red-900 font-medium text-sm">Ready For Delivery</div>
                </div>
              :null}
              {order.status === OrderStatus.InDelivery ? 
                <div className="relative h-6 flex items-center justify-center">
                  <div className="absolute top-0 bottom-0 left-0 rounded-lg w-[83.34%] bg-indigo-200"></div>
                  <div className="relative text-red-900 font-medium text-sm">InDelivery</div>
                </div>
              :null}
              {order.status === OrderStatus.DeliveryCompleted? 
              <div>
                <div className="relative h-6 flex items-center justify-center">
                  <div className="absolute top-0 bottom-0 left-0 rounded-lg w-[100%] bg-indigo-200"></div>
                  <div className="relative text-red-900 font-medium text-sm">Delivery Completed ({`${order.deliveryCompleted_date}`}) </div>
                </div>            
                <div className=" text-xs text-center"></div>
              </div>
              :null}
            </div>
            <button onClick={() => onCancel(order.id)} className=" flex mx-auto p-2 bg-white rounded-lg shadow-md hover:bg-red-400 transition duration-500">
              <CancelSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
              </CancelSVG>
              Cancel
            </button>
          </div>    
          <h3 className="text-lg font-semibold mb-2">Seller Info</h3>
          <div className="flex justify-between mb-4">
            <p className="text-sm text-gray-600">O/Date:</p>
            <p className="text-sm ">{`${new Date(order.createdAt)}`}</p>
          </div>
          <div className="flex justify-between mb-4">
            <p className="text-sm text-gray-600">Sales Manager:</p>
            <p className="text-sm text-gray-600">{order.seller.name}</p>
          </div>
          <div className="flex justify-between mb-4">
            <p className="text-sm text-gray-600">Sales Manager mobile phone:</p>
            <p className="text-sm text-gray-600">{order.salesManager_mobile_phone}</p>
          </div>
            
          <hr className="my-6" />
          <h3 className="text-lg font-semibold mb-2">Buyer Info</h3>
          <div className="flex justify-between mb-4 ">
            <p className="text-sm text-gray-600">Address:</p>
            <p className="text-sm text-gray-600">{order.address} </p>
          </div>
          <div className="flex justify-between mb-4">
            <p className="text-sm text-gray-600">Name:</p>
            <p className="text-sm ">{order.customer.name}</p>
          </div>
          <div className="flex justify-between mb-4">
            <p className="text-sm text-gray-600">mobile phone:</p>
            <p className="text-sm ">{order.customer.mobile_phone}</p>
          </div>
          <hr className="my-6" />
          <h3 className="text-lg font-semibold mb-2">Items Ordered</h3>
          <div className="flex justify-between mb-2">
            <p className="text-sm">{order.items.robot.name}</p>
            <p className="text-sm font-semibold">{formatter.format(order.items.robot.price)}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-sm">Your Choice of the Maintenance:</p>
            <p className="text-sm font-semibold">({order.items.options.maintenanceYN ? 'selection' : 'deselection'})</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-sm">Maintenance Cost:</p>
            <p className="text-sm font-semibold">{formatter.format(order.items.options.maintenance_cost)}</p>
          </div>
          <hr className="my-6" />
          <div className="flex justify-between">
            <p className="text-lg">Total Amount:</p>
            <p className="text-lg font-semibold">{formatter.format(order.total)}</p>
          </div>
        </div>
        )))
      }

      <div className=" grid grid-cols-3 text-center max-w-xs items-center mx-auto">
          {page > 1 ? (<button
            onClick={onPrevPage}
            className=" focus:outline-none font-bold text-3xl">
            &larr;
          </button>
          ) : (
          <div></div>  
          )}
          <span className=" text-black">
            Page {page} of {myOrderInfo?.totalPages}
          </span>
          {page !== myOrderInfo?.totalPages ? (
            <button
              onClick={onNextPage}
              className=" focus:outline-none font-bold text-3xl">
              &rarr;
            </button>
          ) : (
            <div></div>  
          )}
        </div>
        <HandleScroll />
    </Wrapper>
  );
}