/* #라우터
   1.package.json: "react-router-dom": "^5.3.0",
     > npm i react-router-dom@5.3.0
     > npm i --save-dev @types/react-router-dom  18.0.6
*/
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Streaming from "../pages/Streaming";
import React from "react";
import {ManageMembers} from "../pages/manageMembers";
import { EditUserInfo, IuserInfo } from "../pages/editUserInfo";
import { ActiveAccount } from "../components/activeAccount";
import { Home } from "../pages/home";
import { Header, MemberRole } from "../components/header";
import { SellerPage } from "../pages/sellerPage";
import { TradePlatform } from "../pages/TradePlatform";
import { OrderInfo } from "../pages/myorderInfo";
import { TakingOrderInfo } from "../pages/takeordersInfo";
import { StoredGoods } from "../pages/storedGoods";
import { useRecoilValue } from "recoil";
import { tokenState } from "../recoil/atom_token";
import { useQuery } from "react-query";
import { getMyinfo } from "../api";
import Login from "../pages/logIn";

const userRoutes = [
  {path: "/", component: <Home />},
  {path: "/login", component: <Login />},
  {path: "/member/privateInfo", component: <EditUserInfo />},
  {path: "/member/activate", component: <ActiveAccount /> },
  {path: "/order/info/", component: <OrderInfo /> },
  {path: "/order/takeorders", component: <TakingOrderInfo />},
  {path: "/order/getstoredgoods", component: <StoredGoods /> },
  {path: "/trade", component: <TradePlatform /> },
  {path: "/seller", component: <SellerPage /> },
  {path: "/cc", component: <Streaming />},
]

const adminRoutes = [
  {path: "/admin", component: <ManageMembers />}
]

export const LoggedInRouter = () => {
  const token = useRecoilValue(tokenState)
  const {data:me, isLoading} = useQuery<IuserInfo>(
    ["me", "Member"], () => getMyinfo(token)
  );


  return (
    <BrowserRouter>
    <React.StrictMode>
      {token ===  '' ? null : <Header />}
      <Switch>
      
      {me?.memberRole === MemberRole.admin ?  
        adminRoutes.map((route, index) => (
          <Route key={index} exact path={route.path} >
            {route.component}
          </Route>
        ))
        : null}

      {token === '' ? null : userRoutes.map((route, index) => (
        <Route key={index} exact path={route.path}>
                      
          {route.component }
        </Route>
      ))}

      </Switch>
    </React.StrictMode>  
    </BrowserRouter>
  )
}