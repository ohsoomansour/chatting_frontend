import { useRouteMatch } from "react-router-dom"
import { useQuery } from "react-query";
import { getOrder } from "../api";
import { useRecoilValue } from "recoil";
import { tokenState } from "../recoil/atom_token";
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

//
export enum memberRole {
  Client = "client",
  Admin = "admin"
}

interface IorderInfo {
  address:string;
  createdAt:string;
  cutomer:{
    address:string;
    createdAt:string;
    id:number;
    memberRole: string;    //client or admin
    name:string;
    updateAt:string;
    userId:string;
    verified:boolean;
  },
  id: number;
  status:string;
  total: number;
  updatedAt: string;
}


export const OrderInfo = () => {
  const token = useRecoilValue(tokenState);
  console.log('token:')
  console.log(token);
  const orderMatch = useRouteMatch<{orderId:string}>([
    "/order/info/:orderId"
  ])
  const { data: OrderInfo }  = useQuery<IorderInfo>(
    ["customerOrderInfo", "ORDER"], () => getOrder(orderMatch?.params.orderId!, token)
  )
  console.log('orderInfo_data:')
  console.log(OrderInfo);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Electronic Receipt</h2>
      <div className="flex justify-between mb-4">
        <p className="text-sm text-gray-600">Date: February 12, 2024</p>
        <p className="text-sm text-gray-600">Time: 10:30 AM</p>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Order Number:</p>
        <p className="text-lg font-semibold">ORD123456</p>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Customer Name:</p>
        <p className="text-lg font-semibold">John Doe</p>
      </div>
      <hr className="my-6" />
      <h3 className="text-lg font-semibold mb-2">Items Ordered</h3>
      <div className="flex justify-between mb-2">
        <p className="text-sm">Product A</p>
        <p className="text-sm font-semibold">$12.99</p>
      </div>
      <div className="flex justify-between mb-2">
        <p className="text-sm">Product B</p>
        <p className="text-sm font-semibold">$17.99</p>
      </div>
      <div className="flex justify-between mb-2">
        <p className="text-sm">Product C</p>
        <p className="text-sm font-semibold">$15.01</p>
      </div>
      <hr className="my-6" />
      <div className="flex justify-between">
        <p className="text-lg">Total Amount:</p>
        <p className="text-lg font-semibold">$45.99</p>
      </div>
    </div>
  );
}