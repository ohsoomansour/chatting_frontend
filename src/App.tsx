import { ThemeProvider } from 'styled-components';
import { LoggedInRouter } from './router/logged-in-router';
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from './recoil/atom_Theme';
import { darkTheme, lightTheme } from './theme.t';
import { LoggedOutRouter } from './router/logged-out-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';


   /*Q.컴포넌트가 랜더링될 때: DOM 리랜더링? 
      > React의 리랜더링 조건
      > Parent 컴포넌트가 리렌더링되면 자식 component는 리랜더링
  
  */ 


export default function App() {
  const isDark = useRecoilValue(isDarkAtom);
  const queryClent = new QueryClient();

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <QueryClientProvider client={queryClent}>
      <BrowserRouter>
        <LoggedInRouter />
        <LoggedOutRouter />
        
      </BrowserRouter> 
      </QueryClientProvider>
    </ThemeProvider>
  );
}

