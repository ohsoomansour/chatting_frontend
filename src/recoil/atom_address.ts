import { atom } from "recoil";
//판매 등록 창에서 주소
export const sellerAddress = atom({
  key: "sellerAdderess",
  default:""
})
export const sellerPostal = atom({
  key:"s_postal",
  default:""
})
export const sellerRoad = atom({
  key:"s_road",
  default:""
})

//구매 창에서 주소
export const buyerAddress = atom({
  key: "buyerAddres",
  default:""
})
export const buyerPostal = atom({
  key:"b_postal",
  default:""
})
export const buyerRoad = atom({
  key:"b_road",
  default:""
})
export const buyerDetail = atom({
  key:"b_detail",
  default:""
})

//미리 담기에서 주소 
export const storedGoodsAddress = atom({
  key: "buyerStoringGoodsFull",
  default:""
})
export const storedGoodsPostal = atom({
  key: "buyerStoringGoodsPostal",
  default:""
})
export const storedGoodsRoad = atom({
  key: "buyerStoringRoadRoad",
  default:""
})

export const storedGoddsDetailed = atom({
  key: "buyerStoringDetailed",
  default:""
})

