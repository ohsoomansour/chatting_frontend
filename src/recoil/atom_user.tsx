import { atom } from 'recoil';
import { recoilPersist } from "recoil-persist";

//@description: recoil값 -> session에서  
export const { persistAtom } = recoilPersist({
  key: "UserId",
  storage: sessionStorage,
});

export const userIdState = atom({
  key: 'UserId',
  default:'',
  effects_UNSTABLE: [persistAtom],
})