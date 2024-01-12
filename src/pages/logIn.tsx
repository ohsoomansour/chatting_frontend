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

*/
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";

interface ILoginForm {
  email: string;
  password: string;
  resultError:string;
}   
export const Login = () => {
//Validation is triggered on the changeevent for each input, leading to multiple re-renders. Warning: this often comes with a significant impact on performance.
  const { register, formState:{ errors },handleSubmit, formState, getValues } = useForm<ILoginForm>({mode: "onChange"});
  return (
    <div>
      <h4 className="w-full font-medium text-left text-3xl mb-5">
        Welcom to The Streaming
      </h4>
      <form
        className="grid gap-2 mt-5 w-full mb-3 " 
        //onSubmit={handleSubmit(onValid)}
      >
        <input
            {...register("email", {
              required: "Email is required",
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
            })}
            placeholder="Email"
            className="input mb-3 "
            type="email"

          />
       <input
          {...register("password", {required: "Password is required"})} 
          type="password"
          placeholder="Password" 
          className="input"
        />
        <Button 
          canClick={formState.isValid}
        />
      </form>
      <div>
        New to Streaming?{""}      
        <Link to="/create-account" className="text-blue-600 hover:underline "> Create an Account</Link>
      </div>
    </div>
  )
}