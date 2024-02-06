import { useRecoilValue } from "recoil";
import styled from "styled-components"
import { tokenState } from "../recoil/atom_token";
import { RBproduct } from "./robots/RBproduct";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ThreeScene from "./robots/gptEx";

const Wrapper = styled.div`
  dispaly:flex;
  align-items: center;
  justify-content:center;
`;
const ProductContainer = styled.div``;




/* deal 전체 조회, getAllDeal 비즈니스 로직 -> 뿌려주고 -> TradePlatform   
 선택한 Robot의 종류에 따라 > Robot의 3d모델링 DB를 꺼내와야된다. -> r3f에서 처리
  sellerId, robotId 
*/

interface IRobot{
  id:number;
  name:string;
  price:number;
  description:string;
  rb3dURL:string;
}

interface IDeal{
  id: number;
  sellerId:number;
  robotId:number;
  robot:IRobot;
}

const headers = new Headers({
  'Content-Type':'application/json; charset=utf-8',

});
const allDeals:IDeal[] = await (
 await fetch('http://localhost:3000/seller/getallDeals', {
  headers,
   method: 'GET'
   
 })
).json()
// DB 안에 등록이 안되면 일단 src 경로를 저장해서 DB에 저장하는 방법ㅇ
console.log('allDeals:')
console.log(allDeals);
export const TradePlatform = () => {
  const token = useRecoilValue(tokenState)
  /*
   <ProductContainer>
          <Canvas camera={{ position: [0, 0, 5] }}>
          <OrbitControls autoRotate={true}/>
          <group rotation-y={-Math.PI / 2}>
          <RBproduct glbModel={}/>
            
          </group>
          <ambientLight intensity={1} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        </Canvas>
        </ProductContainer>
  
  
  */


  return (
    
    <Wrapper className=" max-w-fit max-h-full border-4 border-gray-100 p-4 shadow-lg rounded-lg">
      {allDeals.map((deal, index) => (

        <ThreeScene key={index} modelUrl={'http://localhost:3000/download/glb'} />

      ))}
      
    </Wrapper>
  )
}