import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useRecoilState } from "recoil";
import { productImgState } from "../../recoil/atom_Img";
import styled from "styled-components";
const ProdUploadContainer = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
`;
const ProdUploadSvg = styled.svg`
    width: 100px;
    height: 100px;
    fill: whitesmoke;
    transition: fill 0.5s ease-in-out; 
    &:hover{
      fill: #E0F14E;      
    }
    cursor:pointer;
`;
const ProdImgContainer = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
`;

const ProdImgWrapper = styled.div`
    position: relative;
    padding: 10px;   
`;
const DelProdImg = styled.svg`
    position: absolute;
    top: 5px;
    right:0px;
    fill: whitesmoke;
    transition: fill 0.3s ease-in-out;
    
    &:hover{
        fill: red;
    }
    cursor:pointer;
    width:30px;
    height:30px;
`;
const ProdImg = styled.img`
    width: 300px;
    height: 300px;
`;



export interface IProdimg{
    file: File;
    preview:string;
}
 
export const ProductImg = () => {
    const [imges ,setImgsRec] =  useRecoilState(productImgState);
    const [imagesPreview, setImagesPreview] = useState<IProdimg[]>([]);

    const delProdImg = (name:string) => {
        setImagesPreview(imagesPreview.filter((prod_img) => prod_img.file.name !== name));
        setImgsRec(imagesPreview.filter((prod_img) => prod_img.file.name !== name));
        

    }
    const onDrop = useCallback((acceptedFiles:File[]) => {
        console.log("Prod_acceptedFiles", acceptedFiles)
        const mappedFiles = acceptedFiles.map((file: File, idx) => {
            const prodImg:IProdimg = {
                file,
                preview: URL.createObjectURL(file)
            };
            return prodImg;
        })
        
        setImagesPreview([...imagesPreview, ...mappedFiles])
        setImgsRec([...imagesPreview, ...mappedFiles])
       
    }, [imagesPreview])
    console.log("imagesPreview:", imagesPreview)
    const {getRootProps, getInputProps}  = useDropzone({
        onDrop,
        accept:{
            'image/jpeg': ['.jpeg'],
            'image/png' : ['.png']
        }
    }) 
    return (
        <div
            
        >
            <ProdUploadContainer {...getRootProps()}>
                <h2 className="text-center text-xl font-bold mt-4 ">대표 상품 외 사진 또는 영상을 등록하세요.</h2 >
                <ProdUploadSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"/>
                
                    <input 
                        {...getInputProps()}
                        type="file"
                    />
                </ProdUploadSvg>
            </ProdUploadContainer>
            <ProdImgContainer>
                {imagesPreview.map((prod_img, idx) => (
                    <ProdImgWrapper key={idx}>
                        <DelProdImg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" onClick={() => delProdImg(prod_img.file.name)}>
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232H328c13.3 0 24 10.7 24 24s-10.7 24-24 24H184c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/>
                        </DelProdImg> 
                        <ProdImg src={prod_img.preview} className="mb-4"/>
                    </ProdImgWrapper>
                ))}
            </ProdImgContainer>
        </div>
    )
} 

