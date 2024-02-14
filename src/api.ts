const BASE_PATH = "http://localhost:3000";

export async function getMyOrder(token:string) {
  const myOrder = await (
    await fetch(`${BASE_PATH}/order/info/`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8', //'Accept': 'application/json',
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

