import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useSetRecoilState } from "recoil";
import { compaImgState } from "../../recoil/atom_Img";
 /** 
   주제  #usesDropzone 의 이해
   @param acceptedFiles 매개 변수를 통해 사용자가 업로드할 수 있는 파일들의 배열(사진1, 사진2, ...)을 받는다.  
   @explain1 onDrop 이벤트 핸들러는 파일을 드롭 존에 드래그하여 놓을 때 호출 
   @explain2 드롭 하지 않을 경우 onDrop 함수를 호출하지 않기 때문에 onDrop 함수를 생성하지 않는다. 즉, 다음 리랜덩 시 불필요한 함수 재생성을 막는다.
             따라서, acceptedFiles의 값들은 그대로  
             useUpload에서 개별 적으로 올리면 개별만 

   <img src="blob:http://localhost:3001/cd62146c-38c7-4a1a-904d-f9336f6fc96c" />
  */


 /** 
   @주제  #usesDropzone 의 이해
   @param acceptedFiles 매개 변수를 통해 사용자가 업로드할 수 있는 파일들의 배열(사진1, 사진2, ...)을 받는다.  
   @explain1 onDrop 이벤트 핸들러는 파일을 드롭 존에 드래그하여 놓을 때 호출 
   @explain2 드롭 하지 않을 경우 onDrop 함수를 호출하지 않기 때문에 onDrop 함수를 생성하지 않는다. 즉, 다음 리랜덩 시 불필요한 함수 재생성을 막는다.
             따라서, acceptedFiles의 값들은 그대로  
   useUpload에서 개별 적으로 올리면 개별만 
  */

export const CompaImg = () => {
  
 const setCompaImgState = useSetRecoilState(compaImgState)
 const onDrop = useCallback((acceptedFiles:any) => {
  console.log("companyAcceptedFile", acceptedFiles);
  setCompaImgState(acceptedFiles);
 }, [])

 const { getRootProps, getInputProps } = useDropzone({
   onDrop, //이벤트 핸들러 
   accept: {
     'image/jpeg': ['.jpeg'],
     'image/png': ['.png'],
   }
 });

  return (
    <div 
      {...getRootProps()}
      className=" h-max w-1/4 flex mt-2 mr-4  mb-6 p-2 ">
      <label htmlFor="dropzone-file" className=" py-16 flex flex-col items-center justify-center w-full h-full  border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100 ">
        <div className="flex flex-col items-center justify-center pt-5 pb-6 max-h-full">
          <svg className="w-10 h-10 text-gray-500 dark:text-gray-400 mb-4" fill="gray" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
            <path d="M48 0C21.5 0 0 21.5 0 48V464c0 26.5 21.5 48 48 48h96V432c0-26.5 21.5-48 48-48s48 21.5 48 48v80h96c15.1 0 28.5-6.9 37.3-17.8C340.4 462.2 320 417.5 320 368c0-54.7 24.9-103.5 64-135.8V48c0-26.5-21.5-48-48-48H48zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V240zM80 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V112zM272 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16zM640 368a144 144 0 1 0 -288 0 144 144 0 1 0 288 0zm-76.7-43.3c6.2 6.2 6.2 16.4 0 22.6l-72 72c-6.2 6.2-16.4 6.2-22.6 0l-40-40c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L480 385.4l60.7-60.7c6.2-6.2 16.4-6.2 22.6 0z"/>
          </svg>
          <p className="text-center mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload or drag</span>  and drop your company logo
          </p>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400"> PNG, JPG, GIF  (MAX. 800x400px)</p>
        </div>
        
      </label>
      <input
        {...getInputProps()}
        type="file"
      />
    </div>
  )
}