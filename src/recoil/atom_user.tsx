import { atom } from 'recoil';
import { recoilPersist } from "recoil-persist";

export const { persistAtom } = recoilPersist({
  key: "UserId",
  storage: sessionStorage,
});

export const userIdState = atom({
  key: 'UserId',
  default:'',
  effects_UNSTABLE: [persistAtom],
})