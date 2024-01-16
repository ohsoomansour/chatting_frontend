/*#문제점: admin의 UseGuard를 통과를 못 함 -> 통과하기 위해서는 token이 필요하다
   - 원리: jwt middleware에서 req.headers를 받아서 회원을 찾아서 req['member'] = member; 넣어주고 
          > next() 

   해결1. login의 결과에서 token을 받는데 이것을 headers에  넣어줘야
        > 또는 session에 넣어주던 지:로그인 후 받은 결과값을 token을 받아서 useRecoil를 사용해서 데이터를 넘겨준다?
         npm install recoil

  #async/await의 이해
   - (복습) async를 붙이면 해당 함수는 '항상 Promise(resolved promise)'를 반환
   - await promise 
   async function f() {
      let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("완료!"), 1000)
      });

      let result = await promise;  ✅프라미스가 이행될 때까지 기다림 (*)
    }
*/
import { useState } from "react";
import MemberTable from "../components/MembersTable";
import { tokenState } from "../recoil";
import { useRecoilValue} from 'recoil';
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";

interface Imember {
  id: number;
  userId:string;
  address:string;
  name:string;
  lastActivityAt:string;
  isDormant:boolean | null;
  memberRole:string;
}
interface IschUser{
  id: number;
  userId:string;
  name:string;
  address:string;
  lastActivityAt:string;
  isDormant:boolean | null;
  memberRole:string;
}
interface ImngMember{
  searchedName: string;

}
/*
 * @Author : OSOOMAN
 * @Date : 2024.1.16
 * @Function : 회원을 관리하는 함수 
 * @Parm : 
 * @Return : 
 * @Explain : 전체 회원 조회, 이름을 통한 회원 검색, 회원 정보 수정 기능, 비활성화 기능 
   - 사용법: 
   - 
 */
export const ManageMembers:React.FC = () => {
  const {register, getValues, formState:{ errors },} = useForm<ImngMember>({mode: "onChange"})
  const token = useRecoilValue(tokenState)
  console.log('token:')
  console.log(token)
  const [isAll, setIsAll ] = useState(false);
  const [members, setMembers] = useState<Imember[]>([{id:0, userId:'', address:'', name:'', lastActivityAt:'', isDormant:null, memberRole: '' }]);
  const [searchedUser, setSearchedUser] = useState<IschUser>({id:0, userId:'', address:'', name:'', lastActivityAt:'', isDormant:null, memberRole: '' });
  console.log('members:')
  console.log(members)

  const headers = new Headers({
    'Content-Type':'application/json; charset=utf-8',
    'x-jwt': `${token}`,
  });
  //@Explain: 전체 회원 조회
  const getMembers = async () => {
    setIsAll(true);
    const members = await (
        //then 후속 메서드: 도착한 응답에도 접근 vs await 
        await fetch('http://localhost:3000/admin/members', {
          headers : headers,
          method: 'GET',
        })
    ).json();
    console.log(members);
    setMembers(members)
  }
  //@Explain: (회원 이름으로 ) 검색 기능
  const searchAmember = async () => {
    setIsAll(false);
    const {searchedName} = getValues();
    const schAUser = await (
      await fetch(`http://localhost:3000/admin/members/search?name=${searchedName}`, {
        headers: headers,
        method: 'GET',
      })
    ).json();
    setSearchedUser(schAUser);
    console.log(schAUser)
  }
  //@Explain: 사용자 계정 비활성화 기능 
  const inactivateAccount = async () => {
      try {
        await fetch('http://localhost:3000/admin/members/inactive', {
          headers: headers,
          method: 'PATCH'
        })
        alert('관리자가 24시간 이상 사용하지 않은 계정들을 비활성화했습니다.')
      } catch (e) {
        console.error(e)
      }
  }
  return (
    <div>
     
      <div className=" max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
        {errors.searchedName?.type === "minLength" && (
          <FormError errorMessage={"keyword must be more at least 2 characters long."} />
        )}
        <div className="flex items-center border-b border-gray-300 pb-2 mb-4 mt-2">
          <input
            {...register("searchedName", {required: "we need a User'name to be searched", minLength: 2})}
            type="text"
            placeholder="회원 이름을 검색하세요."
            className="w-full border-none focus:outline-none"
          />
          <button onClick={() => searchAmember()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 rounded focus:outline-none focus:shadow-outline-blue">검색</button>
          
        </div >
        
        <button onClick={() => getMembers()} className="bg-blue-500 text-white font-bold transition-colors  hover:bg-blue-700  py-2 px-4 mr-2 rounded focus:outline-none focus:shadow-outline-blue">회원 전체 조회</button>
        <button onClick={inactivateAccount} className=" bg-green-400 text-white font-bold transition-colors hover:bg-slate-600  py-2 px-4 rounded focus:outline-none focus:shadow-outline-black">회원 계정 비활성화</button>
      </div>
      <MemberTable members={members} member={searchedUser} isAll={isAll} />

    </div>
  
  )  
}