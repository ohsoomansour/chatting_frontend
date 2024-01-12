/* #라우터
   1.package.json: "react-router-dom": "^5.3.0",
     > npm i react-router-dom@5.3.0
     > npm i --save-dev @types/react-router-dom  18.0.6
*/
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Streaming from "../components/Streaming";
import { Login } from "../pages/logIn";
import { CreateAccount } from "../pages/createAccount";



const commonRoutes = [
  {path: "/login", component: <Login />},
  {path: "/streaming", component: <Streaming />},
  {path: "/create-account", comonent: <CreateAccount /> }
]

export const LoggedInRouter = () => {

  return (
    <BrowserRouter>
      <Switch>
      {commonRoutes.map((route, index) => (
          <Route key={route.path} exact path={route.path}>
            {route.component}
          </Route>
      ))}  
      </Switch>
    </BrowserRouter>
  )
}