import styled from "styled-components"
import { RBproduct } from "./robots/RBproduct";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ReactPlayer from "react-player";
import {Order} from "./order";

const Wrapper = styled.div`
  dispaly:flex;
  align-items: center;
  justify-content:center;
`;
const ProductContainer = styled.div`
  display:flex;
  flex-direction:column;
`;
export const PlayerWrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  
  .player {
    border-radius: 20px;
    overflow: hidden;
    margin-top:10px;
  }
`;

const DownloadSVG = styled.svg`
  width: 30px;
  height: 30px;
`;
const DSA = styled.a`
  display:inline-block;
  width:30px;
  height:30px;
`;
/* deal 전체 조회, getAllDeal 비즈니스 로직 -> 뿌려주고 -> TradePlatform   
 선택한 Robot의 종류에 따라 > Robot의 3d모델링 DB를 꺼내와야된다. -> r3f에서 처리
  sellerId, robotId 
*/

export interface IRobot{
  id:number;
  name:number;
  price:number;
  maintenance_cost:string;
  description:string;
  rbURL:string;
}

export interface IMember{
  id:number;
  userId:string;
  address:string;
  name:string;
  memberRole:string;
}

export interface IDeal{
  id: number;
  compa_name:string;
  compaBrand_ImgURL:string;
  sellerId:number;
  robotId:number;
  robot:IRobot;
  seller:IMember;
}

const headers = new Headers({
  'Content-Type':'application/json; charset=utf-8',

});
const allDeals:IDeal[] = await (
 await fetch('http://localhost:3000/seller/getallDeals', {
   headers,
   method: 'GET'
 })
).json();

// DB에 저장은 무겁다 그래서 일단 로컬 경로로 저장
console.log(allDeals);
export const TradePlatform = () => {

  return ( 
    <Wrapper className=" max-w-full max-h-full border-4 border-gray-100 p-4 shadow-lg rounded-lg">
      {allDeals.map((deal, index) => (
      <div key={index}>
      <ProductContainer className="border-4 border-gray-100 p-4 shadow-lg rounded-lg">
        <img  alt='company logo' src={deal.compaBrand_ImgURL} width={"10%"} height={"10%"}></img>
        <h1 className=" text-lg font-semibold text-center">{deal.robot.name}</h1>
        {deal.robot.rbURL.includes('.glb') ? (
          <Canvas camera={{ position: [0, 0, 5] }}>
            <OrbitControls autoRotate={true}/>
            <group rotation-y={-Math.PI / 2}>
              <RBproduct rbURL={deal.robot.rbURL} />
            </group>
            <ambientLight intensity={1} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          </Canvas>
        ) : null }

        <PlayerWrapper>    
          {deal.robot.rbURL.includes('.mp4') || deal.robot.rbURL.includes('.MP4') ? (
            <ReactPlayer
              className="player "
              url={deal.robot.rbURL}
              width="50%"
              height="100%"
              controls={true}
              playing={true}            
            >
            </ReactPlayer>
        ) : null}
        </PlayerWrapper>
        {deal.robot.rbURL.includes('.png') || deal.robot.rbURL.includes('jpg') || deal.robot.rbURL.includes('JPG') ? (
          <img 
            alt='로봇 사진'
            src={deal.robot.rbURL}>
          </img>
        ): null}
        <DSA href={deal.robot.rbURL} >
          <DownloadSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>
          </DownloadSVG>
          
        </DSA>
        <Order robot={deal.robot} deal={deal}/>
      </ProductContainer>
        
      </div>

      

      ))}
      
    </Wrapper>
  )
}