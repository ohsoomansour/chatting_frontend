import { ThemeProvider } from 'styled-components';
import { LoggedInRouter } from './router/logged-in-router';
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from './recoil/atom_Theme';
import { darkTheme, lightTheme } from './theme.t';
import { LoggedOutRouter } from './router/logged-out-router';



   /*Q.컴포넌트가 랜더링될 때: DOM 리랜더링? 
      > React의 리랜더링 조건
      > Parent 컴포넌트가 리렌더링되면 자식 component는 리랜더링
   

      


  */ 


export default function App() {
  const isDark = useRecoilValue(isDarkAtom);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      
      <LoggedInRouter />
      <LoggedOutRouter />

      
    </ThemeProvider>
  );
}

