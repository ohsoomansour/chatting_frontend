import { useQuery } from "react-query";
import { takeOrders } from "../api";
import { useRecoilValue } from "recoil";
import { tokenState } from "../recoil/atom_token";
import styled from "styled-components";
import { Loading } from "../components/loading";

const Wrapper = styled.div``;

interface ICustomer{
  address:string;
  id:number;
  name:string;
  userId:string;
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
interface ITakingOrders{
  address:string; 
  createdAt:string;
  customer:ICustomer;
  items:Iitems;
  id:number;
  status:string;
  total:number;  
}

interface ISellerTakingOrders {
  address:string; //판매자 주소
  id:number;  //판매자 id
  memberRole:string; //사이트에서 판매자는 client 
  name:string; // 판매자 이름 
  takingorders:ITakingOrders[] //판매자가 받은 주문 리스트들
}


export const TakingOrderInfo = () => {
  const token = useRecoilValue(tokenState);
  console.log('token:')   
  const { data: takingOrderInfo, isLoading }  = useQuery<ISellerTakingOrders>(
    ["takeOrdersInfo", "ORDER"], () => takeOrders(token)
  )
  console.log('takeOrdersInfo:')
  console.log(takingOrderInfo);
  console.log()
  const takeOrderInfos = isLoading
    ? []
    : takingOrderInfo
    ? takingOrderInfo.takingorders
    : [];
  
  //주문 정보에 카카오 PAY의 결제 승인 response -> 존재하면 주문 정보 보여준다. 

  return (
    <Wrapper className="mt-6 ">
      {isLoading 
        ? <Loading /> 
        :  ( takeOrderInfos.map((order, index) => (
          <div key={index} className="mb-2 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">  
            <h2 className="text-2xl font-semibold mb-4">Electronic Receipt</h2>
            <div className="flex justify-between mb-4">
              <p className="text-sm text-gray-600">Date: {order.createdAt}</p>
              <p className="text-sm text-gray-600">Address: {order.address}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Order Number:</p>
              <p className="text-lg font-semibold">{order.id}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Customer Name:</p>
              <p className="text-lg font-semibold">{order.customer.name}</p>
              <p className="text-sm text-gray-600">Customer id:</p>
              <p className="text-lg font-semibold">{order.customer.userId}</p>
            </div>
            <hr className="my-6" />
            <h3 className="text-lg font-semibold mb-2">Items Ordered</h3>
            <div className="flex justify-between mb-2">
              <p className="text-sm">{order.items.robot.name}</p>
              <p className="text-sm font-semibold">${order.items.robot.price}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">Your Selection of the Maintenance:</p>
              <p className="text-sm font-semibold">({order.items.options.maintenanceYN ? 'selection' : 'deselection'})</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">Maintenance Cost</p>
              <p className="text-sm font-semibold">${order.items.options.maintenance_cost}</p>
            </div>
            <hr className="my-6" />
            <div className="flex justify-between">
              <p className="text-lg">Total Amount:</p>
              <p className="text-lg font-semibold">${order.total}</p>
            </div>
          </div>

        )) 
        ) }
  </Wrapper>
  );
}