import { useQuery } from "react-query";
import { BASE_PATH, getMyDeals } from "../api";
import { useRecoilValue } from "recoil";
import { tokenState } from "../recoil/atom_token";
import { IDeal } from "./TradePlatform";
import { CancelSVG } from "./myorderInfo";
import styled from "styled-components";

const EditMyDealsWrappper = styled.div`
  background-color: ${props => props.theme.bgColor};
`

function EditMyDeals(){
  const token = useRecoilValue(tokenState);
  //const myDealsMatch = useRouteMatch("/myInfo/myDeals"); 
  //console.log('myDealsMatch', myDealsMatch);
  const {data:MyDeals, isLoading, refetch} = useQuery<IDeal[]>(
    ["myDeals", "Deal"], () => getMyDeals(token)
  );
  console.log(MyDeals);
  const MyallDeals = MyDeals 
    ? MyDeals
    : [];
  
  const onDelete = async(dealId:number) => {
    try {
      await fetch(`${BASE_PATH}/seller/delMydeal/${dealId}`,{
        headers:{
          'Content-Type': 'application/json; charset=utf-8',
        },
        method:'DELETE'
      }).then(res => res.ok? refetch() : null);
      //alert('현재 주문을 하고 있는 고객이 있습니다.')
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <div>
      <div className=" flex">
        {MyallDeals.map((deal, index) => (
          <EditMyDealsWrappper key={index} className="mt-4 h-1/3 w-1/3 mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between mb-4">
              <p className="text-sm text-gray-600 mr-1">Created At - </p>
              <p className="text-sm font-semibold">{' '} {`${new Date(deal.createdAt)}`}</p>
            </div>
            <div className="text-right mb-4">
              <p className="text-sm text-black font-semibold">Deal no.{deal.id}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm text-black f">Product Name:</p>
              <p className="text-sm font-semibold">{deal.robot.name}</p>
            </div>
            <button onClick={() => onDelete(deal.id)} className="text-sm flex mx-auto p-2 bg-white rounded-lg shadow-md hover:bg-red-400 transition duration-500">
              <CancelSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
              </CancelSVG>
              Delete
            </button>
          </EditMyDealsWrappper>
        ))}
      </div>
      <p className=" mt-4 text-lg font-semibold text-center"> 현재 고객님이 '주문 완료 후 배송 완료 전 까지' 이거나 '미리 담기가 진행 중'일 경우 등록하신 거래가 삭제되지 않습니다!💛</p>
    </div>
  )
}
export default EditMyDeals;