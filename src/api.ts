import { IDeal } from "./pages/TradePlatform";
import { IuserInfo } from "./pages/editUserInfo";

//  https://trade-2507d8197825.herokuapp.com/
const BASE_PATH = process.env.NODE_ENV === "production" 
 ? "https://trade.herokuapp.com"
 : "http://localhost:3000";
export const headers = new Headers({
  'Content-Type':'application/json; charset=utf-8',
});

export async function getallDeals() {
  const allDeals:IDeal[] = await (
   await fetch(`${BASE_PATH}/seller/getallDeals`, {
     headers,
     method: 'GET'
   })
  ).json();
  return allDeals;
}

export async function getMyOrder(token:string) {
  const myOrder = await (
    await fetch(`${BASE_PATH}/order/info/`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-jwt': token,

      }
    })
  ).json(); 
    
  return myOrder;
}

export async function takeOrders(token:string) {
  const takingOrders = await (
    await fetch(`${BASE_PATH}/order/takeorders`,{
      headers:{
        'Content-Type': 'application/json; charset=utf-8',
        'x-jwt': token,

      }
    })
  ).json()
  
  return takingOrders;
}

export async function storedGoods(token:string) {
  const storedGoods = await (
    await fetch(`${BASE_PATH}/order/getstoredgoods`, {
      headers:{
        'Content-Type': 'application/json; charset=utf-8',
        'x-jwt': token
      }
    })
  ).json();
  
  return storedGoods;
}


export async function getMyinfo(token:string) {
  const user:IuserInfo = await (
    await fetch(`${BASE_PATH}/member/getmyinfo`, {
      headers: {
        'Content-Type':'application/json; charset=utf-8',
        'x-jwt': token,
      },
      method: 'GET',
    })
  ).json();
  return user;
}


