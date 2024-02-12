export async function getOrder(orderId:string, token:string) {
  const BASE_PATH = "http://localhost:3000";
  const result = await (
    await fetch(`${BASE_PATH}/order/info/${orderId}`, {
      headers: {
        //'Content-Type': 'application/json; charset=utf-8','Accept': 'application/json',
        'Accept': 'application/json',
        'x-jwt': token,
      }
    })
  ).json(); 
    
  return result;
}