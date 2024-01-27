

import { Link, useHistory } from "react-router-dom"
import styled from "styled-components";
import {motion, useAnimation} from "framer-motion";
import { useState } from "react";


const Col = styled.div`
  display: flex;
  align-items: center;
`;
const Nav = styled(motion.nav)`
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
  const headerAnimation = useAnimation();
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
      headerAnimation.start({
         scaleX:1,   
      })
    // trigger the open animation: headerOpen이 true의 경우 
    } else {
      headerAnimation.start({
         scaleX: 0,
      })
      
    }

  }

  return(
   <motion.div>
    <Nav 
      className=" max-w-xl mx-auto bg-white p-6 rounded-md shadow-md"
      initial={{ scaleX: 1}} //랜더링 되었을 때 값 
        animate={headerAnimation}
        transition={{ type: "linear" }}
      >
     <Col> 
      
      <motion.div
        
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
    <motion.button
        onClick={toggleSearch}
       
        transition={{ type: "linear" }}
      >
        헤더 컨트롤러
      </motion.button>
    </motion.div>

  )
}