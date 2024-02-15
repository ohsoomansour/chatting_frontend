import React,{useState} from "react";
import DaumPostcode from "react-daum-postcode";
import Modal from "react-modal";
import styled from "styled-components";
import { buyerAddress } from "../../recoil/atom_address";
import { useSetRecoilState } from "recoil";

const CloseSVG = styled.svg`
    position: absolute;
    top:0;
    right:0;
    padding: 3.9px;
    width:29px;
    height:28px;
    fill: #b2bec3;
    transition: fill 0.3s ease-in-out;
    &:hover {
    fill: #d10849;
    }
`;
const SearchSvgContainer = styled.span`
    display: inline-block;
    width:32px;
    height:30px;
    margin-top:5px;
`

const SearchSVG = styled.svg`
    width: 20px;
    height: 20px;
    fill: black;
    transition: fill 0.3s ease-in-out;
    &:hover {
        fill: #d10849;
    }
`
const FullAddress = styled.div`
    display:flex;
`
const BuyerPostcode: React.FC = () =>{
    const [zipCode, setZipcode] = useState<string>("");
    const [roadAddress, setRoadAddress] = useState<string>("");
    const [detailAddress, setDetailAddress] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false); 
    const setFullAddress = useSetRecoilState(buyerAddress);
    
    // Modal 스타일
    const customStyles = {
        overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
        },
        content: {
            left: "0",
            margin: "auto",
            width: "500px",
            height: "500px",
            padding: "0",
            overflow: "hidden",
        },
    };
    
    // 검색 클릭
    const toggle = () =>{
        setIsOpen(!isOpen);
    }
    
    const completeHandler = (data:any) =>{
        setZipcode(data.zonecode);
        setRoadAddress(data.roadAddress);
        setIsOpen(false);
    }
    // 상세 주소검색 event
    const changeHandler = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setDetailAddress(e.target.value);
        setFullAddress(zipCode + " " + roadAddress +" "+ e.target.value)
    }
    const onClose = () =>  {
        setIsOpen((prev) => !prev)
    }
    return(
        <div className=" mt-2">
            <input className="border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-blue-300" value={zipCode} readOnly placeholder="POSTAL CODE" />
            <SearchSvgContainer onClick={toggle}>
                <SearchSVG
                    onClick={toggle}
                    className=" mt-4 ml-2 cursor-pointer"
                    viewBox="0 0 512 512"
                >
                    <path 
                        d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"
                    />
                </SearchSVG>
            </SearchSvgContainer>
            <FullAddress>
                <input className="border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-blue-300" value={roadAddress} readOnly placeholder="Street address" />
                <input className="border rounded px-2 py-1 ml-2 mt-2 focus:outline-none focus:ring focus:border-blue-300" type="text" onChange={changeHandler} value={detailAddress} placeholder="detailed address"/>
            </FullAddress>
            <Modal isOpen={isOpen} ariaHideApp={false} style={customStyles}>
            <button onClick={onClose}>
                <CloseSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
                </CloseSVG>
            </button>
                <DaumPostcode 
                onComplete={completeHandler}  
                />
            </Modal>
            
            <br />

      
        </div>
    );
}

export default BuyerPostcode;