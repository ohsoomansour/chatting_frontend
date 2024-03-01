import { Helmet, HelmetProvider } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { Button } from "../components/Button";
import { BASE_PATH } from "./logIn";
import { FormError } from "../components/form-error";

interface ISignUpForMemberForm {
  email: string;
  password: string;
  address:string;
  name:string;
  mobilePhoneNumber:string;
  memberRole:string;
}
//📄https://react-hook-form.com/api/useform 제대로 이해 필요함 
export const SignUpForMember = () => {
  const {register, getValues, formState:{ errors },handleSubmit, formState,} = useForm<ISignUpForMemberForm>({mode: "onChange" });
  const history = useHistory();
  const onValid = async (data:ISignUpForMemberForm) => {
    try {
      const {email, password, name, address, mobilePhoneNumber, memberRole} = getValues();
      const result = await fetch(`${BASE_PATH}/member/join`, {
        headers : {"Content-Type":"application/json; charset=utf-8"},
        method: 'POST',
        body: JSON.stringify({
          userId: email,
          password: password,
          name: name,
          address: address,
          mobile_phone:mobilePhoneNumber,
          memberRole: memberRole,
        })
      })
      
      if(result.redirected){
        history.push('/login')
      }
    } catch(e) {
      console.error(e);
    }
    
  }
  
  return (//rem: 16px 배수 > 2.5rem = 40px     text-lime-600 hover:underline
  <div className="h-screen flex items-center flex-col mt-10 lg:mt-28"> 
   <HelmetProvider>
    <Helmet>
      <title>Trader | Sign up</title>
    </Helmet>
   </HelmetProvider>
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
           className="input mb-1 "
           type="email"
        />
        {errors.email?.type === "pattern" && (
          <FormError errorMessage="Please enter a valid email" />
        )}
        <input
          {...register("password", {required: "Password is required", minLength:10})} 
          type="password"
          placeholder="Password" 
          className="input"
        />
        {errors.password?.message && (
          <FormError errorMessage={errors.password.message}/>
        )}
        {errors.password?.type === "minLength" && (
          <FormError errorMessage="Password must be more than 10"/>
        )}
        <input
          {...register("name", {required: "Name is required", minLength:2})} 
          placeholder="Name" 
          className="input"
        />
        {errors.name?.message && (
          <FormError errorMessage={errors.name.message} />
        )}
        {errors.name?.type === 'minLength' && (
          <FormError errorMessage="Password must be more than 2"/>
        )}
         <input
          {...register("mobilePhoneNumber", {required: "mobile phone number is required", minLength:10})} 
          placeholder="Mobile phone number" 
          className="input"
        />
        {errors.mobilePhoneNumber?.message && (
          <FormError errorMessage={errors.mobilePhoneNumber.message}/>
        )}
        {errors.mobilePhoneNumber?.type === 'minLength' && (
          <FormError errorMessage={"mobile phone number must be more than 10!"}/>
        )}
        <input 
          {...register("address", {required: "Address is required", minLength:5} )}
          className="input"
          placeholder="Address"
        />
        {errors?.address?.message && (
            <FormError errorMessage={errors.address.message}/>
          )}
        {errors?.address?.type === 'minLength' && (
          <FormError errorMessage={"Address must be at least 5"}/>
        )}
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
        You already used Trader?{" "}
        <Link to="/login" className=" text-green-300 font-bold hover:underline"> Sign in </Link>
      </div>
    </div>        
  </div>
  )
}