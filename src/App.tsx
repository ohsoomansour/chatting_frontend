
import Conference from './components/Conference';
export default function App() {
  
  
   /*Q.컴포넌트가 랜더링될 때: DOM 리랜더링? 
      > React의 리랜더링 조건
      > Parent 컴포넌트가 리렌더링되면 자식 component는 리랜더링

    [문제]
    eact component life-cycle 
    
  */ 
  return (
    <div className="App">
      <Conference  />
    </div>
  );
}

