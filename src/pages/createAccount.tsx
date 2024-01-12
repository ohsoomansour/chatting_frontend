import {  gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
//import logo from "../images/logo.svg";  <img src={logo} className=" w-52 mb-5" alt="Nuber-eats" />
import Helmet from "react-helmet";
import { Link, useHistory } from "react-router-dom";

/*#️⃣15.13 Create Account Mutation part Two 
  1. useMutation Hook:  
   🔹status: 📄https://www.apollographql.com/docs/react/data/mutations/#tracking-mutation-status
   🔹onCompleted:📄https://www.apollographql.com/docs/react/api/react/hooks/#options-2 
    - 간략
    - callback function: (data) => void; 
  2.계성 생성(샘플1)
   emai: ohsoomansour@naver.com
   password: 284823  
   role:Client

  3. 용어정리 
   🔹GraphQL SDL(Schema Definition Language)
     예시) type Person {
             name: String!
             age: Int!
            }
   🔹transpile vs compile 
     - 📄https://ideveloper2.tistory.com/166
     - transpile: 비슷한 수준의 추상화 예) es6 > es5 , ts > JS
     - 한 언어로 작성된 소스 코드를 다른 언어로 변환하는 것

    🔹tsconfig.js - include등 블로그 참조 📄https://kay0426.tistory.com/69
     */ 
const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      error
      ok
    }
  }
`

interface ICreateAccountForm {
  email: string;
  password: string;
  address:string;
}

export const CreateAccount= () => {
  const {register,
    getValues,
    formState:{ errors },
    handleSubmit,
    formState,
  } = useForm<ICreateAccountForm>({
    mode: "onChange", //📄https://react-hook-form.com/api/useform 제대로 이해해야 로직이 이해가 감 
    defaultValues: {
      //role: UserRole.Client
    }
  });
  const history = useHistory()

  /*
  const [createAccount, {loading, data:createAccountMutationResult}] = useMutation<
    CreateAccountMutation,
    CreateAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted
  })
  */




  //rem: 16px 배수 > 2.5rem = 40px
  return (
  <div className="h-screen flex items-center flex-col mt-10 lg:mt-28"> 
    <Helmet>
      <title>Create an Account | Nuber Eats </title>
    </Helmet>
    <div className=" w-full max-w-screen-sm flex flex-col px-5 items-center">
      
      <h4 className="w-full font-medium text-left text-3xl mb-5">
        Let's get started 
      </h4>
      <form 
        className="grid gap-2 mt-5 w-full mb-3 " 
        //onSubmit={handleSubmit(onValid)}
      > 
        <input
          {...register("email", {
            required: "Email is required",
            pattern:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/  
          })}
           placeholder="Email"
           className="input mb-3 "
           type="email"

        />

        <input
          {...register("password", {required: "Password is required"})} 
          placeholder="Password" 
          className="input"
        />
        <input 
          {...register("address", {required: "Address is required"} )}
          className="input"
          placeholder="Address"
        />
        

      </form>
      <div>
        Already use Uber?{" "}
        <Link to="/" className=" text-lime-600 hover:underline"> Sign in </Link>
      </div>
    </div>        
  </div>
  )
}