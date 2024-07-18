import { AnimatePresence, motion } from "framer-motion";
import { IProduct } from "../../pages/ProductsTrade";
//import { NextButton, PrevButton, ProdImg, ProdImgBox, ProdRow, ProdSliderWrapper } from "../uploadimg/ProductImg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
interface IProductProps {
  prd: IProduct;
}


const ProdSliderWrapper = styled(motion.div)`
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
  height:250px;
`;

const ProdRow = styled(motion.div)`
  position:relative;
  display:grid;
  grid-template-columns: 1fr 1fr 1fr ;
  gap: 10px;
  left:0;
  right:0;
  margin:0 auto;
  width:80%;
  height: 110px;
`;
const ProdImgBox = styled.div`

`;
const ProdImg = styled.img`
    
    border-radius:7px;
    background-size:cover;
    background-position:center center;
`;
const NextButton = styled(motion.button)`
  height:50px;
  width: 50px;
  border-radius:200px;
  border-width:5px;
  background-color:rgba(236, 240, 241,1.0);
  cursor:pointer;
`;
const PrevButton = styled(motion.button)`
  height:50px;
  width: 50px;
  border-radius:50px;
  border-width:5px; 
  background-color:rgba(236, 240, 241,1.0);
  cursor:pointer;
`;


const offset = 3; 
export const DisplayImgs = ({prd}: IProductProps) => {
  const [index, setIndex] = useState(0);
  const [increasing, setIncreasing] = useState(true);
  const [leaving, setLeaving] = useState(false);

    const prodRowVariants =  {
        hidden: (increasing: boolean) => ({
            x: increasing ? +100 : -100
        }),
        animate:{
            x: 0
        },
        exit: (increasing:boolean) => ({
            x: increasing? -100 : +100
        })
    }

    const toggleLeaving = () => {
        setLeaving(prev => !prev);
    }
    const increaseIndex = () => {
        if(prd.prod_URLS){
            if(leaving) return; //이 전의 index가 leaving 중 
            toggleLeaving();
            setIncreasing(true);
            const TotalImgs = prd.prod_URLS.length;
            const MaxIndex = Math.floor(TotalImgs / 3);  //1
            setIndex((prev) => prev === MaxIndex? 0 : prev + 1);
            toggleLeaving(); //false
        }
    }
    const decreaseIndex = () => {
        if(prd.prod_URLS){
            if(leaving) return;
            toggleLeaving();  
            setIncreasing(false);
            const TotalImgs = prd.prod_URLS.length;
            const MaxIndex = Math.floor(TotalImgs / 3);
            setIndex((prev) => prev === 0? MaxIndex : prev - 1);
            toggleLeaving();  // false
        }
    }


  return (
    <div >
      <AnimatePresence initial={false} custom={increasing} onExitComplete={toggleLeaving} >
          <ProdSliderWrapper>
              <NextButton onClick={increaseIndex}>
                  <FontAwesomeIcon icon={faChevronLeft} />
              </NextButton>
              <ProdRow
                  key={index}
                  custom={increasing}
                  transition={{ type: "tween", duration: 1}}
                  variants={prodRowVariants}
                  initial="hidden"
                  animate="animate"
                  exit="exit"
              >
                  {prd.prod_URLS?.slice(index * offset, index * offset + offset).map((prod_img, idx) => (
                      <ProdImgBox 
                          key={idx}
                      >
                          <ProdImg src={prod_img} />
                      </ProdImgBox>
                  ))}
              </ProdRow>
              <PrevButton onClick={decreaseIndex}>
                  <FontAwesomeIcon icon={faChevronRight} />
              </PrevButton>
          </ProdSliderWrapper>
      </AnimatePresence>

    </div>
  );
}