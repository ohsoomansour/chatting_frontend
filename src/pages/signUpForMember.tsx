import { Helmet } from "react-helmet";
import { Controller, useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { Button } from "../components/Button";

interface ISignUpForMemberForm {
  email: string;
  password: string;
  address:string;
  name:string;
  memberRole:string;
}
//📄https://react-hook-form.com/api/useform 제대로 이해해야 로직이 이해가 감 
export const SignUpForMember = () => {
  const {register, getValues, formState:{ errors },handleSubmit, formState,} = useForm<ISignUpForMemberForm>({mode: "onChange" });
  const history = useHistory()
  const onValid = async (data:ISignUpForMemberForm) => {
    try {
      const {email, password, name, address, memberRole} = getValues();
      const result = await fetch('http://localhost:3000/member/join', {
        headers : {"Content-Type":"application/json; charset=utf-8"},
        method: 'POST',
        body: JSON.stringify({
          userId: email,
          password: password,
          name: name,
          address: address,
          memberRole: memberRole,
        })
      })
      
      if(result.redirected){
        history.push('/')
      }
    } catch(e) {
      console.error(e);
    }
    
  }
  
  return (//rem: 16px 배수 > 2.5rem = 40px     text-lime-600 hover:underline
  <div className="h-screen flex items-center flex-col mt-10 lg:mt-28"> 
    <Helmet>
      <title>Sign Up For Member | GGL Entertainment</title>
    </Helmet>
    <div className=" w-full max-w-screen-sm flex flex-col px-5 items-center">
      <h4 className="w-full font-medium text-left text-3xl mb-5">
        Let's get started 
      </h4>
      <form 
        className="grid gap-2 mt-5 w-full mb-3" 
        onSubmit={handleSubmit(onValid)}
      > 
        <input
          {...register("email", {
            required: "Email is required",
            pattern:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/  
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
        <input
          {...register("name", {required: "Name is required"})} 
          placeholder="Name" 
          className="input"
        />
        <input 
          {...register("address", {required: "Address is required"} )}
          className="input"
          placeholder="Address"
        />

        <select {...register("memberRole", {required: "memberRole is required"} )} className=" input mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300">
          <option value="client">client</option>
          <option value="admin">admin</option>
        </select>
        <Button
          canClick={formState.isValid}
          actionText={"Create!"}
        />
      </form>
      <div>
        You already used GGL Entertainment?{" "}
        <Link to="/login" className=" text-green-300 font-bold hover:underline"> Sign in </Link>
      </div>
    </div>        
  </div>
  )
}