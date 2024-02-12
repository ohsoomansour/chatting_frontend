/* #라우터
   1.package.json: "react-router-dom": "^5.3.0",
     > npm i react-router-dom@5.3.0
     > npm i --save-dev @types/react-router-dom  18.0.6
*/
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Streaming from "../components/Streaming";
import React from "react";
import {ManageMembers} from "../pages/manageMembers";
import { EditUserInfo } from "../pages/editUserInfo";
import { ActiveAccount } from "../components/activeAccount";
import { Home } from "../pages/home";
import { Header } from "../components/header";
import { SellerPage } from "../pages/sellerPage";
import { TradePlatform } from "../components/TradePlatform";
import { OrderInfo } from "../pages/orderInfo";

const tradeRoutes = [
  {path: "/trade", component: <TradePlatform /> },
  {path: "/seller", component: <SellerPage /> }
]

const userRoutes = [
  {path: "/", component: <Home />},
  {path: "/member/privateInfo", component: <EditUserInfo />},
  {path: "/member/activate", component: <ActiveAccount /> },
  {path: "/order/info/:orderId", component: <OrderInfo /> }
]

const accountRoutes = [
  {path: "/cc", component: <Streaming />},
]
const adminRoutes = [
  {path: "/admin", component: <ManageMembers />}
]

export const LoggedInRouter = () => {

  return (
    <BrowserRouter>
    <React.StrictMode>
      <Header />
      <Switch>

      {accountRoutes.map((route, index) => (
          <Route key={index} exact path={route.path}>
            {route.component  }
          </Route>
      ))}  
      {adminRoutes.map((route, index) => (
          <Route key={index} exact path={route.path} >
            {route.component}
          </Route>
      ))}
      {userRoutes.map((route, index) => (
        <Route key={index} exact path={route.path}>          
          {route.component }
        </Route>
      ))}
      {tradeRoutes.map((route, index) => (
        <Route key={index} exact path={route.path}>
          {route.component}
        </Route>
      ))}
      </Switch>
    </React.StrictMode>  
    </BrowserRouter>
  )
}