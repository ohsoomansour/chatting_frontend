import { useForm } from "react-hook-form"
import { FormError } from "../components/form-error";
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenState } from "../recoil/atom_token";
import { userIdState } from "../recoil/atom_user";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useQuery } from "react-query";
import { BASE_PATH, getMyinfo } from "../api";
import styled from "styled-components";

const EditProfileWrapper = styled.div`
  background-color:${props => props.theme.bgColor}
`;
interface IeditUserInfo{
  id:string;
  password:string;
  address:string;
  mobile_phone:string;
};

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
};
interface IResult {
  ok:boolean;
  error:string;
};

export const EditUserInfo  = () => {
  const {register, getValues, formState:{errors} } = useForm<IeditUserInfo>({"mode": "onChange"});
  const token = useRecoilValue(tokenState);
  const [userId, setUserId] = useRecoilState<string>(userIdState);
  //const [isPrePw, setPrevPw] = useState(false)   # useState 훅의 isPrePw값은 전역 스코프
  const { data:whoamI, isLoading } = useQuery<IuserInfo>(
    ["me", "Member"], () => getMyinfo(token)
  );
  
  const headers = new Headers({
    'Content-Type':'application/json; charset=utf-8',
    'x-jwt': `${token}`,
  });
  // /then(res => res.ok? alert('기존 비밀번호와 같습니다. 다른 비밀번호를 !') : alert('비밀번호 정상적으로 사용이 가능합니다.'))
  const onConfrimPw = async (e: any) => {
    e.preventDefault();
    const {id, password} = getValues();
    if(password){
      const result = await(
        await fetch(`${BASE_PATH}/member/confirmPrevPw`, {
          headers,
          method: 'POST',
          body:JSON.stringify({
            userId:id,
            password
          })
        })
      ).json(); 
        console.log(result)
         //setPrevPw(result.ok) 

        result.ok ? alert('이전 패스워드 값과 같습니다!') : alert("정상적으로 패스워드 변경이 가능합니다!")
    } else {
      alert('패스워드가 빈 값입니다!')
    }
    
  }

  const onModify = async (e: any) => {
    e.preventDefault(); 
    const {id, password, address, mobile_phone } = getValues() //이건 변경된 email 
    //기존 패스워드 값이 같을 경우 기능 -> 확인 


    if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(id))){
      alert('이메일 형식이 아닙니다!💛');
      return;
    } else if(password.length < 10) {
      alert('패스워드의 길이가 10자 이상이 아닙니다!💛');
      
      return;
      // isPrePw ? 패스워드가 이전과 같다 + 
    } else if(address.length < 5) {
      alert('주소의 길이는 5자 이상이어야 합니다!💛')
      return;
    }

    setUserId(id);
    //업데이트 api 
    const result:IResult = await(
      await fetch(`${BASE_PATH}/member/update/${whoamI?.id}`, {
        headers: headers,
        method: 'PATCH',
        body: JSON.stringify({
          userId:id,
          password:password,
          address:address,
          mobile_phone
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
      <HelmetProvider>
        <Helmet>
          <title>Trader | Edit Profile</title>
        </Helmet>
      </HelmetProvider>
      <form
        className= " w-2/4"
        > 
        <EditProfileWrapper className="mb-4 flex flex-col w-full bg-slate-400  p-8 rounded shadow-2xl">
          <h1 className=" text-2xl text-black text-center font-bold mb-4">Edit Profile</h1>
          <h4 className="ml-4 text-lg text-black text-left font-bold mb-2">아이디</h4>
          <input
            {...register("id", {
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
            
            })} 
            className="input text-black text-lg text-center font-semibold mb-2  rounded"
            type="email" 
            value={whoamI?.userId || ""}
            placeholder="Please Enter the Email you want to change."
            autoComplete="on"
          />
          {errors?.id?.message && (
            <FormError errorMessage={errors.id.message} />
          )}
          {errors?.id?.type === 'pattern'&& (
            <FormError errorMessage={"Please Insert a valid Email that you would like to change!"} />
          )}
          <h4 className="ml-4 text-black text-lg text-left font-bold mb-2 mt-2">비밀번호 </h4>
          <input
            {...register("password", {required: "Password is required", minLength:10})} 
            type="password" 
            placeholder="Please Enter the password you want to change."
            className="input mb-2 text-center font-semibold rounded"
          />
          <button onClick={(e) => onConfrimPw(e)}>비번 체크</button>
          {errors?.password?.message && (
            <FormError errorMessage={errors.password.message}/>
          )}
          {errors?.password?.type === 'minLength' && (
            <FormError errorMessage={"Password must be at least 10 chars!"} />
          )}
          <h4 className="ml-4 text-black text-lg text-left font-bold mt-2 mb-2">휴대폰 번호</h4>
          <input
            {...register("mobile_phone", {required: "Please insert a valid Email you would like to change!" , minLength:10})} 
            type="text" 
            defaultValue={whoamI? whoamI.mobile_phone : ""}
            className="input mb-2 text-center font-semibold rounded"
            placeholder="Please Enter the Cell phone number you want to change."
          />
          <h4 className="ml-4 text-black text-lg text-left font-bold mt-2 mb-2">주소</h4>
          <input
            {...register("address", {required: "Please insert a valid Email you would like to change!" , minLength:5})} 
            type="text" 
            defaultValue={whoamI? whoamI.address : ""}
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