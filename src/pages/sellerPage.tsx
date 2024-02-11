import { useDropzone } from "react-dropzone";
import { UI } from "../components/Streaming"
import { useCallback, useState } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { tokenState } from "../recoil/atom_token";
import { useForm } from "react-hook-form";
import { userIdState } from "../recoil/atom_user";
import { CompaImg } from "../components/CompaImg";
import { compaImgState } from "../recoil/atom_compaImg";
import { FormError } from "../components/form-error";
import { sellerAddress } from "../recoil/atom_address";
import SellerPostcode from "../components/address/seller-postcode";

const Wrapper = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

interface ISellerForm {
  company: string;
  sellerId: string;
  rbName: string;
  price:number;
  maintenance_cost: number;
  description:string;
}   


export const SellerPage = () => {
  const token = useRecoilValue(tokenState)
  const userId = useRecoilValue(userIdState);
  const compaImg = useRecoilValue(compaImgState);
  const [threeDFile, setThreeDFile] = useState([]);
  const {getValues, register, formState:{errors}} = useForm<ISellerForm>({ mode: "onChange" })
  const selAddress = useRecoilValue(sellerAddress);
  // s3에 넘기고 -> glb파일 URL ->  DB에 넘겨주는 작업 
  
  let rbURL = "";
  let coImgURL = "";
  const onRegister = async() => {
    
    try {
      //회사 이미지 업로드
      if(compaImg.length !==0 ) {
        const imgForm = new FormData();
        const actualImgFile = compaImg[0];
        imgForm.append('file', actualImgFile);
        const { url: compaImgURL} = await (
          await fetch("http://localhost:3000/upload", {
            method:'POST',
            body: imgForm
          })
        ).json()
        coImgURL = compaImgURL;
      }


      // robot 3d model 또는 mp4 영상
      if(threeDFile.length !== 0 && compaImg.length !== 0){
        // GLB URL 생성
        const formBody =  new FormData();
        const actualFile = threeDFile[0];
  
        formBody.append('file', actualFile);
        const { url: RobotURL} = await (
          await fetch("http://localhost:3000/upload", {
            method: 'POST',
            body: formBody
          })
        ).json();
        rbURL = RobotURL;
        // deal 생성
        const {company, sellerId, rbName, price ,maintenance_cost, description } = getValues();

        
        const headers = new Headers({
          'Content-Type':'application/json; charset=utf-8',  // 'application/json; charset=utf-8', //'multipart/form-data',  
          'x-jwt': `${token}`,
        });
        console.log('threeDFile 들어오나?')
        console.log(threeDFile[0])
        await (
          await fetch('http://localhost:3000/seller/make-deal', {
            headers:headers,
            method: 'POST',
            body: JSON.stringify({
              compa_name: company,
              compaBrand_ImgURL: coImgURL,
              seller_address: selAddress,
              seller: sellerId,
              name: rbName,
              price,
              maintenance_cost,
              description: description,
              rbURL
            })
          })
        ).json()
        window.location.href = '/trade'
        
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
    <UI className=' w-2/4 border-4 border-gray-100 p-4 shadow-lg rounded-lg'>
    <h2 className=" text-lg font-bold ">Private or Company</h2> 
      <input
          {...register('company', { required: "What is the manufacturing company? " })}
          className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-blue-300'
          placeholder="A manufacturing company (en) entreprise de fabrication(français)"
          type="text"
          size={10}
        />
      {errors.company?.message && <FormError errorMessage={errors.company.message}/>}
      <h3 className="text-center">Add your robot Brand Image</h3>
      <CompaImg />
      <h2 className=" text-lg font-bold ">Seller</h2> 
      <input
        {...register('sellerId',
        {required:true,
          pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
        })}
        className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-blue-300'
        value={userId}
        placeholder="Your Email address!"
        type="email"
        size={10} 
      />
      {errors.sellerId?.type === "pattern" && (<FormError errorMessage="You need to log in!"/>)}
      <SellerPostcode />

      <h2 className=" text-lg font-bold ">Product</h2>  
      <input
        {...register('rbName', {required:"Please write a product name"})}
        className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-blue-300'
        type="text"
        placeholder="The robot name"
        size={10}
      />
      {errors.rbName?.message && (<FormError errorMessage={errors.rbName.message}/>)}
      <input
        {...register('price')}
        className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-blue-300'
        placeholder="The selling price"
        type="number"
        size={10}
      />
      <input
        {...register('maintenance_cost')}
        className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-blue-300'
        placeholder="Maintenace Cost"
        type="number"
        size={10}
      />

      <input
        {...register('description')}
        className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-blue-300'
        placeholder="Explain your product about the robot"
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
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload or drag</span>  and drop your Robot product video or 3d Model</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">GLB or or mp4 or SVG, PNG, JPG, GIF  (MAX. 800x400px) </p>
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