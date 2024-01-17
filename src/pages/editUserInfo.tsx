import { useForm } from "react-hook-form"
import { FormError } from "../components/form-error";
import { useRecoilValue } from "recoil";
import { tokenState } from "../recoil_token";
import { useState } from "react";
import { userIdState } from "../recoil_user";

interface IeditUserInfo{
  email:string;
  password:string;
  address:string;
}
export const EditUserInfo  = () => {
  
  const {register, getValues, formState:{errors}, handleSubmit} = useForm<IeditUserInfo>({"mode": "onChange"})
  const token = useRecoilValue(tokenState);
  const userId = useRecoilValue<string>(userIdState);
  console.log(userId);
  const [id, setId] = useState<number>();
  const headers = new Headers({
    'Content-Type':'application/json; charset=utf-8',
    'x-jwt': `${token}`,
  });
  const onModify = async (e: any) => {
    e.preventDefault(); //새로고침 방지
    //#기존의 id와 member를 불러와야 됨
    const {email, password, address } = getValues() //이건 변경된 email 
    console.log(email, password, address) //
   // #구분을 id로 지정
    const id:number = await (
      await fetch('http://localhost:3000/member/getid', {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({
          userId:userId,
        })
      })
    ).json();
      
    //setId(result);
    console.log('prevUserId_id:');
    console.log(id);
    const member = await (
      await fetch(`http://localhost:3000/member/update/${id}`, {
        headers: headers,
        method: 'PATCH',
        body: JSON.stringify({
          userId:email,
          password:password,
          address:address
        })
      })
    ).json(); 
      
    console.log('Client가 editProfile 실행한 결과:')
    console.log(member);
  }

  return (
    <div className="fixed w-full h-full flex flex-col items-center justify-center">
      <form
        
        > 
        <div className="flex flex-col bg-slate-400 max-w-md p-8 rounded shadow-lg ">
          <h1 className=" text-lg text-white text-center font-bold mb-4">Edit Profile</h1>
          <h4 className="text-lg text-center font-bold mb-2">Email</h4>
          <input
            {...register("email", {
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
            
            })} 
            className="input mb-2" 
            type="email" 
            placeholder="Email"
            autoComplete="on"
          />
          {errors?.email?.message && (
            <FormError errorMessage={errors.email.message} />
          )}
          {errors?.email?.type === 'pattern'&& (
            <FormError errorMessage={"Please Insert a valid Email that you would like to change!"} />
          )}
          <h4 className="text-lg text-center font-bold mb-2 mt-2">Password</h4>
          <input
            {...register("password", {required: "Password is required", minLength:10})} 
            type="password" 
            className="input mb-2"
          />
          {errors?.password?.message && (
            <FormError errorMessage={errors.password.message}/>
          )}
          {errors?.password?.type === 'minLength' && (
            <FormError errorMessage={"Password must be at least 10 chars!"} />
          )}
          <h4 className="text-lg text-center font-bold mt-2 mb-2">Address</h4>
          <input
            {...register("address", {required: "Please insert a valid Email you would like to change!"})} 
            type="text" 
            className="input mb-2"
          />
          {errors?.address?.message && (
            <FormError errorMessage={errors.address.message}/>
          )}
        <button
         onClick={(e) => onModify(e)}
         className="text-white font-semibold py-3 px-4 mt-5 border-4 border-white rounded hover:bg-slate-600">Submit</button>
        </div>
      </form>

    </div>
  )
}