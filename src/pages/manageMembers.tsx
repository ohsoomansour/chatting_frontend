import { useState } from "react";
import MemberTable from "../components/MembersTable";
import { tokenState } from "../recoil/atom_token";
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
  const [isAll, setIsAll ] = useState(false);
  const [members, setMembers] = useState<Imember[]>([{id:0, userId:'', address:'', name:'', lastActivityAt:'', isDormant:null, memberRole: '' }]);
  const [searchedUser, setSearchedUser] = useState<IschUser>({id:0, userId:'', address:'', name:'', lastActivityAt:'', isDormant:null, memberRole: '' });


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