import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { tokenState } from "../recoil/atom_token";
import { useForm } from "react-hook-form";
import { userIdState } from "../recoil/atom_user";
import { CompaImg } from "../components/CompaImg";
import { compaImgState } from "../recoil/atom_compaImg";
import { FormError } from "../components/form-error";
import { sellerAddress, sellerPostal, sellerRoad } from "../recoil/atom_address";
import SellerPostcode from "../components/address/seller-address";
import { Helmet } from "react-helmet";
import { BASE_PATH } from "./logIn";
import { Loading } from "../components/loading";
import { useHistory } from "react-router-dom";
import { IPhone, PhoneValidation } from "./signUpForMember";

export const UI = styled.div`
  display:flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

interface ISellerForm {
  company: string;
  sellerId: string;
  mobilePhone_number:number;
  rbName: string;
  price:number;
  maintenance_cost: number;
  description:string;
  regionCode:string;
}   

export const SellerPage = () => {
  const token = useRecoilValue(tokenState)
  const userId = useRecoilValue(userIdState);
  const compaImg = useRecoilValue(compaImgState);
  const [threeDFile, setThreeDFile] = useState([]);
  const sellerZipcode = useRecoilValue<string>(sellerPostal);
  const sellerDoro = useRecoilValue(sellerRoad);
  const selAddress = useRecoilValue(sellerAddress);
  const {getValues, register, formState:{errors}} = useForm<ISellerForm>({ mode: "all" });
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [phoneEvent, setPhoneEvent] = useState<boolean>(false);
  const [mphoneValid, setMphoneValid] = useState(false);
  const [formattedMPnumber, setFormattedMPnumber] = useState<string>()

  // s3에 넘기고 -> glb파일 URL ->  DB에 넘겨주는 작업 
  let rbURL = "";
  let coImgURL = "";
  const onRegister = async() => {
    try {
      const {company, sellerId, mobilePhone_number, rbName, price , maintenance_cost, description} = getValues();

      if(compaImg  === "") {
        alert('회사 로고 이미지를 넣어주세요!💛')
        return;
      } else if(company.length < 1){
        alert("회사 이름을 입력하세요!💛");
        return;
      } else if(sellerId === undefined){
        alert("판매자 아이디가 없습니다!")
        return;
      }  else if(!phoneEvent){
        alert('휴대폰 번호 유효성 확인을 해주세요!💛')
        return;
      } else if(!mphoneValid){
        alert('휴대폰 번호의 값이 유효하지 않습니다!💛')
        return;
      } else if(!(/^\d{10,11}$/.test(mobilePhone_number.toString()))) {
        alert("회원님의 휴대폰 번호가 10자리 또는 11자리가 아닙니다!💛")
      } else if(  !(/^\d{5}$/.test(sellerZipcode.toString()) || /^\d{3,5}-\d{3,5}$/.test(sellerZipcode.toString())) ){
        alert('우편 번호가 정상 코드가 아닙니다!💛');
        return;
      } else if(sellerDoro === "") {
        alert("도로 주솟값이 없습니다!💛");
        return;
      } else if(selAddress.length < 5) {
        alert('5자 이상 작성해주세요!💛');
        return;
      }  else if(sellerId === "") {
        alert("회원님의 이메일 아이디를 확인해 주세요!💛");
        return; 
      } else if(rbName === "") {
        alert("로봇의 이름을 입력해 주세요!💛");
        return;
      }  else if(price <= 0 ) {
        alert("상품의 가격을 0원 보다 큰 값을 입력하세요!💛");
        return;
      } else if(maintenance_cost < 0 || maintenance_cost === null || maintenance_cost === undefined) {
        alert("유지 보수 비용을 0 또는 0 보다 큰 값을 입력하세요!💛");
        return;
      } else if(!maintenance_cost) {
        alert("유지 보수 비용을 0 또는 0 보다 큰 값을 입력하세요!💛");
        return;
      }
      setIsLoading(true);
      //회사 이미지 업로드
      if(compaImg.length !==0 ) {
        const imgForm = new FormData();
        const actualImgFile = compaImg[0];
        imgForm.append('file', actualImgFile);
        const { url: compaImgURL} = await (
          await fetch(`${BASE_PATH}/upload`, {
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
          await fetch(`${BASE_PATH}/upload`, {
            method: 'POST',
            body: formBody
          })
        ).json();
        rbURL = RobotURL;
  
        const headers = new Headers({
          'Content-Type':'application/json; charset=utf-8',  // 'application/json; charset=utf-8', //'multipart/form-data',  
          'x-jwt': `${token}`,
        });

        
        await fetch(`${BASE_PATH}/seller/make-deal`, {
          headers:headers,
          method: 'POST',
          body: JSON.stringify({
            compa_name: company,
            compaBrand_ImgURL: coImgURL,
            seller_address: selAddress,
            sellerId: sellerId,
            salesManager_mobilephone:mobilePhone_number,
            name: rbName,
            price,
            maintenance_cost,
            description: description,
            rbURL
          })
        }).then(response => response.ok ? window.location.href = '/trade'  : history.go(0) )
      
        setIsLoading(false);
      }
    } catch (e) {

    }
  }

  const onDrop = useCallback( (acceptedFiles:any) => {
    // 파일이 드롭됐을 때의 로직을 처리합니다.
    setThreeDFile(acceptedFiles)
  }, []);
  const onPhoneValid = async() => {
    setPhoneEvent(true)
    const {regionCode, mobilePhone_number} = getValues();
    const {isValid, formattedNumber}:IPhone = await (
      await fetch(`${BASE_PATH}/phones/validation`,{
        headers: {
          'Content-Type':'application/json; charset=utf-8',
        },
        method: 'POST',
        body:JSON.stringify({
          regionCode,
          mobilePhone_number
        })
      })
    ).json();
    setMphoneValid(isValid);
    setFormattedMPnumber(formattedNumber);
  }
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
  <Wrapper className= "h-3/4">
    <Helmet>
      <title>Trader | Seller Page </title>       
    </Helmet>
    {isLoading 
      ? 
    <Loading /> 
      : 
    (
    <UI className='max-w-full  max-h-full border-4 border-gray-100 p-4  rounded-lg'>
      <div className=" flex h-2/4 items-center justify-center">
        <CompaImg  />
        <div className=" w-full flex-col items-center justify-center ">
          <h2 className=" text-lg text-center font-bold  ">Private or Company</h2> 
          <input
              {...register('company', { required: "What is the manufacturing company? " })}
              className='w-full mb-2 border-4 rounded-md focus:border-pink-400  border-gray-300  px-2 py-1 outline-none mr-2'
              placeholder="A manufacturing company (en)"
              type="text"
              size={10}
            />
          {errors.company?.message && <FormError errorMessage={errors.company.message}/>}
          <h2 className=" text-lg text-center font-bold relative t-20">Sales Manager</h2> 
          <input
            {...register('sellerId',
            {required:true,
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
            })}
            className='w-full border-4 rounded-md focus:border-pink-400  border-gray-300  px-2 py-1 outline-none mr-2'
            value={userId}
            placeholder="Your Email address!"
            type="email"
            size={10} 
          />
          {errors.sellerId?.type === "pattern" && (<FormError errorMessage="You need to log in!"/>)}
          <div className="flex  items-center mt-2 mb-2">
            <select {...register("regionCode", {required:true})} className=" h-12 border-4 focus:border-pink-400 mr-1 ">
              <option value="KR">South Korea (+82)</option>
              <option value="US">USA (+1)</option>
              <option value="GB">GB(+44)</option>
              <option value="JP">Japan(+81)</option>
            </select>
            <input
                {...register('mobilePhone_number', { required: "What is your mobile phone Number? ", minLength:10 })}
                className='w-full h-12 border-4 rounded-md focus:border-pink-400  border-gray-300  px-2 py-1 outline-none mr-2'
                placeholder="Enter your smart phone number!"
              
              />
            <PhoneValidation className="w-2/4 h-12 font-semibold flex justify-center items-center bg-green-300 " onClick={onPhoneValid}>Validation</PhoneValidation>  
          </div>
          {phoneEvent && (mphoneValid ? (
            <div className=" text-center font-semibold text-indigo-200">{formattedMPnumber} mobile phone number is valid! </div>
          ) : (
            <FormError errorMessage={'The mobile phone number is Not Valid'}/>
          ))}  
          {errors.mobilePhone_number?.message && (
            <FormError errorMessage={errors.mobilePhone_number.message}/>
          )}
          {errors.mobilePhone_number?.type === 'minLength' && (
            <FormError errorMessage={"Mobile Phone Number must be more than 10."}/>
          )}
          <SellerPostcode />
        </div>
      </div>
      <div className="max-h-full">   
      <h2 className=" text-lg font-bold ">Product</h2>  
      <input
        {...register('rbName', {required:"Please write a product name."})}
        className='w-full border-4 rounded-md focus:border-pink-400  border-gray-300  px-2 py-1 outline-none mr-2 mb-2'
        type="text"
        placeholder="The robot name"
        size={10}
      />
      {errors.rbName?.type === 'required' && (<FormError errorMessage={errors.rbName.message}/>)}
      <input
        {...register('price', {required:"Please Write the price."})}
        className='w-full border-4 rounded-md focus:border-pink-400  border-gray-300  px-2 py-1 outline-none mr-2 mb-2'
        placeholder="The selling price"
        type="number"
        size={10}
      />
      {errors.price?.type === 'required' && (<FormError errorMessage={errors.price.message}/>)}
      <input
        {...register('maintenance_cost', {required:"Please write the maintenance_costs."})}
        className='w-full border-4 rounded-md focus:border-pink-400  border-gray-300  px-2 py-1 outline-none mr-2 mb-2'
        placeholder="Maintenace Cost"
        type="number"
        defaultValue={0}
        size={10}
      />
      {errors.maintenance_cost?.type === 'required' && (<FormError errorMessage={errors.maintenance_cost.message}/>)}
      <input
        {...register('description', {required:"Please write descriptions."})}
        className='w-full border-4 rounded-md focus:border-pink-400 shadow-md border-gray-300  px-2 py-1 outline-none mr-2 mb-2'
        
        placeholder="Explain your product about the robot"
        type="text"
        size={10}
      />
      {errors.description?.type === 'required' && (<FormError errorMessage={errors.description.message}/>)}          
      <div 
        {...getRootProps()}
        className="flex items-center justify-center  mt-2 ">
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
          
      <button onClick={onRegister} className=' font-semibold w-full mx-auto mt-2 mb-4 bg-white p-6 rounded-md shadow-md hover:bg-slate-300 transition duration-500'>Register</button>
      </div>      
    </UI>
    )}
    </Wrapper>    
  )
}