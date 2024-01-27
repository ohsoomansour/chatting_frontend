

import { Link, useHistory } from "react-router-dom"
import styled from "styled-components";
import {motion, useAnimation} from "framer-motion";
import { useState } from "react";


const Col = styled.div`
  display: flex;
  align-items: center;
`;
const Nav = styled.nav`
  display:flex;
  justify-content: flex-end;
`
const Button = styled.button``
const OffSvg = styled.svg`
  width:35px;
  height:35px;
  transition: fill 0.3s ease-in-out;
  &:hover {
    fill: #b2bec3;
  }
`


export const Header: React.FC = () => {
  const inputAnimation = useAnimation();
  const [headerOpen, setHeaderOpen] = useState(false);
  const history = useHistory() 
  const onLogOut = () => {
    //sessionStorage로 변경
     sessionStorage.removeItem('tk')
     history.push('/login')
     
   }
   const toggleSearch = () => {
     // false === scaleX:0  "trigger the close animation"
     setHeaderOpen((prev) => !prev);
    if (headerOpen) {
      inputAnimation.start({
         scaleX:0,   
      })
    // trigger the open animation: headerOpen이 true의 경우 
    } else {
      inputAnimation.start({
         scaleX: 1,
      })
      
    }

  }

  return(

    <Nav className=" max-w-xl mx-auto bg-white p-6 rounded-md shadow-md">
     <Col> 
      <motion.svg
        onClick={toggleSearch}
        animate={{ x: headerOpen ? -500: 0 }}
        transition={{ type: "linear" }}
        fill="black"
        viewBox="0 0 512 512"
      >
        <motion.path 
          d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"
        />
      </motion.svg>
      <motion.div
        className=" flex"
        initial={{ scaleX: 0}} //랜더링 되었을 때 값 
        animate={{x: headerOpen ? -500: 0}}
        transition={{ type: "linear" }}
      >
        <Link to="/streaming">스트리밍</Link>
        <Button onClick={() => onLogOut()} className=" flex flex-col items-center gap-2 font-semibold">
          <OffSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"/>
          </OffSvg>
        </Button>
      </motion.div>
      </Col>
    </Nav>


  )
}