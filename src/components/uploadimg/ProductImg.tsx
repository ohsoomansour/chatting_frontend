import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useRecoilState } from "recoil";
import { productImgState } from "../../recoil/atom_Img";

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
            <div {...getRootProps()}>
                <h1>상품 사진 등록</h1>
                <input 
                    {...getInputProps()}
                    type="file"
                />
            </div>
            <div>
                {imagesPreview.map((prod_img, idx) => (
                    <div key={idx}>
                        <img src={prod_img.preview} className="mb-4"/>
                        <div onClick={() => delProdImg(prod_img.file.name)}>X</div>   
                    </div>
                ))}
            </div>
        </div>
    )
} 

