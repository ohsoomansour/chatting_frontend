import { useDropzone } from "react-dropzone";
import { UI } from "../components/Streaming"
import { useCallback, useState } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { tokenState } from "../recoil/atom_token";
import { useForm } from "react-hook-form";
import { userIdState } from "../recoil/atom_user";

const Wrapper = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

export const SellerPage = () => {
  const token = useRecoilValue(tokenState)
  const userId = useRecoilValue(userIdState);
  const [threeDFile, setThreeDFile] = useState([])
  const {getValues, register} = useForm()
  // s3에 넘기고 -> glb파일 URL ->  DB에 넘겨주는 작업 
  let rb3dURL = '';
  const onRegister = async() => {
    try {
      const actualFile = threeDFile[0];
      const formBody = new FormData();
      formBody.append('file', actualFile);
      const { url: Robot3dURL} = await (
        await fetch("http://localhost:3000/upload", {
          method: 'POST',
          body: formBody
        })
      ).json();
      rb3dURL = Robot3dURL;
      // fetch API 
      if(rb3dURL !== '') {
        const headers = new Headers({
          'Content-Type':'application/json; charset=utf-8',
          'x-jwt': `${token}`,
        });
        const {sellerName, rbName, price, descrption } = getValues()
        const deal = fetch('http://localhost:3000/seller/make-deal', {
          headers:headers,
          method: 'POST',
          body: JSON.stringify({
            seller: sellerName,
            robot:{
              name: rbName,
              price: price,
              descrption: descrption,
              rb_glbURL: rb3dURL
            }
          })
        })
        console.log('deal 생성:')
        console.log(deal);
      }
    } catch (e) {

    }
  } 
  const onDrop = useCallback( (acceptedFiles:any) => {
    // 파일이 드롭됐을 때의 로직을 처리합니다.
    console.log("sellerPage file:")
    console.log(acceptedFiles);
    setThreeDFile(acceptedFiles)

  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg'],
      'image/png': ['.png'],
      'video/mp4': ['.mp4', '.MP4'],
      "model/gltf+json": [".gltf"],
      "model/gltf-binary": [".glb"],
    }
  });

  return (
  <Wrapper>  
    <UI className=' w-2/4'>
    <h2 className=" text-lg font-bold">Seller</h2> 
    <input
        {...register('sellerName')}
        className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-blue-300'
        value={userId}
        type="text"
        size={10}
      />
      
    <h2 className=" text-lg font-bold">Product</h2>  
      <input
        {...register('rbName')}
        className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-blue-300'
        type="text"
        placeholder="Robot Name"
        size={10}
      />
      <input
        {...register('price')}
        className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-blue-300'
        placeholder="Price"
        type="number"
        size={10}
      />
      <input
        {...register('descrption')}
        className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-blue-300'
        placeholder="Explain your a product about Robot"
        type="text"
        size={10}
      />          
      <div 
        {...getRootProps()}
        className="flex items-center justify-center w-full  mt-2 ">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-50 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor"  strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">GLB or SVG, PNG, JPG, GIF  (MAX. 800x400px) or mp4</p>
          </div>
          
        </label>
        <input
          {...getInputProps()}
          type="file"
        />
          
      </div>
          
      <button onClick={onRegister} className='min-w-full mx-auto mt-2 mb-4 bg-white p-6 rounded-md shadow-md'>Register</button>
      </UI>
    </Wrapper>    
  )
}