import { Link } from "react-router-dom"
import styled from "styled-components";
import {motion, useAnimation} from "framer-motion";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { useQuery } from "react-query";
import { tokenState } from "../recoil/atom_token";
import { IuserInfo } from "../pages/editUserInfo";
import { getMyinfo } from "../api";

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
    fill: #FFD700;
  }
`;

const TranasactionSVG = styled.svg`
  fill:#130f40;
  transition: fill 0.3s ease-in-out;
  &:hover {
    fill: #E3E2B4;
  }
`;
const MyOrderSVG = styled.svg`
  fill:#130f40;
  transition: fill 0.3s ease-in-out;
  &:hover {
    fill: #5CFFD1;
  }
`;
const ChattngSVG = styled.svg`
  fill:#130f40;
  transition: fill 0.3s ease-in-out;
  &:hover {
    fill: #BFC8D7;
  }
`;

const StoredGoodsSVG = styled.svg`
  fill:#130f40;
  transition: fill 0.3s ease-in-out;
  &:hover {
    fill: #FF1493;
  }
`;
const RegistrationSVG = styled.svg`
  fill:#130f40;
  transition: fill 0.3s ease-in-out;
  &:hover {
    fill: #A2B59F;
  }
`;
const AdminSVG = styled.svg`
  fill:#A2B59F;
  transition: fill 0.3s ease-in-out;
  &:hover {
    fill: #009933;
  }
`;

const LogInSVG = styled.svg`
  fill:#130f40;
  transition: fill 0.3s ease-in-out;
  &:hover {
    fill: #00FF80;
  }
`;


export enum MemberRole {
  admin = "admin",
  manager = "manager",
  client = "client",
  any = "any"
}

export const Header: React.FC = () => {
  const token = useRecoilValue(tokenState)
  const {data:me, isLoading} = useQuery<IuserInfo>(
    ["me2", "Member"], () => getMyinfo(token)
  );
  
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
      {me?.memberRole === MemberRole.admin ? (
        <Link to="/admin" className="  mr-4"> 
          <AdminSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" height="40px" width="40px">
            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c1.8 0 3.5-.2 5.3-.5c-76.3-55.1-99.8-141-103.1-200.2c-16.1-4.8-33.1-7.3-50.7-7.3H178.3zm308.8-78.3l-120 48C358 277.4 352 286.2 352 296c0 63.3 25.9 168.8 134.8 214.2c5.9 2.5 12.6 2.5 18.5 0C614.1 464.8 640 359.3 640 296c0-9.8-6-18.6-15.1-22.3l-120-48c-5.7-2.3-12.1-2.3-17.8 0zM591.4 312c-3.9 50.7-27.2 116.7-95.4 149.7V273.8L591.4 312z"/>
          </AdminSVG>
        </Link>
      )
      : null} 

      <Link to="/trade" rel="trade a product" className=" text font-semibold mr-4">
        <TranasactionSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" height="40px" width="40px">
            <path d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z"/>
        </TranasactionSVG>   
      </Link>
      <Link to="/seller" className=" text font-semibold mr-4">
        <RegistrationSVG  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="40px" width="40px" >
          <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>
        </RegistrationSVG >
      </Link>
      <Link to="/cc" rel="customer center" className=" text font-semibold mr-4" >
        <ChattngSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="40px" width="40px" >
          <path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/>
        </ChattngSVG>
      </Link>
      <Link to="/order/getstoredgoods" rel="storedgoods" className="mr-4">
        <StoredGoodsSVG  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height="40px" width="40px">
          <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z"/>
        </StoredGoodsSVG >
      </Link>
      <Link to="/order/info" rel="myorder" className="mr-4">
        <MyOrderSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height="40px" width="40px">
          <path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"/>
        </MyOrderSVG>
      </Link>
      <Link to="/order/takeOrders" rel="takingOrders" className=" mr-4" >
      <TakingOrderSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="40px" width="40px">
        <path d="M320 96H192L144.6 24.9C137.5 14.2 145.1 0 157.9 0H354.1c12.8 0 20.4 14.2 13.3 24.9L320 96zM192 128H320c3.8 2.5 8.1 5.3 13 8.4C389.7 172.7 512 250.9 512 416c0 53-43 96-96 96H96c-53 0-96-43-96-96C0 250.9 122.3 172.7 179 136.4l0 0 0 0c4.8-3.1 9.2-5.9 13-8.4zm84 88c0-11-9-20-20-20s-20 9-20 20v14c-7.6 1.7-15.2 4.4-22.2 8.5c-13.9 8.3-25.9 22.8-25.8 43.9c.1 20.3 12 33.1 24.7 40.7c11 6.6 24.7 10.8 35.6 14l1.7 .5c12.6 3.8 21.8 6.8 28 10.7c5.1 3.2 5.8 5.4 5.9 8.2c.1 5-1.8 8-5.9 10.5c-5 3.1-12.9 5-21.4 4.7c-11.1-.4-21.5-3.9-35.1-8.5c-2.3-.8-4.7-1.6-7.2-2.4c-10.5-3.5-21.8 2.2-25.3 12.6s2.2 21.8 12.6 25.3c1.9 .6 4 1.3 6.1 2.1l0 0 0 0c8.3 2.9 17.9 6.2 28.2 8.4V424c0 11 9 20 20 20s20-9 20-20V410.2c8-1.7 16-4.5 23.2-9c14.3-8.9 25.1-24.1 24.8-45c-.3-20.3-11.7-33.4-24.6-41.6c-11.5-7.2-25.9-11.6-37.1-15l0 0-.7-.2c-12.8-3.9-21.9-6.7-28.3-10.5c-5.2-3.1-5.3-4.9-5.3-6.7c0-3.7 1.4-6.5 6.2-9.3c5.4-3.2 13.6-5.1 21.5-5c9.6 .1 20.2 2.2 31.2 5.2c10.7 2.8 21.6-3.5 24.5-14.2s-3.5-21.6-14.2-24.5c-6.5-1.7-13.7-3.4-21.1-4.7V216z"/>
      </TakingOrderSvg>
      </Link>
      <Link to="/member/privateInfo" rel="profile" className=" mr-4">
        <ProfileSvg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 448 512" height="40px" width="40px">
          <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
        </ProfileSvg>
      </Link>
      <Link to="/login">
        <LogInSVG  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className=" mr-4" height="40px" width="40px">
          <path d="M96 0C78.3 0 64 14.3 64 32v96h64V32c0-17.7-14.3-32-32-32zM288 0c-17.7 0-32 14.3-32 32v96h64V32c0-17.7-14.3-32-32-32zM32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32v32c0 77.4 55 142 128 156.8V480c0 17.7 14.3 32 32 32s32-14.3 32-32V412.8c12.3-2.5 24.1-6.4 35.1-11.5c-2.1-10.8-3.1-21.9-3.1-33.3c0-80.3 53.8-148 127.3-169.2c.5-2.2 .7-4.5 .7-6.8c0-17.7-14.3-32-32-32H32zM432 512a144 144 0 1 0 0-288 144 144 0 1 0 0 288zm47.9-225c4.3 3.7 5.4 9.9 2.6 14.9L452.4 356H488c5.2 0 9.8 3.3 11.4 8.2s-.1 10.3-4.2 13.4l-96 72c-4.5 3.4-10.8 3.2-15.1-.6s-5.4-9.9-2.6-14.9L411.6 380H376c-5.2 0-9.8-3.3-11.4-8.2s.1-10.3 4.2-13.4l96-72c4.5-3.4 10.8-3.2 15.1 .6z"/>
        </LogInSVG >
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