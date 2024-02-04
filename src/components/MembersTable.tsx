import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { tokenState } from "../recoil/atom_token";

interface Imember {
  id:number;
  userId:string;
  name:string;
  address:string;
  lastActivityAt:string;
  isDormant:boolean | null;
  memberRole:string;
}
interface IschUser{
  id:number;
  userId:string;
  name:string;
  address:string;
  lastActivityAt:string;
  isDormant:boolean | null;
  memberRole:string;
}

//로직: props로 members는 전체 회원, searchedMember
// 파라미터{prop1, prop2}:{prop1:Imember[], prop2:}
const MemberTable = ({members, member, isAll}:{members:Imember[], member:IschUser, isAll:boolean}) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [id, setId] = useState(0);
  const token = useRecoilValue(tokenState);
  const {getValues, register} = useForm();
  const openPopup = () => {
    setPopupOpen(true);
  };
  const closePopup = () => {
    setPopupOpen(false);
  };
  const onEditUser = (id:number) => {
    //#솔루션:팝업창 띄워서 바로 해결
    openPopup();
    setId(id)
  }
  const headers = new Headers({
    'Content-Type':'application/json; charset=utf-8',
    'x-jwt': `${token}`,
  });
  const onModify = async () => {
    //변경된 부분 알림!
    const {address, memberRole} = getValues()
    const member = await (
      await fetch(`http://localhost:3000/admin/update/${id}`, {
        headers: headers,
        method: 'PATCH',
        body:JSON.stringify({
          address: address,
          memberRole: memberRole
        })
      })
      //변경된 회원
    
    ).json();
    alert(`Address:${member.address} MemberRole:${member.memberRole} are updated!`)
    console.log('업데이트된 member');
    console.log(member);
  }
  return (
    <div className="container mx-auto my-8">
      <h1 className="text-2xl font-semibold mb-4">Member List</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">UserId</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">lastActivityAt</th>
            <th className="py-2 px-4 border-b">isDormant</th>
            <th className="py-2 px-4 border-b">memberRole</th>
            <th className="py-2 px-4 border-b">변경</th>
          </tr>
        </thead>
        <tbody>
          {isAll?
           members.map((member, index) => (
              <tr key={index} className="text-center">
                <td className="text-center py-2 px-4 border-b">{member.userId}</td>
                <td className="text-center py-2 px-4 border-b">{member.name}</td>
                <td className="text-center py-2 px-4 border-b">{member.address}</td>
                <td className="text-center py-2 px-4 border-b">{member.lastActivityAt}</td>
                <td className="text-center py-2 px-4 border-b">{member.isDormant ? 'true' : (member.isDormant === false ? 'false' : '')}</td>
                <td className="text-center py-2 px-4 border-b">{member.memberRole}</td>
                <button onClick={() => onEditUser(member.id)} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">편집</button>
              </tr>
            ))
            :(
              <tr className="text-center">
                <td className="text-center py-2 px-4 border-b">{member.userId}</td>
                <td className="text-center py-2 px-4 border-b">{member.name}</td>
                <td className="text-center py-2 px-4 border-b">{member.address}</td>
                <td className="text-center py-2 px-4 border-b">{member.lastActivityAt}</td>
                <td className="text-center py-2 px-4 border-b">{member.isDormant ? 'true' : (member.isDormant === false ? 'false' : '')}</td>
                <td className="text-center py-2 px-4 border-b">{member.memberRole}</td>
                <button onClick={() => onEditUser(member.id)} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">편집</button>
              </tr>
             )
          }
          
          
        </tbody>
      </table>
      
      <div className="min-h-screen flex items-center justify-center">
        {isPopupOpen! && (
          <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50">
          <form> 
            <div className="flex flex-col bg-slate-400 max-w-md p-8 rounded shadow-lg ">
              <h1 className=" text-lg text-center font-bold mb-4">Edit</h1>
              <h4 className="text-lg text-center font-bold mb-2">Address</h4>
              <input
                {...register("address")} 
                type="text" 
                className="input"
              />
              <h4 className="text-lg text-center font-bold mb-2">Role</h4>
              <select {...register("memberRole", {required: "memberRole is required"} )} className=" input mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300">
                <option value="client">client</option>
                <option value="admin">admin</option>
              </select>
            <button
              onClick={onModify}
              className="text-white font-semibold py-3 px-4 mt-5 border rounded hover:bg-slate-600">Submit</button>
            </div>
          </form> 
            <button
              onClick={closePopup}
              className=" bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
            >CLOSE</button>  
          </div>
          
        )}
    </div>
    </div>
  );
};

export default MemberTable;
