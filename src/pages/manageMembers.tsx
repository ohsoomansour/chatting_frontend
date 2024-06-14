import { useState } from "react";
import MemberTable from "../components/MembersTable";
import { tokenState } from "../recoil/atom_token";
import { useRecoilValue} from 'recoil';
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import styled from "styled-components";
import { BASE_PATH } from "./logIn";
import { getCookie } from "../utils/cookie";


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
const SearchSVG = styled.svg`
  width: 35px;
  height: 35px;
  fill: black;
  transition: fill 0.3s ease-in-out;
  &:hover {
      fill: #696969;
  }

`;
const SearchBtn = styled.button`
  display: flex;
  justify-content: center; 
  align-items: center; 
  font-size: 15px;
  height: 35px;
  width:200px;
  margin-top:10px;
  border: none;
  outline: none;
  cursor:pointer;
  color: #D0EE17;
  background-color: gray;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: #696969;
  }
  box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.3);
`;
const BtnContainer = styled.div`
  display:flex;
` ;
/*
 * @Author : OSOOMAN
 * @Date : 2024.1.16
 * @Function : 회원을 관리하는 함수 
 * @Parm : 
 * @Return : 
 * @Explain : 전체 회원 조회, 이름을 통한 회원 검색, 회원 정보 수정 기능, 비활성화 기능 
 */
export const ManageMembers:React.FC = () => {
  const {register, getValues, formState:{ errors },} = useForm<ImngMember>({mode: "onChange"})
  //const token = useRecoilValue(tokenState);
  const ckToken = getCookie('token');
  const [isAll, setIsAll ] = useState(false);
  const [members, setMembers] = useState<Imember[]>([]);//{id:0, userId:'', address:'', name:'', lastActivityAt:'', isDormant:null, memberRole: '' }
  const [searchedUser, setSearchedUser] = useState<IschUser[]>([]); //[{id:0, userId:'', address:'', name:'', lastActivityAt:'', isDormant:null, memberRole: '' }]

  const headers = new Headers({
    'Content-Type':'application/json; charset=utf-8',
    'x-jwt': `${ckToken}`,
  });
  //@Explain: 전체 회원 조회

  const getMembers = async () => {
    setIsAll(true);
    const members = await (
      await fetch(`${BASE_PATH}/admin/members`, {
        headers : headers,
        method: 'GET',
      })
    ).json();
    setMembers(members)
  }
  //@Explain: (회원 이름으로 ) 검색 기능
  const searchAmember = async () => {
    setIsAll(false);
    const {searchedName} = getValues();
    const searchedUser = await (
      await fetch(`${BASE_PATH}/admin/members/search?name=${searchedName}`, {
        headers: headers,
        method: 'GET',
      })
    ).json();
    setSearchedUser(searchedUser);
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
      <div className=" mt-4 max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
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
          <SearchSVG
            onClick={() => searchAmember() }
            className=" mt-4 ml-2 cursor-pointer"
            viewBox="0 0 512 512"
          >
            <path 
                d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"
            />
          </SearchSVG>
        </div >
        <BtnContainer>
          <SearchBtn onClick={() => getMembers()} className="  text-white font-bold transition-colors  py-2 px-4 mr-2 rounded focus:outline-none focus:shadow-outline-blue">View all members</SearchBtn>
          <SearchBtn onClick={inactivateAccount} className=" text-white font-bold transition-colors  py-2 px-4 rounded focus:outline-none focus:shadow-outline-black">Deactivate accounts</SearchBtn>
        </BtnContainer>
      </div>
      <MemberTable members={members} member={searchedUser} isAll={isAll} />
    </div>
  )  
}