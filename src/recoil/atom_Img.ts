import { atom } from "recoil";
import { IProdimg } from "../components/uploadimg/ProductImg";

export const compaImgState = atom({
  key: 'coImg',
  default: ""
});


export const productImgState = atom<IProdimg[]>({
  key: 'prodImg',
  default: [],
})

export const productImgToUpdateState = atom<File[]>({
 key: 'prodImgToUpdat',
 default: [] 
})