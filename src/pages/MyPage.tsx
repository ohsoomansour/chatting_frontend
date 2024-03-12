import {  Link, Route, Switch, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { EditUserInfo } from "./editUserInfo";
import EditMyDeals from "./EditMydeals";
const Tab  = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => props.theme.bgColor};
  padding: 7px 0px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  color: ${(props) => props.isActive? props.theme.accentColor : props.theme.textColor}
  a{
    display: block; 
  }
`
const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 20px;
  gap: 10px;
`;

export const MyPage = () => {
  const privateInfoMatch = useRouteMatch("/myInfo/privateInfo"); 
  const myDealsMatch = useRouteMatch("/myInfo/myDeals");
  

  return (
    <div>
      <Tabs>
        <Tab isActive={privateInfoMatch !== null} >
          <Link to='/myInfo/privateInfo'>Private Info</Link>
        </Tab >
        <Tab isActive={myDealsMatch !== null}>
          <Link to='/myInfo/myDeals'>MyDeals</Link>
        </Tab>
      </Tabs>
      
      <Switch>
        <Route path='/myInfo/privateInfo'>
          <EditUserInfo />
        </Route>
        <Route path='/myInfo/myDeals'>
          <EditMyDeals />
        </Route>
      </Switch>

    </div>
  )
}