/* #라우터
   1.package.json: "react-router-dom": "^5.3.0",
     > npm i react-router-dom@5.3.0
     > npm i --save-dev @types/react-router-dom  18.0.6
*/
import { Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";
import {ManageMembers} from "../pages/manageMembers";
import {IuserInfo } from "../pages/editUserInfo";
import { ActiveAccount } from "../components/activeAccount";
import { Home } from "../pages/home";
import { Header, MemberRole } from "../components/header";
import { SellerPage } from "../pages/sellerPage";
import { RobotTrade } from "../pages/RobotTrade";
import { OrderInfo } from "../pages/myorderInfo";
import { TakingOrderInfo } from "../pages/takeordersInfo";
import { StoredGoods } from "../pages/storedGoods";
import { useRecoilValue } from "recoil";
import { tokenState } from "../recoil/atom_token";
import { useQuery } from "react-query";
import { getMyinfo } from "../api";
import Chatting from "../pages/chatting";
import { Conference } from "../pages/conference";
import { MyPage } from "../pages/MyPage";


const userRoutes = [
  {path: "/", component: <Home />},
  {path: "/conference", component: <Conference />},
  {path: "/member/activate", component: <ActiveAccount /> },
  {path: "/order/info/", component: <OrderInfo /> },
  {path: "/order/takeorders", component: <TakingOrderInfo />},
  {path: "/order/getstoredgoods", component: <StoredGoods /> },
  {path: "/trade", component: <RobotTrade /> },
  {path: "/seller", component: <SellerPage /> },
  {path: "/cc", component: <Chatting />},
]

const adminRoutes = [
  {path: "/admin", component: <ManageMembers />},
  
]

export const LoggedInRouter = () => {
  const token = useRecoilValue(tokenState)
  const {data:me} = useQuery<IuserInfo>(
    ["me", "Member"], () => getMyinfo(token)
  );
  const [isLoading, setLoading] = useState(true)
  useEffect(()=> {
    setLoading(false)
  }, []);
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