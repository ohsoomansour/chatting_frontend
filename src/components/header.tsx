import { Link, useHistory } from "react-router-dom"
import styled from "styled-components";
import {motion, useAnimation} from "framer-motion";
import { useState } from "react";

const Wrapper = styled(motion.div)`
  display:flex;
  flex-direction: column;
`
const Nav = styled(motion.nav)`
  display:flex;
  justify-content: flex-end;
`
const Button = styled.button``
export const OffSvg = styled.svg`
  width:35px;
  height:35px;
  transition: fill 0.3s ease-in-out;
  &:hover {
    fill: #b2bec3;
  }
`
const ProfileSvg = styled.svg`
  fill:#130f40;
  transition: fill 0.3s ease-in-out;
  &:hover {
    fill: #30336b;
  }
`;

const TakingOrderSvg = styled.svg`
  fill:#130f40;
  transition: fill 0.3s ease-in-out;
  &:hover {
    fill: #30336b;
  }
`;

const TranasactionSVG = styled.svg`
  fill:#130f40;
  transition: fill 0.3s ease-in-out;
  &:hover {
    fill: #30336b;
  }
`
const MyOrderSVG = styled.svg`
  fill:#130f40;
  transition: fill 0.3s ease-in-out;
  &:hover {
    fill: #30336b;
  }
`
const ChattngSVG = styled.svg`
  fill:#130f40;
  transition: fill 0.3s ease-in-out;
  &:hover {
    fill: #30336b;
  }
`

export const Header: React.FC = () => {
  const [headerCLose, setHeaderClose] = useState(false);
  const toggleSearch = (e:any) => {
    if (headerCLose) {
      headerAnimation.start({
        scaleX:1,   
       })

     } else {
       headerAnimation.start({
         scaleX: 0,
       }) 
     }
     setHeaderClose((prev) => !prev);
  }

  const headerAnimation = useAnimation();
  const onLogOut = () => {
     sessionStorage.removeItem('tk')
     sessionStorage.removeItem('UserId')
     window.location.href = "/login";
  }
  
  return(
   <Wrapper>
    <Nav 
      className=" min-w-full mx-auto bg-white p-6 rounded-md shadow-md"
      initial={{ scaleX: 1}} //랜더링 되었을 때 값 
      animate={headerAnimation}
      transition={{ type: "linear" }}
    >
      <Link to="/" rel="home" className=" text font-semibold mr-4" >
        Home
        
      </Link>
      <Link to="/trade" rel="trade a product" className=" text font-semibold mr-4">
        <TranasactionSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" height="40px" width="40px">
            <path d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z"/>
        </TranasactionSVG>   
      </Link>
      <Link to="/seller" className=" text font-semibold mr-4">seller</Link>
      <Link to="/cc" rel="customer center" className=" text font-semibold mr-4" >
        <ChattngSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="40px" width="40px" >
          <path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/>
        </ChattngSVG>
      </Link>
      <Link to="/member/privateInfo" rel="profile" className=" mr-4">
        <ProfileSvg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 448 512" height="40px" width="40px">
          <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
        </ProfileSvg>
      </Link>
      <Link to="/order/takeOrders" rel="takingOrders" className=" mr-4">
        <TakingOrderSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height="40px" width="40px">
          <path d="M14 2.2C22.5-1.7 32.5-.3 39.6 5.8L80 40.4 120.4 5.8c9-7.7 22.3-7.7 31.2 0L192 40.4 232.4 5.8c9-7.7 22.3-7.7 31.2 0L304 40.4 344.4 5.8c7.1-6.1 17.1-7.5 25.6-3.6s14 12.4 14 21.8V488c0 9.4-5.5 17.9-14 21.8s-18.5 2.5-25.6-3.6L304 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L192 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L80 471.6 39.6 506.2c-7.1 6.1-17.1 7.5-25.6 3.6S0 497.4 0 488V24C0 14.6 5.5 6.1 14 2.2zM96 144c-8.8 0-16 7.2-16 16s7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96zM80 352c0 8.8 7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96c-8.8 0-16 7.2-16 16zM96 240c-8.8 0-16 7.2-16 16s7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96z"/>
        </TakingOrderSvg>
      </Link>
      <Link to="/order/info" rel="myorder" className="mr-4">
        <MyOrderSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height="40px" width="40px">
          <path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"/>
        </MyOrderSVG>
      </Link>

      <Button onClick={() => onLogOut()} className=" flex flex-col items-center gap-2 font-semibold">
        <OffSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"/>
        </OffSvg>
      </Button>

    </Nav>
      {headerCLose ? 
      <button
         className="text font-semibold rounded-md shadow-md"
          onClick={toggleSearch}
          style={{cursor: "pointer", textAlign: "center"}}
        >OPEN
      </button>
        : (
      <button
          className="text font-semibold rounded-md shadow-md"
          onClick={toggleSearch}
          style={{cursor: "pointer", textAlign: "center"}}
        >CLOSE
      </button>
        )
      }
  </Wrapper>

  )
}