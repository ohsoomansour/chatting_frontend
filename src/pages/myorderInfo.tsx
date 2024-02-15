import styled from "styled-components";
import { useQuery } from "react-query";
import { getMyOrder } from "../api";
import { useRecoilValue } from "recoil";
import { tokenState } from "../recoil/atom_token";
import { Loading } from "../components/loading";

export enum OrderStatus  {
  Pending = "Pending",
  OrderCompleted = "OrderComplete",
  OrderApproval = "OrderApproval",
  PaymentApproval = "PaymentApproval",
  ReadyForDelivery = "ReadyForDelivery",
  InDelivery = "InDelivery", 
  DeliveryCompleted = "DeliveryCompleted",
  TransactionCompleted = "TransactionCompleted"
}


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

interface IOrder{
  address:string; 
  createdAt:string;
  id:number;
  items:Iitems;
  status:string;
  total:number;  
}

interface IMyOrders {
  address:string; //판매자 주소
  id:number;  //판매자 id
  memberRole:string; //사이트에서 판매자는 client 
  name:string; // 판매자 이름 
  order:IOrder[] //판매자가 받은 주문 리스트들
}
const Wrapper = styled.div``;

export const OrderInfo = () => {
  const token = useRecoilValue(tokenState);
  const { data: myOrderInfo, isLoading }  = useQuery<IMyOrders>(
    ["customerOrderInfo", "ORDER"], () => getMyOrder(token)
  )

  const myOrderInfos = isLoading 
    ? []
    : myOrderInfo
    ? myOrderInfo.order
    : [];


  return (
    <Wrapper className="mt-6">
      {isLoading 
      ? <Loading /> 
      :(myOrderInfos.map((order, index) => (
        <div key={index} className="mb-2 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Electronic Receipt</h2>
          <div className="flex justify-between mb-4">
            <p className="text-sm text-gray-600">Date: {order.createdAt}</p>
            <p className="text-sm text-gray-600">Address: {order.address} </p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Order Number:</p>
            <p className="text-lg font-semibold">{order.id}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Customer Name:</p>
            <p className="text-lg font-semibold">{myOrderInfo?.name}</p>
          </div>
          <hr className="my-6" />
          <h3 className="text-lg font-semibold mb-2">Items Ordered</h3>
          <div className="flex justify-between mb-2">
            <p className="text-sm">{order.items.robot.name}</p>
            <p className="text-sm font-semibold">${order.items.robot.price}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-sm">Your Choice of the Maintenance:</p>
            <p className="text-sm font-semibold">({order.items.options.maintenanceYN ? 'selection' : 'deselection'})</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-sm">Maintenance Cost:</p>
            <p className="text-sm font-semibold">${order.items.options.maintenance_cost}</p>
          </div>
          <hr className="my-6" />
          <div className="flex justify-between">
            <p className="text-lg">Total Amount:</p>
            <p className="text-lg font-semibold">${order.total}</p>
          </div>
        </div>
        )))
      }

      <div className="border border-black w-48 h-24"></div>  
    </Wrapper>
  );
}