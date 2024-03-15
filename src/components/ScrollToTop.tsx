import React from 'react';
import styled from 'styled-components';

const Button  = styled.button`
  position : fixed;
  bottom : 20%;
  z-index:999;
`;
const TopSVG = styled.svg`
  fill:black;
  transition: fill 0.3s ease-in-out;
  &:hover{
    fill: #30336b;
    background-color:#e6e1db;
  }
  background-color:whitesmoke;
  border-radius: 50%;
  padding:10px;
  border: 2px solid black;
`;


function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // 부드럽게 스크롤되도록 설정합니다.
  });
}

function ScrollToTopButton() {
  
  return (
    <Button onClick={scrollToTop}>
      <TopSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="50px" height="50px">
        <path d="M214.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3V480c0 17.7 14.3 32 32 32s32-14.3 32-32V109.3l73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128z"/>
      </TopSVG>
    </Button>
  );
}

export default ScrollToTopButton;