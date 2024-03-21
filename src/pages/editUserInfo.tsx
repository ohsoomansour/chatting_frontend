import { useForm } from "react-hook-form"
import { FormError } from "../components/form-error";
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenState } from "../recoil/atom_token";
import { userIdState } from "../recoil/atom_user";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { BASE_PATH, getMyinfo } from "../api";
import styled from "styled-components";
const EditProfileWrapper = styled.div`
  background-color:${props => props.theme.bgColor}
`;
interface IeditUserInfo{
  email:string;
  password:string;
  address:string;
}

export interface IuserInfo{
  id:number;
  userId:string;
  password:string;
  name:string;
  address: string;
  mobile_phone:number;
  memberRole:string;
  lastActivityAt: string;
  isDormant: boolean;
}
interface IResult {
  ok:boolean;
  error:string;
}

export const EditUserInfo  = () => {
  const {register, getValues, formState:{errors} } = useForm<IeditUserInfo>({"mode": "onChange"});
  const token = useRecoilValue(tokenState);
  const [userId, setUserId] = useRecoilState<string>(userIdState);
  const { data:whoamI, isLoading } = useQuery<IuserInfo>(
    ["me", "Member"], () => getMyinfo(token)
  );

  const headers = new Headers({
    'Content-Type':'application/json; charset=utf-8',
    'x-jwt': `${token}`,
  });
  const onModify = async (e: any) => {
    e.preventDefault(); 
    const {email, password, address } = getValues() //이건 변경된 email 
    if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))){
      alert('이메일 형식이 아닙니다!💛');
      return;
    } else if(password.length < 10) {
      alert('패스워드의 길이가 10자 이상이 아닙니다!💛');
      return;
    } else if(address.length < 5) {
      alert('주소의 길이는 5자 이상이어야 합니다!💛')
      return;
    }

    setUserId(email);
    
    const result:IResult = await(
      await fetch(`${BASE_PATH}/member/update/${whoamI?.id}`, {
        headers: headers,
        method: 'PATCH',
        body: JSON.stringify({
          userId:email,
          password:password,
          address:address,
        })  
      })
    ).json();
    if(!result.ok){
      alert(result.error);
    } else {
      window.location.href = '/';
    }
  }
  return (
    <div className=" w-full h-2/4 flex flex-col items-center justify-center shadow-lg">
      <Helmet>
        <title>Trader | Edit Profile</title>
      </Helmet>
      <form
        className= " w-2/4"
        > 
        <EditProfileWrapper className="mb-4 flex flex-col w-full bg-slate-400  p-8 rounded shadow-2xl">
          <h1 className=" text-2xl text-black text-center font-bold mb-4">Edit Profile</h1>
          <h4 className="ml-4 text-lg text-black text-left font-bold mb-2">Email</h4>
          <input
            {...register("email", {
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
            
            })} 
            className="input text-black text-lg text-center font-semibold mb-2  rounded"
            type="email" 
            placeholder="Please Enter the Email you want to change."
            autoComplete="on"
          />
          {errors?.email?.message && (
            <FormError errorMessage={errors.email.message} />
          )}
          {errors?.email?.type === 'pattern'&& (
            <FormError errorMessage={"Please Insert a valid Email that you would like to change!"} />
          )}
          <h4 className="ml-4 text-black text-lg text-left font-bold mb-2 mt-2">Password</h4>
          <input
            {...register("password", {required: "Password is required", minLength:10})} 
            type="password" 
            placeholder="Please Enter the password you want to change."
            className="input mb-2 text-center font-semibold rounded"
          />
          {errors?.password?.message && (
            <FormError errorMessage={errors.password.message}/>
          )}
          {errors?.password?.type === 'minLength' && (
            <FormError errorMessage={"Password must be at least 10 chars!"} />
          )}
          <h4 className="ml-4 text-black text-lg text-left font-bold mt-2 mb-2">Address</h4>
          <input
            {...register("address", {required: "Please insert a valid Email you would like to change!" , minLength:5})} 
            type="text" 
            className="input mb-2 text-center font-semibold rounded"
            placeholder="Please Enter the address you want to change."
          />
          {errors?.address?.message && (
            <FormError errorMessage={errors.address.message}/>
          )}
          {errors?.address?.type === 'minLength' && (
            <FormError errorMessage={"Address must be at least 5"}/>
          )}
          <button
            onClick={(e) => onModify(e)}
            className="text-white font-semibold py-3 px-4 mt-5 border-4 border-white rounded hover:bg-indigo-200 transition duration-500">Submit</button>
        </EditProfileWrapper>
      </form>

    </div>
  )
}