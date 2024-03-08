/* #라우터
   1.package.json: "react-router-dom": "^5.3.0",
     > npm i react-router-dom@5.3.0
     > npm i --save-dev @types/react-router-dom  18.0.6
*/
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Streaming from "../pages/Streaming";
import React from "react";
import {ManageMembers} from "../pages/manageMembers";
import { EditUserInfo, IuserInfo } from "../pages/EditUserInfo";
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
import Chatting from "../pages/chatting";
import { Conference } from "../pages/conference";
import EditMyDeals from "../pages/EditMydeals";
import { MyPage } from "../pages/MyPage";

const userRoutes = [
  {path: "/", component: <Home />},
  {path: "/streaming", component: <Streaming /> },
  {path: "/member/activate", component: <ActiveAccount /> },
  {path: "/order/info/", component: <OrderInfo /> },
  {path: "/order/takeorders", component: <TakingOrderInfo />},
  {path: "/order/getstoredgoods", component: <StoredGoods /> },
  {path: "/trade", component: <TradePlatform /> },
  {path: "/seller", component: <SellerPage /> },
  {path: "/cc", component: <Chatting />},
]

const adminRoutes = [
  {path: "/admin", component: <ManageMembers />},
  {path: "/conference", component: <Conference />}
]

export const LoggedInRouter = () => {
  const token = useRecoilValue(tokenState)
  const {data:me, isLoading} = useQuery<IuserInfo>(
    ["me", "Member"], () => getMyinfo(token)
  );

  return (
    <div>
      <Header />
      <Switch>
      
      {me?.memberRole === MemberRole.admin ?  
        adminRoutes.map((route, index) => (
          <Route key={index} exact path={route.path} >
            {route.component}
          </Route>
        ))
        : null}

      { userRoutes.map((route, index) => (
        <Route key={index} exact path={route.path}>
          {route.component }
        </Route>
      ))}
        <Route path={'/myInfo'}>
          <MyPage/>
        </Route>
      </Switch>
     
    </div>  
  )
}