import styled from "styled-components"
import { RBproduct } from "../components/robots/RBproduct";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ReactPlayer from "react-player";
import {Order} from "../components/order";
import { useQuery } from "react-query";
import { getallDeals } from "../api";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { HandleScroll } from "../components/handleScroll";

const Wrapper = styled.div`
  dispaly:flex;
  flex-direction:column;
  align-items: center;
  justify-content:center;
`;
const ProductContainer = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
`;
const VideoContainer = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content: center;
`;

export const PlayerWrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  
  .player {
    border-radius: 20px;
    overflow: hidden;
    margin-top:10px;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.6);
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
const CompaBrandImg = styled.img`
  position:left;
  
`; 

export interface IRobot{
  id:number;
  name:number;
  price:number;
  maintenance_cost:number;
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
  createdAt:Date;
  sellerId:number;
  seller:IMember;
  salesManager_mobilephone:number;
  robotId:number;
  robot:IRobot;
}

export const TradePlatform = () => {
  const [isVisible, setIsVisible] = useState(false);
  const {data:Deals, isLoading} = useQuery<IDeal[]>(
    ["getDeals", "Deal"], () => getallDeals() 
  )
  const allDeals = isLoading
    ? []
    : Deals   
    ? Deals
    : [];   // Deals가 undefined의 경우 [] 반환

  function handleScroll(){
    const scrollPosition = window.scrollY;
    const triggerPosition = 200;
    setIsVisible(scrollPosition > triggerPosition);
  }
  window.addEventListener('scroll', handleScroll);
  return ( 
    <Wrapper className=" max-w-full max-h-full border-4 border-gray-100 p-4 shadow-lg rounded-lg ">
      <Helmet>
         <title>Trader | Transaction </title>       
      </Helmet>
      {allDeals.map((deal, index) => (
      <div key={index}>
      <ProductContainer className="border-4 border-gray-100 p-4 shadow-lg rounded-lg">
        <div className=" flex">
          <CompaBrandImg  alt='company logo' src={deal.compaBrand_ImgURL} width={"15%"} height={"15%"}></CompaBrandImg>
        </div>
        <h1 className=" text-2xl font-semibold text-center ">{deal.robot.name}</h1>
        {deal.robot.rbURL.includes('.glb') ? (
          <Canvas camera={{ position: [0, 3, 7], fov:50 }} style={{ width: '50%', height: '35vh' }}>
            <OrbitControls 
              autoRotate={true}
            />
            <group 
              rotation-y={-Math.PI / 2}
              scale={[1.1, 1.1, 1.1]}
            >
              <RBproduct rbURL={deal.robot.rbURL} />
            </group>
            <ambientLight intensity={1} />
            <spotLight position={[10, 10, 10]} angle={0.25} penumbra={1} />
          </Canvas>
          
        ) : null }
        <VideoContainer>
          <PlayerWrapper>    
            {deal.robot.rbURL.includes('.mp4') || deal.robot.rbURL.includes('.MP4') ? (
              <ReactPlayer
                className="player "
                url={deal.robot.rbURL}
                width="50%"
                height="100%"
                controls={true}
                playing={true}
                volume={0}
              >
              </ReactPlayer>
          ) : null}
          </PlayerWrapper>
          
        </VideoContainer>
        {deal.robot.rbURL.includes('.png') || deal.robot.rbURL.includes('jpg') || deal.robot.rbURL.includes('JPG') ? (
          <img 
            alt='로봇 사진'
            src={deal.robot.rbURL}>
          </img>
        ): null}
        <DSA href={deal.robot.rbURL}  className=" mt-1 mb-3">
          <DownloadSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>
          </DownloadSVG>
        </DSA>
        <Order robot={deal.robot} deal={deal}/>
      </ProductContainer>
      </div>

      ))}
    <HandleScroll />
    </Wrapper>
  )
}