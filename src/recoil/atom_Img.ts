import { atom } from "recoil";
import { IProdimg } from "../components/uploadimg/ProductImg";

export const compaImgState = atom({
  key: 'coImg',
  default: ""
});

/*
    idx: number;
    path: string
    lastModified: number
    lastModifiedDate: number;
    name: string;
    size: number
    type: string;
    webkitRelativePath: string;
    preview: string;
}  

*/

export const productImgState = atom<IProdimg[]>({
  key: 'prodImg',
  default: [],
})