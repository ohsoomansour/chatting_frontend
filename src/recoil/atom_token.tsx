import { atom, selector } from 'recoil';
import { recoilPersist } from "recoil-persist";
//여러 컴포넌트에서 같은 atom을 구독할 수 있다.
/*#문제:manageMember.tsx에서 기본값 ''은 받아온다 그런데 Login 컴포넌트에서 변경한 token 값은 못 받아온다! 
  > login.tsx에서는 변경된 recoil값을 확인 가능함
  > manageMember.tsx, re-rendering 후 tokenState의 token값은 '' 되어 로그인에서 반환한 token값을 못 받아온다.
  > 해결: recoilPersist를 사용, localStorage에 넣어주고 받아온다. 
    (sessionStorage도 가능하나 브라우저를 닫거나 변경하면 없어진다. )
    storage: localStorage,
*/
const sessionStorage = 
      typeof window !== 'undefined' ? window.sessionStorage : undefined
export const { persistAtom } = recoilPersist({
  key: "tk",
  storage: sessionStorage,

});

export const tokenState = atom({
  key: 'token',
  default: '11',
  effects_UNSTABLE: [persistAtom],
});


/*@explain: 현재 이 app에서 사용하고 있지 않고 필요 예상되어 '학습'*/
export const TokenSelector = selector({
  key: 'Tselector',
  get: ({ get }) => {
    const result = get(tokenState);
    console.log('TokenSelector_selector:');
    console.log(result); // '' 또는 변경된 token값
    return get(tokenState)
  },

  set: ({get, set}, newValue) => {
    //#첫 번째 파라미터에서 getter, setter를 받고 두 번째 파라미터에서 우리가 보내는 새로운 값
    const result = get(tokenState);
    set(tokenState, newValue)
    
  }
})
