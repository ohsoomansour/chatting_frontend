/*#Tailwind CSS
 > 설치:npm install -D tailwindcss 
 > Tailwind CSS IntelliSense는 tailwind.config.js 파일을 자동으로 찾아 온다 
 > tailwind css는 node 12버전 이상에서 가능 node -v v18.12.1
 > 빌드: "Start the Tailwind CLI build process" 
   - 설치: 
   npm install -D tailwindcss
npx tailwindcss init

    [package.json]
  "script":{
   "tailwind:build": "npx tailwindcss-cli@latest build -i src/styles/tailwind.css -o src/styles/styles.css --minify",
   "start":  "npm run tailwind:build & react-scripts start", 
  } 
  
 > postcss.config.js 설정: "tailwind를 일반 css파일로 빌드하기 위해 postcss config 파일이 필요"
 > npm install -D tailwindcss postcss autoprefixer 
 > [webpack 설정]
   *웹팩이란? "리액트에서 빌드를 수행할때 사용하는 소프트웨어"
   > 파일들간의 의존성 관계를 정리 코드를 최적화 하여 하나의 자바스크립트 파일(main.js)로 만들어줘야 한다. 
   이 파일은 페이지 라우팅이나 세션, 쿠키의 값에 따라 필요한 소스코드만을 다운받고 실행시킨다. 모든 소스코드를 한번에 실행시키지 않기 때문에 그 규모에 비해 실행 속도가 빠르다. 
    이처럼 웹팩을 사용해서 코드를 하나로 번들링하는 작업을 빌드
   > npm i -D webpack webpack-cli 
   > npm install -D tailwindcss postcss autoprefixer style-loader css-loader postcss-loader
  [에러] " Browserslist: caniuse-lite is outdated "
  > npx browserslist@latest --update-db
  > npm i update-browserslist-db

 #react-hook-form의 handleSubmit(onValid) 사용법 
  > This function will receive the form data if form validation is successful.
  > handleSubmit(async (data) => await fetchAPI(data))

*/
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { Button } from "../components/Button";
import {  Helmet, HelmetProvider } from "react-helmet-async";
import {  tokenState } from "../recoil/atom_token";
import { useRecoilState} from 'recoil';
import { FormError } from "../components/form-error";
import { userIdState } from "../recoil/atom_user";
import { useEffect, useState } from "react";

interface ILoginForm {
  email: string;
  password: string;
  resultError:string;
}   
export const BASE_PATH = process.env.NODE_ENV === "production" 
 ? "https://trade-2507d8197825.herokuapp.com"
 : "http://localhost:3000";


const Login:React.FC = () => {
//Validation is triggered on the changeevent for each input, leading to multiple re-renders. Warning: this often comes with a significant impact on performance.
  const { register, formState:{ errors },handleSubmit, formState, getValues } = useForm<ILoginForm>({mode: "onChange"});
  const [token, setToken] = useRecoilState(tokenState)
  const [user, setUserId] = useRecoilState(userIdState)
  const [pwErrorMsg, setPwErrorMsg] = useState("");
  const history = useHistory();

  const onInvalid = (data:any) => {
    //유효하지 않으면 실행 
    
    console.log(data, "onInvalid");
  }
  const onValid = async (data:ILoginForm) => {
    try { 
      
      console.log(data) //{email: 'admin@naver.com', password: 'admin@naver.com'}
            const {email, password} = getValues();
      const response =  await (
        await fetch(`${BASE_PATH}/member/login`, {
        headers : {"Content-Type":"application/json; charset=utf-8"},
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({
          userId: email, 
          password: password
        })
      })
      ).json();
      console.log("response:")
      console.log(response);
      /*
      if(!response.ok){
      🌝🌝⚡️🌺🌺🥝
      }*/
    
      setToken(response.token)
      setUserId(email);
      if(response.ok){
        if(user.isDormant === true ){
          window.location.href= '/member/activate';
        } else {
          window.location.href = "/";
        }
      } else {
        alert(response.error);
        window.location.href = "/login";
        //history.push("/login");  //handleSubmit은 새로고침을 하지 않고 history.push 또한 새로고침을 하지않음, 본 로그인 페이지가 당연히 뜨지 않음 
      }   
    } catch (e) {
      console.error(e);
    }
  }


  return (
    <div className="m-5">

    <HelmetProvider>
      <Helmet>
        <title>Trader | Login</title>
      </Helmet>
    </HelmetProvider>
      <h4 className="w-full font-medium text-left text-3xl mb-5">
        Welcom to Trade
      </h4>
      <form
        className="grid gap-2 w-full " 
        onSubmit={handleSubmit(onValid, onInvalid)}
      >
        <input
            {...register("email", {
              required: "Email is required",
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
            })}
            placeholder="Email"
            className="input mb-3 focus:border-pink-400"
            type="email"

          />
        {errors.email?.message && (
            <FormError errorMessage={errors.email.message} />
        )}
        {errors.email?.type === "pattern" && (
          <FormError errorMessage="Please enter a valid email" />
        )}
        
       <input
          {...register("password", {required: "Password is required", minLength:10})} 
          type="password"
          placeholder="Password" 
          className="input focus:border-pink-400"
        />
        {errors.password?.message && (
          <FormError errorMessage={errors.password.message}/>
        )}
        {errors.password?.type === "minLength" && (
          <FormError errorMessage="Password must be more than 10"/>
        )}
        {"" ? <FormError errorMessage={pwErrorMsg}/> : null}

        <Button 
          canClick={formState.isValid}
          actionText={"Log In"}
        />
      </form>
      <div>
      {token === '' ? <Link to="/create-account" className=" text-red-300 font-bold hover:underline "> Sign up for membership</Link> : null}      
        
      </div>
    </div>
  )
}

export default Login