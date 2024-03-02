import { atom } from "recoil";

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

