import { useEffect, useRef, useState } from 'react';
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
import { Mymessage, PeerMessage, RoomContainer } from './conference';
import { useHistory } from 'react-router-dom';
import { useAnimation, motion } from 'framer-motion';

const ChattingWrapper=styled(motion.div)`
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
const ChatContainer = styled(motion.div)``;

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
`;
const PeerMessageWrapper = styled.div`
  display: flex;
  flex-direction:column;
`;
const MyImg = styled.div`
  display: flex;
  flex-direction: row-reverse;
  
`;
const PeerImg = styled.div`
  display: flex;
  flex-direction: row;
  
`;


const RoomBtnContainer = styled.div`
  display:flex;
  flex-direction:row;
`;



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
interface IUserExited{
  userId:string;
  time:string;
}
interface IParticapant{
  participant:string;
  time:string;
}

//"wss://trade-2507d8197825.herokuapp.com:8080/(네임스페이스)"  
//git add  -> git commit -m 
export const WS_BASE_PATH = process.env.NODE_ENV === "production" 
//wss:// 스킴은 기본적으로 443 포트를 사용하므로 포트를 지정할 필요가 없습니다.
 ? `wss://trade-2507d8197825.herokuapp.com`    //12.24일, 11:25`wss://trade.herokuapp.com`
 : "http://localhost:8080";


export default function Chatting() {
  const userId = useRecoilValue(userIdState);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const [roomName, setRoomName] = useState('');
  const [joinedUserList, setJoinedUserList] = useState<string[]>(['']);
  const [particapants, setParticapants] = useState<IParticapant>();
  const [userExited, setUserExited ] = useState<IUserExited>();
  const {register, getValues} = useForm({mode: "onChange"})
  const [sc, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<IProps[]>([{msg:'', url: '', time: '',  myEmaiId: ""}]); //[{msg:'', url: '', time: '',  myEmaiId: ""}]
  const [inputMessage, setInputMessage] = useState('');
  const [DraggedFile, setDragFile] = useState([])
  const [isLoading, setLoading] = useState(false);
  const [isUserJoined, setUserJoined] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const history = useHistory();
  
  // 메시지가 업데이트될 때마다 스크롤을 가장 아래로 이동

  useEffect(() => {
    // ✅https://socket.io/docs/v4/client-options/ 참조
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
      //⭐ msgObj:{msg:'', url: '', time: '', isMe: true}
      setMessages((prev) => [...prev, msgObj]);
      setLoading(isLoading);
    });
    sc.on('userJoined', (userInfo) => {
      setJoinedUserList(userInfo.userList);
    })
    sc.on('participants', (p) => {
      setParticapants(p);
    })
    sc.on('exit', (userInfos) => {
      setUserExited({
        userId:userInfos.userId,
        time:userInfos.time
      });
      setJoinedUserList(userInfos.userList);
    })

    return () => {
      sc.disconnect();
    };
  
  }, [])
  const chatViewAnimation = useAnimation();
  const [joining, setJoining] = useState(false);
  const [init, setInit] = useState(true)
 
  const onJoining = (event:any) => {     
    event.preventDefault();
    //아이디가 없을 경우의 validation 적시 
    if(userId === ''){
      alert('로그인이 필요합니다!💛');
      return;
    }
    if(joining){
      chatViewAnimation.start({
        height:0,
        transition:{duration: 0.5 }
      })
    } else {
      chatViewAnimation.start({
        height:280,
        transition:{duration: 0.5 }
      })
    }
    const {chattingRoomId} =  getValues();
    if(init){
      setIsJoined(true); 
      setUserJoined(true)
      setRoomName(chattingRoomId);
      setInit(false);
      sc!.emit('joinRoom', { userName: userId, roomId: chattingRoomId} )
    } else if(!init){
      //이전 방에서 다른 방으로 변경하는 경우, 초기 랜더링 -> 감지 true -> 그 후 false  
      if(roomName  !== chattingRoomId){
        alert(`현재 room name:${roomName}에서 채팅방 나가기(Exit) 버튼을 누르고 참여 해주세요!💛`)
        return;
      }
      setIsJoined(true); 
      setUserJoined(true);
      setRoomName(chattingRoomId);
      sc!.emit('joinRoom', { userName: userId, roomId: chattingRoomId } )
    }
  }

  let fileUrl: string = '';
  const sendMessage = async (event:any) => {
    event.preventDefault();
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
         alert('로그인 또는 참가 닉네임을 설정하세요!💛');
         return new Error('닉네임 없음');
       } else {
       // 보낼때 id값으로 구분해주자!
       sc!.emit('message', [inputMessage, fileUrl, roomName, userId]); 
       setInputMessage('');
       fileUrl = String('');
       setDragFile([]);
      }
       
     } else if(inputMessage.trim() === '') {
       if(userId === ''){
         alert('로그인 또는 참가 닉네임을 설정하세요!💛');
         return new Error('닉네임 없음');
       } else if (fileUrl !== ''){

         sc!.emit('message', [inputMessage, fileUrl, roomName, userId]); 
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
    setJoinedUserList(afterExitUsers);
    
    sc!.emit("exit", {userId: userId, roomId: roomName });
    history.push("/");

  }

  // 스크롤 위치를 참조할 수 있는 함수
  const chatContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if(chatContentRef.current){
      chatContentRef.current.scrollTop  = chatContentRef.current.scrollHeight ;
    }
  }, [messages])
  return (
  <ChattingWrapper 
    className=' p-2'

  >
    <Helmet>
      <title>Trader | A/S </title>       
    </Helmet>

    <RoomContainer 
      id="welcom" 
      className="max-w-md mx-auto flex justify-center  bg-white p-6 rounded-md shadow-lg "
      animate={chatViewAnimation}
      transition={{ type: "tween"}}
    >
      <label className="relative flex justify-between items-center group p-2 text-xl">
        <input
          type="checkbox" 
          className="toggle absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" 
          onChange={handleOnCheck}
        />
        <span className="flex-grow"></span> 
        <span className="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1"></span>
      </label>
      <form className=" flex flex-col " onSubmit={onJoining}>
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
      <div className="rounded-lg w-2/4 bg-gray-300 shadow-lg text-white p-4">
        <h1 className="text-2xl text-left font-semibold">🙇‍♀️ 참가자</h1>
        {isUserJoined 
         ?
        <div className='bg-white p-3 shadow-lg rounded-md mb-2'>
          <ul>
            {joinedUserList && joinedUserList!.map((user, index) => (
              <span key={index} className="text text-black mb-2 ">{user}님 </span>
            ))}
          </ul>
        </div>    
      
        : null}
        <h1 className="text-2xl text-left font-semibold ">📢 안내</h1>
        {isUserJoined
          ?
          <div className='bg-white p-3 shadow-lg rounded-md'>
            <ul>
              {joinedUserList && 
                <li className='text text-black '>{particapants?.participant} <span className=' text-xs'>{particapants?.time}</span></li>
               }
            </ul>
              
          </div>
          : null
        }
        {userExited ? <p className=' text text-red-300'> {userExited.userId}님이 퇴장하였습니다. <span className=' text-sm'>{userExited.time}</span></p> : null}
      </div>

        <ChatContent ref={chatContentRef} className='shadow-lg rounded-lg custom-scrollbar w-2/4 h-96 overflow-y-scroll overflow-x-scroll'>
          <h3 className='text-lg text-center mt-2 font-bold'>대화 내용</h3>
          {messages && messages.map((message, index ) => (
           message.myEmaiId === userId
            ? 
            (
            <MyMessageWrapper >
              <Mymessage key={index} className=' mr-1'>
                <div>
                  <p className='mt-4 ' >{message.myEmaiId}</p>
                  {message.msg !== '' ? <p className=' bg-white p-2 shadow-lg rounded-md' >{message.msg}</p>
                  : null}      
                  <MyImg>
                  {(message.url.includes('.png') || message.url.includes('.jpg') || message.url.includes('.JPG') ) ? (
                    <img key={message.url} alt='사진' src={message.url} style={{ width: "300px"}} className=' mt-1 rounded-md' />  
                    ): null}
                  </MyImg>
                  
                </div>  
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
                      volume={0}
                  />
                  ) : null}
              </RplayerWrapper>
              {message.time !== ''? <p className='text text-right text-xs mr-4' key={message.time}>{message.time}</p> : null}
            </MyMessageWrapper>
            )
            :
            (
            <PeerMessageWrapper>
              <PeerMessage key={index} className='ml-1'>
                <div>
                  <p className='mt-4' >{message.myEmaiId}</p>
                  {message.msg !== '' ? <p className=' bg-white p-2 shadow-lg rounded-md' >{message.msg}</p> : null }
                  <PeerImg>
                    {(message.url.includes('.png') || message.url.includes('.jpg') || message.url.includes('.JPG') ) ? (
                      <img key={message.url} alt='사진' src={message.url} style={{ width: "300px"}} className='mt-1 rounded-md' />  
                    ): null}
                  </PeerImg>
                  {message.msg !== ''? <p className='text-right text-sm ml-1' key={message.time}>{message.time}</p> : null}
                </div>
              </PeerMessage>

              {(message.url.includes('.mp4') || message.url.includes('.MP4') )? (
                <div>
                  <RplayerWrapper>  
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
                    />
                </RplayerWrapper>
              <p className='text-right mr-16  text-sm ml-1' key={message.time}>{message.time}</p>
              </div>
              ) : null}
            </PeerMessageWrapper>
            )
        ))}
          
        </ChatContent>
 
      <UI className=' w-2/4'>
        <form onSubmit={sendMessage}>
          <div className='mt-1 mb-2 flex justify-center'>
          </div>
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
