import { useQuery } from "react-query";
import { BASE_PATH, getMyDeals } from "../api";
import { IDeal } from "./ProductsTrade";
import { CancelSVG } from "./myorderInfo";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { getCookie } from "../utils/cookie";
import { useDropzone } from "react-dropzone";
import { IProdimg } from "../components/uploadimg/ProductImg";
import { EditProdImg } from "../components/uploadimg/EditProdImg";
import { useRecoilValue } from "recoil";
import { productImgToUpdateState } from "../recoil/atom_Img";

const Wrapper=styled.div`
  height: 100vh;
  padding: 50px;
`;
const RImgTitle=styled.p`
  font-size: 20px;
  font-weight: 380;
`;
const RepresImgWrapper=styled.div`
  width: 100%;
  height: 50%;
  display:flex;
  align-items:center;
  justify-content:center;
`;
const RepresImgContainer=styled.div`
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content:center;
`;
const RepresImgBox=styled.div`
  position: relative;
  padding: 10px;
  display:flex;
  flex-direction:column;
  align-items:center;
  height: calc(100%);
  width: calc(100%);
  
`;
const RepresentImg = styled.img`
  height: 100%;
  width: 100%;
  border-radius: 8px;
  background-size:cover;
  background-position:center center;
`;
const DelRepresSvg = styled.svg`
  position: absolute;
  top: 5px;
  right:0px;
  fill: #ff7b7b;
  transition: fill 0.3s ease-in-out;
  &:hover{
    fill: red;
  }
  cursor:pointer;
  width:30px;
  height:30px;
`;
const RepresImgModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;
const RepresImgModalWrapper = styled.div`
  position: relative;
  width: calc(50%);
  height: calc(50%);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  display: flex;        
  flex-direction: column;
`;
const RepresImgModalContainer = styled.div`
  margin-bottom: 20px;  
  padding:50px;
  width: calc(100%);
  height: calc(100%);
  background: white;
  border-radius: 8px;
  overflow-y:auto;
`;
const SaveRImgButtonContainer = styled.div`
  position: relative;
  display: flex;
  justify-content:center;
  align-items:center;
  bottom:0px;
`;
const SaveRepresImgButton=styled.button`
  font-weight: bold;
  background-color: #d3d3d3;
  &:hover{
    background-color: #bfff00;
  }
  transition: background-color 0.2s ease-in-out;
  border-radius: 8px;
  width: 100px;
  padding:5px;
`;
const ModifyPimgButton = styled.button`
  width: calc(100%);
  background-color: #444444;
  color: white;
  margin-top: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out; 
  &:hover{
    background-color: #B9C4C1;
  }
`;
const GImgModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;
const CloseSVG = styled.svg`
  position: absolute;
  top:0;
  right:0;
  padding: 3px;
  width:25px;
  height:28px;
  fill: #b2bec3;
  transition: fill 0.3s ease-in-out;
  &:hover {
  fill: #d10849;
  }
  cursor: pointer;
`;
const GImgModalWrapper = styled.div`
  position: relative;
  width: calc(50%);
  height: calc(50%);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  display: flex;        
  flex-direction: column;
`;
const GImgModalContainer = styled.div`
  margin-bottom: 20px;  
  padding:50px;
  width: calc(100%);
  height: calc(100%);
  background: white;
  border-radius: 8px;
  overflow-y:auto;
`;
const SavePImgButtContainer = styled.div`
  position: relative;
  display: flex;
  justify-content:center;
  align-items:center;
  bottom:0px;
`;
const SaveProdImgButton = styled.button`
  font-weight: bold;
  background-color: #d3d3d3;
  &:hover{
    background-color: #bfff00;
  }
  transition: background-color 0.2s ease-in-out;
  border-radius: 8px;
  width: 100px;
  padding:5px;
`;
const ProdImgBox=styled.div`
  display:flex;
  position: relative;
  padding: 10px;
  flex-direction:column;
  align-items:center;
`;
const ProdImg = styled.img`
  height: calc(100%);
  width: calc(100%);
  background-size:cover;
  background-position:center center;
  border-radius: 8px;
`;
const DelProdSvg = styled.svg`
  position: absolute;
  top: 5px;
  right:0px;
  fill: #ff7b7b;
  transition: fill 0.3s ease-in-out;
  &:hover{
      fill: red;
  }
  cursor:pointer;
  width:30px;
  height:30px;
`;
const ProdImgRow = styled(motion.div)`
  position:relative;
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  left:0;
  right:0;
  margin:0 auto;
  width:80%;
  height: 110px;
`;
const AddProdImgSvg = styled.svg`
  width:calc(50%);
  height:calc(50%);
  &:hover{
    width:calc(55%);
    height:calc(55%);
  }
`; 
const AddProdButton = styled.button`
  display: flex;
  justify-content:center;
  align-items:center;
`;
const EditMyDealsWrappper = styled.div`
  position: relative;
  min-height: 500px; 
  max-height: 700px; 
  overflow-y: auto; 
  background-color: ${props => props.theme.bgColor};
  margin:0 20px;
  padding: 60px;
`;
const DelDealButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  display:block;
`;
const SliderWrapper = styled(motion.div)`
  display:flex;
  flex-direction:row;
  justify-content:space-around;
  align-items:center;
`;
const SliderRow = styled(motion.div)`
  display:grid;
  grid-template-columns: 1fr;
  gap:20px;
  left:0;
  right:0;
  margin:0 30px;
  width:80%;
`;
const NextButton = styled(motion.button)`
  height:50px;
  width: 50px;
  border-radius:200px;
  border-width:5px;
  border-color:black;
  cursor:pointer;
  &:hover{
    background-color:#E2E2E2;
  }
  transition: background-color 0.3s ease-in-out;
`;
const PrevButton = styled(motion.button)`
  height:50px;
  width: 50px;
  margin-left:40px;
  border-radius:50px;
  border-width:5px;
  border-color:black;
  cursor:pointer;
  &:hover{
    background-color:#E2E2E2;
  }
  transition:background-color 0.3s ease-in-out;
`;

const dealRowVariants = {
  hidden:(increasing:boolean) => ({
    x: increasing? +50 : -50
  }),
  animate:{
    x: 0
  },
  exit:(increasing:boolean) => ({
    x: increasing? -50 : +50
  })
}

const offset = 1;
function EditMyDeals(){
  const [isRepresImgChanged, setRepresImgChanged]=useState(false);
  const [isGImgChanged, setGimgChanged] = useState(false);
  const [rImagePreview, setRimagePreview]=useState<IProdimg[]>([]);
  const [rImgFiles, setRimgFiles]=useState<File[]>();
  const [gImagePreview, setGimagePreview] = useState<IProdimg[]>();
  const prodImgsToUpdate = useRecoilValue(productImgToUpdateState);
  const ckToken = getCookie('token');
  const {data:MyDeals, isLoading, refetch} = useQuery<IDeal[]>(
    ["myDeals", "Deal"], () => getMyDeals(ckToken!)
  );
  console.log(MyDeals);
  const MyallDeals = MyDeals 
    ? MyDeals
    : [];
    

  const onDelete = async(dealId:number) => {
    try {
      await fetch(`${BASE_PATH}/seller/delMydeal/${dealId}`,{
        headers:{
          'Content-Type': 'application/json; charset=utf-8',
        },
        method:'DELETE'
      }).then(res => res.ok? refetch() : null);
      
    } catch (e) {
      console.error(e);
    }
  }
  const [increasing, setIncreasing] = useState(true)
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const toggleLeaving = () =>{
    setLeaving((prev) => !prev);
  }
  const increaseIndex = () =>{
    if(MyallDeals){
      if(leaving) return; // 떠나는 중이면 잠그고 + 더블 클릭 방지 
      toggleLeaving(); //leaving중
      setIncreasing(true);
      const TotalMyDeals = MyallDeals.length;
      const MaxIndex = Math.floor(TotalMyDeals / 1); //9 -> 4
      setIndex((prev) => prev === MaxIndex? 0 : prev + 1);
      toggleLeaving(); 
    }
  }
  const decreaseIndex = () => {
    if(MyallDeals){
      if(leaving) return; //그 전 leaving 이 끝나야 가능 하도록 방지 
      toggleLeaving(); // 다시 leaving을 'ON'
      setIncreasing(false); // 왼쪽 방향을 'decrease'라고 정의
      const TotalMyDeals = MyallDeals.length;
      const MaxIndex = Math.floor(TotalMyDeals / 1);
      setIndex((prev) => prev === 0? MaxIndex : prev - 1 );
      toggleLeaving();
    }
  }
  const delImg =  async(productId: number, imgTodel:string, code:string) => {
    const start = imgTodel.indexOf('_');
    const png = imgTodel.indexOf('.png')+3;
    const jpeg = imgTodel.indexOf('.jpeg')+4;
    const end = imgTodel.includes('png') ? png : jpeg; 
    const filteredImg = imgTodel.slice(start, end+1);

    await fetch(`${BASE_PATH}/upload/del`, {
      headers: {
        'Content-Type': 'application/json',  // Content-Type 헤더 추가
      },
      method: 'POST',
      body: JSON.stringify({   
        productId,
        imgToDel: filteredImg,
        code: code,  // 'r' = 대표 사진, 'g'는 일반 사진들
      }),
    }).then(res => res.ok? refetch() : null);
      
  }
  const onDrop = useCallback((acceptedFiles:File[]) => {
    console.log("RepresImgAcceptedFile", acceptedFiles);
    setRimgFiles(acceptedFiles);
    const mappedFiles = acceptedFiles.map((file: File, idx) => {
      const prodImg:IProdimg = {
          file,
          preview: URL.createObjectURL(file)
      };
      return prodImg;
  })
  setRimagePreview(mappedFiles); //preview 용도 
  

    }, [])
    
  const { getRootProps, getInputProps } = useDropzone({
    onDrop, //이벤트 핸들러 
    accept: {
      'image/jpeg': ['.jpeg'],
      'image/png': ['.png'],
    }
  });
   
  
  let imgs_updateURL:string[] | string;
  const saveImg = async(productId:string,imgToUpadate: File[], code:string) => {
      console.log(productId, imgToUpadate, code)
      const formBody =  new FormData();
      //#1. upload 컨트롤러에서 -> url로 반환
      if(code === 'r'){
        formBody.append('file', imgToUpadate[0]);
        const { url: represenative_prodURL} = await (
          await fetch(`${BASE_PATH}/upload`, {
            method: 'POST',
            body: formBody
          })
        ).json();
        imgs_updateURL = represenative_prodURL;
      } else if(code === 'g'){
        const formBody = new FormData();
        prodImgsToUpdate.forEach((file) => formBody.append('files', file))
        const urls : string[] = await (
          await fetch(`${BASE_PATH}/upload/multi_files`, {
            method: 'POST',
            body: formBody
          })
        ).json()
        imgs_updateURL = urls;
        console.log('g의 imgs_updateURL', imgs_updateURL);
      } 

    // #2. 그 url을 받아서 업데이트 해주는 로직 
    
    await fetch(`${BASE_PATH}/prod/update_img`, {
      headers:{
        'Content-type':'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        productId,
        urlImgToUpadate: imgs_updateURL,
        code
      })
    }).then(res => res.ok? refetch() : null)
    imgs_updateURL = ""
   }
  
  return (
    <Wrapper className="flex flex-col h-full">
      <AnimatePresence initial={false} custom={increasing} onExitComplete={toggleLeaving}>
        <SliderWrapper >
          <NextButton onClick={increaseIndex}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </NextButton>  
          <SliderRow
            key={index}
            custom={increasing}
            transition={{type:"tween", duration:1 }} 
            variants={dealRowVariants}
            initial="hidden"
            animate="animate"
            exit="exit"
          >
            {MyallDeals.slice(index * offset, index * offset + offset).map((deal, index) => (
              <EditMyDealsWrappper key={index} className="mt-4 mr-2 w-full h-full p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between mb-4">
                  <p className="text-sm text-gray-600 mr-1">Created At - </p>
                  <p className="text-sm font-semibold">{' '} {`${new Date(deal.createdAt)}`}</p>
                </div>
                <div className="text-right mb-4">
                  <p className="text-sm text-black font-semibold">Deal no.{deal.id}</p>
                </div>
                <div className="flex justify-between mb-4">
                  <p className="text-sm text-black ">제품 이름:</p>
                  <p className="text-sm font-semibold">{deal.product.name}{deal.productId}</p>
                </div>
                <div className="flex justify-between mb-4">
                  <p className="text-sm text-black ">제품 아이디:</p>
                  <p className="text-sm font-semibold">no.{deal.productId}</p>
                </div>
                <hr />
                <RepresImgWrapper className="mb-4">
                  <RepresImgContainer>
                    <RImgTitle className="text-sm text-black ">대표 사진</RImgTitle>
                    <RepresImgBox>
                      {deal.product.representative_prodURL ?
                        (<DelRepresSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" onClick={() => delImg(deal.productId, deal.product.representative_prodURL, 'r')} >
                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232H328c13.3 0 24 10.7 24 24s-10.7 24-24 24H184c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/>
                      </DelRepresSvg>) :null
                      }
                      <RepresentImg src={deal.product.representative_prodURL} />
                      <ModifyPimgButton onClick={() => setRepresImgChanged(true)}>변경</ModifyPimgButton> 
                      {isRepresImgChanged ? 
                        <RepresImgModalBackground>
                          <RepresImgModalWrapper>
                            <RepresImgModalContainer>
                            <CloseSVG onClick={() => setRepresImgChanged(false)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
                            </CloseSVG>  
                              <div {...getRootProps()} className=" flex flex-col items-center justify-center mb-6 p-2 ">
                                <label htmlFor="dropzone-file" className=" py-10 flex flex-col items-center justify-center w-full h-full  border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100 ">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6 max-h-full text-center">클릭 또는 드래그하여 <br/> 대표 사진을 <br/>변경해주세요.</div>                    
                                </label>  
                                <input
                                  {...getInputProps()}
                                  type="file"
                                />
                              </div>
                              <RepresentImg src={rImagePreview && rImagePreview.length > 0 ? rImagePreview[0].preview : ''} /> 
                            </RepresImgModalContainer>
                            <SaveRImgButtonContainer>
                              <SaveRepresImgButton onClick={() => saveImg(`${deal.product.id}`,rImgFiles! , 'r')}>저장</SaveRepresImgButton> 
                            </SaveRImgButtonContainer>
                          </RepresImgModalWrapper> 
                        </RepresImgModalBackground> : null  
                      }
                    </RepresImgBox>
                  </RepresImgContainer>
                </RepresImgWrapper>
                <div>
                  <p className="text-sm text-black ">상품 사진:</p>
                  <ProdImgRow key={index}>
                    {deal.product.prod_URLS && deal.product.prod_URLS.length > 0 ? deal.product.prod_URLS.map((prod_img, index) => (
                      <ProdImgBox key={index}>
                        <DelProdSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" onClick={() => delImg(deal.productId, prod_img, 'g')}>
                          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232H328c13.3 0 24 10.7 24 24s-10.7 24-24 24H184c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/>
                        </DelProdSvg>
                        <ProdImg src={prod_img} />
                      </ProdImgBox>
                    )) : null}
                    <AddProdButton onClick={() => setGimgChanged(true)} >
                      <AddProdImgSvg xmlns="http://www.w3.org/2000/AddProdImgSvg" viewBox="0 0 448 512">
                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
                      </AddProdImgSvg>
                    </AddProdButton>
                    {isGImgChanged? (
                      <GImgModalBackground>
                        <GImgModalWrapper> 
                            <CloseSVG onClick={() => setGimgChanged(false)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
                            </CloseSVG>
                          <GImgModalContainer> 
                            <EditProdImg />
                          </GImgModalContainer>
                          <SavePImgButtContainer>
                            <SaveProdImgButton onClick={() => saveImg(`${deal.product.id}`,prodImgsToUpdate ,'g')}>저장</SaveProdImgButton>  
                          </SavePImgButtContainer>
                        </GImgModalWrapper>
                      </GImgModalBackground>
                    ) : null}
                  </ProdImgRow>
                </div>       
                <DelDealButton onClick={() => onDelete(deal.id)} className="text-sm flex mx-auto p-2 bg-white rounded-lg shadow-md hover:bg-red-400 transition duration-500">
                  <CancelSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">                
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                  </CancelSVG>
                  Delete
                </DelDealButton>
              </EditMyDealsWrappper>
            ))}
          </SliderRow>
          <PrevButton onClick={decreaseIndex}>
            <FontAwesomeIcon icon={faChevronRight} />
          </PrevButton>
        </SliderWrapper>
      </AnimatePresence>
      <p className=" mt-10 text-lg font-semibold text-center"> 현재 고객님이 '주문 중 이거나' 또는 '미리 담기가 진행 중'일 경우 등록하신 거래가 삭제되지 않습니다!💛</p>
    </Wrapper>
  )
}
export default EditMyDeals;