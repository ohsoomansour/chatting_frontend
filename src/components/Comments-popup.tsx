import { useQuery } from "react-query"
import { BASE_PATH, getComments } from "../api";
import { IuserInfo } from "../pages/editUserInfo";
import { Loading } from "./loading";
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenState } from "../recoil/atom_token";
import { useForm } from "react-hook-form";
import { userIdState } from "../recoil/atom_user";
// API 구성: 나의 댓글 겟 , write, 업데이트, 삭제   
// 댓글 버튼 -> 코멘트 팝업 창 나와야 된다. 

interface IComments{
  id:number;
  writer:IuserInfo;
  content:string;
}

export const CommentsPopUp = () => {
  const [userId, setUserId] = useRecoilState<string>(userIdState);
  const token = useRecoilValue(tokenState);
  const {register, getValues} = useForm();
  const {data:datguls, isLoading} = useQuery<IComments[]>(
  ["Comment", "AllComments"], () => getComments()
  );
  const comments = datguls 
    ? datguls
    : []; 

  
  const onType = async(useremailId:string, e:any) => {
    e.preventDefault();
    if(userId === useremailId){
      const {commentInput} = getValues();
      await (
        await fetch(`${BASE_PATH}/comments/typing`, {
          headers:{
            'Content-Type':'application/json; charset=utf-8',
            'x-jwt': `${token}`,
          },
          method:'POST',
          body:JSON.stringify({
            content:commentInput
          })
        })
      ).json();
    }
  }
  return (
    <div>
      {isLoading ? <Loading /> : comments.map((commentInfo, index) => (
        <div key={index}>
          <form onSubmit={(e) => onType(commentInfo.writer.userId, e) }>
            <input {...register("commentInput")}/>

          </form>
        </div>
      ))}

    </div>
  )
}