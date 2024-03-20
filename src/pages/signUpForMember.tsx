import { Helmet, HelmetProvider } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { Button } from "../components/Button";
import { BASE_PATH } from "./logIn";
import { FormError } from "../components/form-error";
import styled from "styled-components";
import { useState } from "react";

export const PhoneValidation = styled.div`
  cursor:pointer;
`;
interface ISignUpForMemberForm {
  email: string;
  password: string;
  address:string;
  name:string;
  mobilePhone_number:string;
  memberRole:string;
  regionCode:string;
};
export interface IPhone{
  isValid:boolean;
  formattedNumber:string;
};
//📄https://react-hook-form.com/api/useform 제대로 이해 필요함 

export const SignUpForMember = () => {
  const {register, getValues, formState:{ errors },handleSubmit, formState,} = useForm<ISignUpForMemberForm>({mode: "onChange" });
  const history = useHistory();
  const [phoneEvent, setPhoneEvent] = useState<boolean>(false);
  const [mphoneValid, setMphoneValid] = useState(false);
  const [formattedMPnumber, setFormattedMPnumber] = useState<string>();
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

  const onValid = async () => {
    try {
      if(!phoneEvent){
        alert('휴대폰 번호 유효성 확인을 해주세요!💛');
        return;
      } else if(!mphoneValid){
        alert('휴대폰 번호의 값이 유효하지 않습니다!💛');
        return;
      }
      const {email, password, name, address, mobilePhone_number, memberRole} = getValues();
      const result = await (
        await fetch(`${BASE_PATH}/member/join`, {
          headers : {"Content-Type":"application/json; charset=utf-8"},
          method: 'POST',
          body: JSON.stringify({
            userId: email,
            password,
            name,
            address,
            mobile_phone:mobilePhone_number,
            memberRole,
          })
        })
      ).json();

      if(result.ok){
        history.push('/login');
      } else {
        alert(result.error);
      }
    } catch(e) {
      console.error(e);
    }
    
  }
  
  return (//rem: 16px 배수 > 2.5rem = 40px
  <div className="h-screen flex items-center flex-col mt-10 lg:mt-28"> 
   <HelmetProvider>
    <Helmet>
      <title>Trader | Sign up</title>
    </Helmet>
   </HelmetProvider>
    <div className=" w-full max-w-screen-sm flex flex-col px-5 items-center">
      <h4 className="w-full font-medium text-left text-3xl mb-5">
        Let's get started 
      </h4>
      <form 
        className="grid gap-2 mt-5 w-full mb-3" 
        onSubmit={handleSubmit(onValid)}
      > 
        <input
          {...register("email", {
            required: "Email is required",
            pattern:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/  
          })}
           placeholder="Email"
           className="input mb-1 focus:border-pink-400"
           type="email"
        />
        {errors.email?.type === "pattern" && (
          <FormError errorMessage="Please enter a valid email" />
        )}
        <input
          {...register("password", {required: "Password is required", minLength:10})} 
          type="password"
          placeholder="Password" 
          className="input focus:border-pink-400"
        />
        {errors.password?.message && (
          <FormError errorMessage={errors.password.message}/>
        )}
        {errors.password?.type === "minLength" && (
          <FormError errorMessage="Password must be more than 10"/>
        )}
        <input
          {...register("name", {required: "Name is required", minLength:2})} 
          placeholder="Name" 
          className="input focus:border-pink-400"
        />
        {errors.name?.message && (
          <FormError errorMessage={errors.name.message} />
        )}
        {errors.name?.type === 'minLength' && (
          <FormError errorMessage="Password must be more than 2"/>
        )}
        <div className=" flex">
          <select {...register("regionCode", {required:true})} className="border-2 focus:border-pink-400 mr-1">
            <option value="KR">South Korea (+82)</option>
            <option value="US">USA (+1)</option>
            <option value="GB">GB(+44)</option>
            <option value="JP">Japan(+81)</option>
          </select>
          <input
            {...register("mobilePhone_number", {required: "mobile phone number is required", minLength:9})} 
            placeholder="Mobile phone number" 
            className="input w-full focus:border-pink-400"
          />
          <PhoneValidation className="w-2/4 font-semibold flex justify-center items-center hover:bg-green-300 transition duration-500" onClick={onPhoneValid}>Validation</PhoneValidation>
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
            <FormError  errorMessage={"mobile phone number must be more than 10!"}/>
          )}
        
        <input 
          {...register("address", {required: "Address is required", minLength:5} )}
          className="input focus:border-pink-400"
          placeholder="Address"
        />
        {errors?.address?.message && (
            <FormError errorMessage={errors.address.message}/>
          )}
        {errors?.address?.type === 'minLength' && (
          <FormError errorMessage={"Address must be at least 5"}/>
        )}
        <select {...register("memberRole", {required: "memberRole is required"} )} className=" input mt-1 block w-full p-2  rounded-md shadow-sm focus:outline-none  focus:border-pink-400 ">
          <option value="client">client</option>
          <option value="admin">admin</option>
        </select>
        <Button
          canClick={formState.isValid}
          actionText={"Create!"}
        />
      </form>
      <div>
        You already used Trader?{" "}
        <Link to="/login" className=" text-green-300 font-bold hover:underline"> Sign in </Link>
      </div>
    </div>        
  </div>
  )
}