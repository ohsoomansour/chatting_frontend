import { useState } from "react";
import ScrollToTopButton from "./ScrollToTop";
import styled from "styled-components";
export const ScrollToTopButtonWrapper = styled.div`
  display:flex;
  justify-content:flex-end;
  margin-right:30px;
`;

export function HandleScroll(){
  const [isVisible, setIsVisible] = useState(false);
  function handleScroll(){
    const scrollPosition = window.scrollY;
    const triggerPosition = 200;
    setIsVisible(scrollPosition > triggerPosition);
  }
  window.addEventListener('scroll', handleScroll);
  
  return (
    <ScrollToTopButtonWrapper >
      {isVisible && <ScrollToTopButton />}

    </ScrollToTopButtonWrapper >
  )
}