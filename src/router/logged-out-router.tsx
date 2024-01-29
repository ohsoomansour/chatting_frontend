import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "../pages/logIn";
import React from "react";
import { SignUpForMember } from "../pages/signUpForMember";

const logOutRoutes = [
  {path: "/login", component: <Login />},
  {path:"/create-account", component: <SignUpForMember /> },
]


export const LoggedOutRouter = () => {

  return (
    <BrowserRouter>
    <React.StrictMode>
      <Switch>
      {logOutRoutes.map((route, index) => (
          <Route key={index} exact path={route.path}>
            {route.component}
          </Route>
      ))}  

      </Switch>
    </React.StrictMode>  
    </BrowserRouter>
  )
}