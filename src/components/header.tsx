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
      <Link to="/" rel="home" className=" text font-semibold mr-4" >Home</Link>
      <Link to="/trade" rel="trade a product" className=" text font-semibold mr-4">Trade </Link>
      <Link to="/seller" className=" text font-semibold mr-4">seller</Link>
      <Link to="/cc" rel="customer center" className=" text font-semibold mr-4">A/S</Link>
      <Link to="/member/privateInfo" rel="profile" className=" mr-4">
        <ProfileSvg
            className=" mr-4"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 448 512"
            height="40px"
            width="40px"
          >
            <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
        </ProfileSvg>
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