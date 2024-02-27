import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import styled from 'styled-components';
import {  useRecoilValue, useSetRecoilState } from 'recoil';
import { isDarkAtom } from '../recoil/atom_Theme';
import ReactPlayer from "react-player";
import { userIdState } from '../recoil/atom_user';
import { useCallback } from 'react';
import {useDropzone} from 'react-dropzone'
import { Loading } from '../components/loading';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { BASE_PATH } from './logIn';
import {Mymessage, PeerMessage, RoomContainer } from './conference';
import { useHistory } from 'react-router-dom';

const ChattingWrapper=styled.div`
  background-color: ${(props) => props.theme.bgColor};
`;
const ChatContent=styled.div`
  color:${(props) => props.theme.textColor};
  background-color: whitesmoke;
`;
export const UI = styled.div`
  display:flex;
  flex-direction: column;
`;
const ChatContainer = styled.div``;

export const RplayerWrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  .player {
    border-radius: 20px;
    overflow: hidden;
    margin-top:10px;
  }
`;
const MyMessageWrapper = styled.div`
  display: flex;
  flex-direction:column;
`
const PeerMessageWrapper = styled.div`
  display: flex;
  flex-direction:column;
`;
const RoomBtnContainer = styled.div`
  display:flex;
  flex-direction:row;
`


interface ImsgObj{
  msg:string;
  url:string;
  time:string;
  myEmaiId:string;
}

interface IProps {
  msg:string;
  url:string;
  time: string;
  myEmaiId:string;
}
//"wss://trade-2507d8197825.herokuapp.com:8080/(네임스페이스)"  
//git add  -> git commit -m 
export const WS_BASE_PATH = process.env.NODE_ENV === "production" 
//wss:// 스킴은 기본적으로 443 포트를 사용하므로 포트를 지정할 필요가 없습니다.
 ? `wss://trade-2507d8197825.herokuapp.com`    //12.24일, 11:25`wss://trade.herokuapp.com`
 : "http://localhost:8080"


export default function Chatting() {
  const userId = useRecoilValue(userIdState);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const [roomName, setRoomName] = useState('');
  const [joinedUserList, setJoinedUserList] = useState<string[]>(['']);
  const [particapants, setParticapants] = useState<string[]>(['']);
  const [userExited, setUserExited ] = useState("");
  const {register, getValues} = useForm({mode: "onChange"})
  const [sc, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<IProps[]>([{msg:'', url: '', time: '',  myEmaiId: ""}]);
  const [inputMessage, setInputMessage] = useState('');
  const [DraggedFile, setDragFile] = useState([])
  const [isLoading, setLoading] = useState(false);
  const [isUserJoined, setUserJoined] = useState(false);
  const [isJoined, setIsJoined] = useState(false)
  
  const history = useHistory();

  useEffect(() => {
    // ✅https://socket.io/docs/v4/client-options/
    let sc = io(`${WS_BASE_PATH}`, {
      /*
      withCredentials:true,
      extraHeaders:{
        Authorization: `Bearer ${token}`,
      },*/
      transports:['websocket'], 
      //path:'/chat/socket.io',
    },
    ) 
    setSocket(sc)
    sc.on('message', (msgObj:ImsgObj) => {
      //⭐ 보낼때 isMe: false 추가
      setMessages((prev) => [...prev, msgObj]);    //{msg:'', url: '', time: '', isMe: true}
      setLoading(isLoading)
    });
    sc.on('userJoined', (userInfo) => {
      setJoinedUserList(userInfo.userList);
    })
    sc.on('participants', (p) => {
      setParticapants(p.participant);
    })
    sc.on('exit', (userInfos) => {
      setUserExited(userInfos.userId);
      setJoinedUserList(userInfos.userList);
      console.log("Exit userInfo" ,userInfos.userId);
      console.log("Exit joinedUserList" ,userInfos.userList);
    })

    return () => {
      sc.disconnect();
    };
  
  }, [])

  const setUName = (event:any) => {                  //✅사용자의 아이디 고객과 상담 채팅 구현
    event.preventDefault();
    setIsJoined(true); 
    setUserJoined(true)
    const {chattingRoomId} =  getValues()
    setRoomName(chattingRoomId)
    console.log(chattingRoomId)
    sc!.emit('joinRoom', { userName: userId, roomId: chattingRoomId } )
  }
  let fileUrl: string = '';
  const sendMessage = async (event:any) => {
    event.preventDefault();
    const {chattingRoomId} =  getValues()
    try {
      if (DraggedFile.length !== 0) {
        setLoading(true);
        const actualFile = DraggedFile[0]
        console.log(actualFile)
        const formBody = new FormData();
        formBody.append('file', actualFile)
        const { url: ImageUrl } = await ( 
          await fetch(`${BASE_PATH}/upload/`, {
            method: 'POST',
            body: formBody,
          })
           ).json()
        fileUrl = ImageUrl;
        
      }

     if (inputMessage.trim() !== '') {
       if(userId === ''){
         alert('로그인 또는 참가 닉네임을 설정하세요!')
         return new Error('닉네임 없음');
       } else {
      // 서버로 메시지 전송: 메세지 + 이미지를 같이 보낸다.
       let isMe = true;
       // 보낼때 id값으로 구분해주자! message. === useId ? 그렇지 않으면 반대 !  
       sc!.emit('message', [`${userId}:` + "  " + inputMessage, fileUrl, chattingRoomId, userId]); 
       setInputMessage('');
       fileUrl = String('');
       console.log("메세지가 있는 경우 fileUrl 값 확인:")
       setDragFile([]);
      }
       
     } else if(inputMessage.trim() === '') {
       if(userId === ''){
         alert('로그인 또는 참가 닉네임을 설정하세요!')
         return new Error('닉네임 없음');
       } else if (fileUrl !== ''){
        //⭐FE&BE에서 userId를 제거하고 '보낸 메세지를 바탕으로 컨텐츠' / '받는 메세지를 바탕으로 컨텐츠'  
        //⭐ 보낼때 isMe: true 추가
         sc!.emit('message', [`${userId}:`+ inputMessage, fileUrl, chattingRoomId, userId]); 
         setInputMessage('');
         setDragFile([]);
       }
     }
    } catch (e) {}
  };

  const handleOnCheck = (event:any) => {
    const isChecked = event.target.checked;
    setDarkAtom(isChecked)
  } 
  const onDrop = useCallback( (acceptedFiles:any) => {
  // 파일이 드롭됐을 때의 로직을 처리합니다.
    setDragFile(acceptedFiles)
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg'],
      'image/png': ['.png'],
      'video/mp4': ['.mp4', '.MP4'],
    }
  });
  
  const onExit = (e:any) => {
    e.preventDefault();
    console.log("joinedUserList", joinedUserList);
    const afterExitUsers = joinedUserList.filter((joinUser) => joinUser !== userId );
    console.log("afterExitUsers", afterExitUsers);
    sc!.emit("exit", {userId: userId, roomId: roomName });
    history.push("/");

  }
  return (
  <ChattingWrapper className=''>
    <Helmet>
      <title>Trader | A/S </title>       
    </Helmet>
    {/*w-2/4 mx-auto flex justify-center  bg-white p-6 rounded-md shadow-md */}
    <RoomContainer id="welcom" className="max-w-md mx-auto flex justify-center  bg-white p-6 rounded-md shadow-md">
      <label className="relative flex justify-between items-center group p-2 text-xl">
        <input
          type="checkbox" 
          className="toggle absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" 
          onChange={handleOnCheck}
        />
        <span className="flex-grow"></span> 
        <span className="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1"></span>
      </label>
      <form className=" flex flex-col " onSubmit={setUName}>
        <input
            {...register("chattingRoomId")}
            type="text"
            className='focus:border-pink-400 border-4 rounded-md shadow-md border-gray-300  px-4 py-2 outline-none'
            placeholder="room name"
          >
        </input>
        <input
          className='mt-2 focus:border-pink-400 border-4 rounded-md shadow-md border-gray-300  px-4 py-2 outline-none'
          type="text"
          value={userId}
          size={10}
        /> 
        <RoomBtnContainer>
          <button  className=" w-full mx-auto font-semibold mt-2 ml-2 bg-white p-2 shadow-md rounded-md" >Join</button>
          <button  onClick={onExit} className=" w-full mx-auto font-semibold mt-2 ml-2 bg-white p-2 shadow-md rounded-md" >Exit</button>
        </RoomBtnContainer>
      </form>
    </RoomContainer>
    {isJoined 
      ? 
    <ChatContainer className='mx-auto p-4 flex-1 flex flex-col items-center justify-center'>
      {/*w-2/4*/}
      <div className="rounded-lg w-2/4 bg-gray-300 shadow-lg text-white p-4">
        <h1 className="text-2xl text-left font-semibold">참가자</h1>
        {isUserJoined 
         ?
        <div className='bg-white p-2 shadow-lg rounded-md mb-2'>
          <ul>
            {joinedUserList && joinedUserList!.map((user, index) => (
              <span key={index} className="text text-black mb-2 font-semibold">{user}님 </span>
            ))}
          </ul>
        </div>    
      
        : null}
        <h1 className="text-2xl text-left font-semibold ">📢안내</h1>
        {isUserJoined
          ?
          <div className='bg-white p-2 shadow-lg rounded-md'>
            <ul>
              {joinedUserList && particapants!.map((userName, index) => (
                  <li key={index} className='text text-black font-semibold'>{userName}</li>
                ))}
            </ul>
              
          </div>
          : null
        }
        {userExited ? <p className=' text text-red-300'> {userExited}님이 퇴장하였습니다.</p> : null}
      </div>

        <ChatContent className='shadow-lg rounded-lg custom-scrollbar w-2/4 h-96 overflow-y-scroll overflow-x-scroll'>
          <h3 className='text-lg text-center mt-2 font-bold'>대화 내용</h3>
          {messages && messages.map((message, index ) => (
           message.myEmaiId === userId
            ? 
            (
            <MyMessageWrapper>
              <Mymessage key={index}>
                <div>
                  <p className='mr-4 ml-4 mt-4 bg-white p-2 shadow-md rounded-md' >{message.msg}</p>
                  <p className='text text-right text-sm mr-4' key={message.time}>{message.time}</p>
                </div>
                {(message.url.includes('.png') || message.url.includes('.jpg') || message.url.includes('.JPG') ) ? (
                  <img key={message.url} alt='사진' src={message.url} style={{ width: "300px"}} className=' ml-4 mt-1 rounded-md' />  
                ): null}
              </Mymessage>
              <RplayerWrapper>  
                {(message.url.includes('.mp4') || message.url.includes('.MP4') )? (
                    <ReactPlayer 
                      key={message.url}
                      className="player "
                      url={message.url}
                      width="80%"
                      height="30%"
                      controls={true}
                      playing={true}
                  />
                   
                  ) : null}
                  
              </RplayerWrapper>
            
            </MyMessageWrapper>
            )
            :
            (
            <PeerMessageWrapper>
              <PeerMessage key={index}>
                <div>
                  <p className='mr-4 ml-4 mt-4 bg-white p-2 shadow-md rounded-md' key={index}>{message.msg}</p>
                  <p className='text text-sm text-right' key={message.time}>{message.time}</p>
                </div>
                {(message.url.includes('.png') || message.url.includes('.jpg') || message.url.includes('.JPG') ) ? (
                  <img key={message.url} alt='사진' src={message.url} style={{ width: "300px"}} className=' ml-4 mt-1 rounded-md' />  
                ): null}
              </PeerMessage>
              <RplayerWrapper>  
                {(message.url.includes('.mp4') || message.url.includes('.MP4') )? (
                    <ReactPlayer 
                      key={message.url}
                      className="player "
                      url={message.url}
                      width="80%"
                      height="30%"
                      controls={true}
                      playing={true}
                      muted={true}
                      volume={0}
                      //autoPlay={false}
                  />
                  
                  ) : null}
                  
              </RplayerWrapper>
            </PeerMessageWrapper>
            )

        ))}
          
        </ChatContent>
 
      <UI className=' w-2/4'>
        <form onSubmit={sendMessage}>
          <div className='mt-1 mb-2 flex justify-center'>
            
          </div>
          {/*w-full border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300*/}
          <input  
            className='w-full  focus:border-pink-400 border-4 rounded-md shadow-md border-gray-300  px-4 py-2 outline-none'
            type="text"
            value={inputMessage}
            placeholder='Please enter a message'
            onChange={(e) => setInputMessage(e.target.value)}
          />
          
          <div 
           {...getRootProps()}
           className="flex items-center justify-center w-full  mt-2 ">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-50 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor"  strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, GIF  (MAX. 800x400px) or MP4</p>
              </div>
              
            </label>
            <input
              {...getInputProps()}
              type="file"
            />
              
          </div> 
         
        <button  className='text font-semibold min-w-full mx-auto mt-2 mb-4 bg-white p-6 rounded-md shadow-md hover:bg-gray-300 transition duration-500' >Send</button>
      </form>
      </UI>
    </ChatContainer>
      : null
    }
    {isLoading ? ( <Loading />) : null
    }
  
  </ChattingWrapper>
  
  )
} 









