/* #회원관리 
   1. 전체 회원 조회 기능
     > 전체조회 버튼 클릭 > 회원 전체를 불러온다.
   2. 회원 검색 기능: 검색창 + 
   3. 회원 정보 수정 기능 
   4. 비활성화 기능 
*/
import { useState } from "react";
import MemberTable from "../components/MembersTable";
import { tokenState } from "../recoil";
import { useRecoilValue} from 'recoil';
/*문제점: admin의 UseGuard를 통과를 못 함 -> 통과하기 위해서는 token이 필요하다
   - 원리: jwt middleware에서 req.headers를 받아서 회원을 찾아서 req['member'] = member; 넣어주고 
          > next() 

  해결1. login의 결과에서 token을 받는데 이것을 headers에  넣어줘야
        > 
         또는 session에 넣어주던 지:로그인 후 받은 결과값을 token을 받아서 useRecoil를 사용해서 데이터를 넘겨준다?
         npm install recoil
          
*/


interface Imember {
  userId:string;
  address:string;
  name:string;
  lastActivityAt:string;
  isDormant:boolean | null;
  memberRole:string;
}

//export default function Streaming() {
export const ManageMembers:React.FC = () => {
  
  const token = useRecoilValue(tokenState)
  console.log('token:')
  console.log(token)
  const [members, setMembers] = useState<Imember[]>([{userId:'', address:'', name:'', lastActivityAt:'', isDormant:null, memberRole: '' }]);
  console.log('members:')
  console.log(members)
  //프론트에서 session에서 token을 얻는 방법 
  const getMembers = async () => {
    const headers = new Headers({
      'Content-Type':'application/json; charset=utf-8',
      'x-jwt': `${token}`,
    });
    const members = await (
        await fetch('http://localhost:3000/admin/members', {
          headers : headers,
          method: 'GET',
        })
    ).json();
    console.log(members);
    setMembers(members)
  }
  
  //<div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
  return (
    <div>
     
      <div className=" max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
        <div className="flex items-center border-b border-gray-300 pb-2 mb-4">
          <input
            type="text"
            placeholder="회원 검색"
            className="w-full border-none focus:outline-none"
          />
          
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 rounded focus:outline-none focus:shadow-outline-blue">검색</button>
        <button onClick={() => getMembers()} className="bg-blue-500 hover:bg-blue-700 text-red font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue">회원 전체 조회</button>
        </div>
      </div>
      <MemberTable members={members} />

    </div>
  
  )  
}