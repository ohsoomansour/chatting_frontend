import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { IProdimg, ProdUploadSvg } from "./ProductImg";
import { useSetRecoilState } from "recoil";
import { productImgToUpdateState } from "../../recoil/atom_Img";

const ProdUploadWrapper=styled.div`
  top:50px;
  position: relative;
  width: calc(100%);
  height: 300px;
`;

const ProdUploadContainer=styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
`;
/**
  *@explain : margin: 0 auto & position이 absolute의 경우 
  * -> 평 방향의 margin을 absolute 속성과 함께 사용하면 left: 0; 및 right: 0;과 결합하여 부모 요소의 전체 너비를 차지하게 됩니다.
  * */
const DisplayImgsToUpateRow=styled.div`
  position: absolute;
  margin: 0 auto;
  left:0;
  right:0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  width: calc(100%);
  height: calc(100%-100px);
`;
const DisplayImgsToUpateBox=styled.div`
  position: relative;
  display:flex;
  align-items:center;
  justify-conetent:center;
`;

const DisplayImg=styled.img`
  width: calc(100%);
  height: calc(100%);
  border-radius: 8px;
`;

export const EditProdImg  = () => {
  const [prodImgToUpdate, setImgToUpdate] = useState<IProdimg[]>([]);
  const setFilesRecoilState = useSetRecoilState(productImgToUpdateState);

  const onDrop = useCallback((acceptedFiles:File[]) => {
    setFilesRecoilState(acceptedFiles);
  //console.log("EditProdImgAcceptedFile", acceptedFiles);
  const mappedFiles = acceptedFiles.map((file: File, idx) => {
    const prodImg:IProdimg={
      file,
      preview: URL.createObjectURL(file)
    };
  return prodImg;
  
  })
  setImgToUpdate([...prodImgToUpdate, ...mappedFiles]);
    }, [])
    
  const { getRootProps, getInputProps } = useDropzone({
    onDrop, //이벤트 핸들러 
    accept: {
      'image/jpeg': ['.jpeg'],
      'image/png': ['.png'],
    }
  });

  return (
    <ProdUploadWrapper>
      <ProdUploadContainer {...getRootProps()}>
        <ProdUploadSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
          <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"/>
          <input 
              {...getInputProps()}
              type="file"
          />
      </ProdUploadSvg>
      </ProdUploadContainer>
      <DisplayImgsToUpateRow>
        {prodImgToUpdate.map((pimg, index) => (
          <DisplayImgsToUpateBox>
            <DisplayImg key={index} src={prodImgToUpdate && prodImgToUpdate.length >  0 ? pimg.preview : ''} />
          </DisplayImgsToUpateBox>
        ))}
      </DisplayImgsToUpateRow>
    </ProdUploadWrapper>
  )
}