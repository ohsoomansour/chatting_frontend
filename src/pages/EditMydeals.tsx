import { useQuery } from "react-query";
import { BASE_PATH, getMyDeals } from "../api";
import { IDeal } from "./ProductsTrade";
import { CancelSVG } from "./myorderInfo";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { getCookie } from "../utils/cookie";



const EditMyDealsWrappper = styled.div`
  background-color: ${props => props.theme.bgColor};
  margin:0 20px;
`;
const SliderWrapper = styled(motion.div)`
  display:flex;
  flex-direction:row;
  justify-content:space-around;
  align-items:center;
`;

const SliderRow = styled(motion.div)`
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:20px;
  left:0;
  right:0;
  margin:0 30px;;
  width:80%;
`;

const NextButton = styled(motion.button)`
  height:50px;
  width: 50px;
  border-radius:200px;
  border-width:5px;
  border-color:black;
  cursor:pointer;
  &:hover{
    background-color:#E2E2E2;
  }
  transition: background-color 0.3s ease-in-out;
`;
const PrevButton = styled(motion.button)`
  height:50px;
  width: 50px;
  margin-left:40px;
  border-radius:50px;
  border-width:5px;
  border-color:black;
  cursor:pointer;
  &:hover{
    background-color:#E2E2E2;
  }
  transition:background-color 0.3s ease-in-out;
`;
/*
## 내 정보에서 이미지 삭제 로직 참고 
  const delProdImgs = async() => {
    const testImgs : string[] = ["1720144751092trader1.png", "1720144751104trader2.png"];
    const {ok} = 
      await fetch(`${BASE_PATH}/upload/del`, {
        headers: {
          'Content-Type': 'application/json',  // Content-Type 헤더 추가
        },
        method: 'POST',
        body: JSON.stringify({
          file_names: testImgs
        }),
      })
   
    console.log("delProdImgs result:", ok)
  }
*/
const dealRowVariants = {
  hidden:(increasing:boolean) => ({
    x: increasing? +50 : -50
  }),
  animate:{
    x: 0
  },
  exit:(increasing:boolean) => ({
    x: increasing? -50 : +50
  })
}


const offset = 2;
function EditMyDeals(){
  const ckToken = getCookie('token');
  const {data:MyDeals, isLoading, refetch} = useQuery<IDeal[]>(
    ["myDeals", "Deal"], () => getMyDeals(ckToken!)
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
        
      } catch (e) {
        console.error(e);
      }
    }
  const [increasing, setIncreasing] = useState(true)
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () =>{
    setLeaving((prev) => !prev);
  }
  const increaseIndex = () =>{
    if(MyallDeals){
      if(leaving) return; // 떠나는 중이면 잠그고 + 더블 클릭 방지 
      toggleLeaving(); //leaving중
      setIncreasing(true);
      const TotalMyDeals = MyallDeals.length;
      const MaxIndex = Math.floor(TotalMyDeals / 2);
      setIndex((prev) => prev === MaxIndex? 0 : prev + 1);
      toggleLeaving(); //onExitComplete - animate out 후 함수가 실행된다. 
    }
  }
  const decreaseIndex = () => {
    if(MyallDeals){
      if(leaving) return; //그 전 leaving 이 끝나야 가능 하도록 방지 
      toggleLeaving(); // 다시 leaving을 'ON'
      setIncreasing(false); // 왼쪽 방향을 'decrease'라고 정의
      const TotalMyDeals = MyallDeals.length;
      const MaxIndex = Math.floor(TotalMyDeals / 2);
      setIndex((prev) => prev === 0? MaxIndex : prev - 1 );
      toggleLeaving();
    }
  }
  

  return (
    <div className="flex flex-col h-full">

      <AnimatePresence initial={false} custom={increasing} onExitComplete={toggleLeaving}>
        <SliderWrapper >
          <NextButton onClick={increaseIndex}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </NextButton>  
          <SliderRow
            key={index}
            custom={increasing}
            transition={{type:"tween", duration:1 }} 
            variants={dealRowVariants}
            initial="hidden"
            animate="animate"
            exit="exit"
          >
            {MyallDeals?.slice(index*offset, index*offset + offset).map((deal, index) => (
              <EditMyDealsWrappper key={index} className="mt-4 mr-2 h-full w-full p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between mb-4">
                  <p className="text-sm text-gray-600 mr-1">Created At - </p>
                  <p className="text-sm font-semibold">{' '} {`${new Date(deal.createdAt)}`}</p>
                </div>
                <div className="text-right mb-4">
                  <p className="text-sm text-black font-semibold">Deal no.{deal.id}</p>
                </div>
                <div className="flex justify-between mb-4">
                  <p className="text-sm text-black f">Product Name:</p>
                  <p className="text-sm font-semibold">{deal.product.name}</p>
                </div>
                <button onClick={() => onDelete(deal.id)} className="text-sm flex mx-auto p-2 bg-white rounded-lg shadow-md hover:bg-red-400 transition duration-500">
                  <CancelSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                  </CancelSVG>
                  Delete
                </button>
              </EditMyDealsWrappper>
            ))}

          </SliderRow>
          <PrevButton onClick={decreaseIndex}>
            <FontAwesomeIcon icon={faChevronRight} />
          </PrevButton>
        </SliderWrapper>
      </AnimatePresence>
      <p className=" mt-10 text-lg font-semibold text-center"> 현재 고객님이 '주문 중 이거나' 또는 '미리 담기가 진행 중'일 경우 등록하신 거래가 삭제되지 않습니다!💛</p>
    </div>
  )
}
export default EditMyDeals;