import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "../pages/logIn";
import React from "react";
import { SignUpForMember } from "../pages/signUpForMember";
import { useRecoilValue } from "recoil";
import { tokenState } from "../recoil/atom_token";

const logOutRoutes = [
  {path: "/login", component: <Login />},
  {path:"/create-account", component: <SignUpForMember /> },
]


export const LoggedOutRouter = () => {
  const token = useRecoilValue(tokenState)
  return (
    
    <React.StrictMode>
      <Switch>
      {token ===  '' ? logOutRoutes.map((route, index) => (
          <Route key={index} exact path={route.path}>
            {route.component}
          </Route>
      )): null}  
      </Switch>
    </React.StrictMode>  
    
  )
}