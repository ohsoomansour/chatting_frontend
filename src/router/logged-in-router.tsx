/* #라우터
   1.package.json: "react-router-dom": "^5.3.0",
     > npm i react-router-dom@5.3.0
     > npm i --save-dev @types/react-router-dom  18.0.6
*/
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Streaming from "../components/Streaming";
import { Login } from "../pages/logIn";
import React from "react";
import { SignUpForMember } from "../pages/signUpForMember";




const commonRoutes = [
  {path: "/login", component: <Login />},
  {path:"/create-account", component: <SignUpForMember /> },
  
]

const accountRoutes = [
  {path: "/streaming", component: <Streaming />},
]

export const LoggedInRouter = () => {

  return (
    <BrowserRouter>
    <React.StrictMode>
      <Switch>
      {commonRoutes.map((route, index) => (
          <Route key={index} exact path={route.path}>
            {route.component}
          </Route>
      ))}  
      {accountRoutes.map((route, index) => (
          <Route key={index} exact path={route.path}>
            {route.component}
          </Route>
      ))}  
      
      </Switch>
    </React.StrictMode>  
    </BrowserRouter>
  )
}