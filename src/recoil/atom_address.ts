import { atom } from "recoil";

export const sellerAddress = atom({
  key: "sellerAdderess",
  default:""
})

export const buyerAddress = atom({
  key: "buyerAddres",
  default:""
})

export const storedGoodsAddress = atom({
  key: "buyerStoringGoods",
  default:""
})