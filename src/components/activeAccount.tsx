import { useRecoilValue } from "recoil";
import { IuserInfo } from "../pages/editUserInfo";
import { tokenState } from "../recoil/atom_token";
import { userIdState } from "../recoil/atom_user";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { BASE_PATH } from "../pages/logIn";


export const ActiveAccount  = () => {
  //설계: '비활성화' -> '활성화' 후 홈으로 이동하는 로직 
  const token = useRecoilValue(tokenState);
  const userId = useRecoilValue(userIdState);
  const history = useHistory();
  const headers = new Headers({
    'Content-Type':'application/json; charset=utf-8',
    'x-jwt': `${token}`,
  });
  const [user, setUser] = useState<IuserInfo>()
  useEffect(() => {
    const getUserFunc = async () => {
      const user:IuserInfo = await (
        await fetch(`${BASE_PATH}/member/getuser`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({
            userId: userId,
          })
        })
      ).json();
      console.log('activeAccout의 user:')
      console.log(user)
      setUser(user);
      
    }
    getUserFunc();
  }, [])

  const onActivate = async () => {
    //#현재 활성화 상태의 경우: 활성화 컨트롤러 안타도 되고 바로 home으로 
    if(user?.isDormant === false) {
      alert('회원님의 계정이 이미 활성화 되었습니다.');
      history.push('/')
    } else{
      //#회원 계정 활성화
      const activatedMember = await ( 
        await fetch(`http://localhost:3000/member/activate/${userId}`, {
          headers: headers,
          method: 'PATCH',
        })
      ).json()
      
      alert('회원님의 계정이 활성화 되었습니다.');
      // 따라서 undefin활성화 상태가 아닐 경우 구분
      if(activatedMember?.isDormant === false) {
        history.push('/');
      }
    }
  }
  return (
    <div >
      <h1 className=" text-lg font-bold text-center mb-8 mt-4" > {`안녕하세요 ${user?.name} 고객님 계정 활성화 후 정상적으로 사용이 가능합니다.`} </h1>
      <div className=" flex flex-col justify-items-center align-middle max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
        <h1 className="text-center font-bold mb-4 mt-4 "> {`${user?.userId}님 계정 활성화`}</h1>  
        <button onClick={onActivate} className=" text-white font-bold transition-colors bg-slate-600 hover:bg-green-400 py-2 px-4 rounded focus:outline-none focus:shadow-outline-black">Activate account</button>
      </div>
    </div> 
  );
}