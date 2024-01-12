import React from "react";

interface IButtonProps {
  canClick: boolean;
}

export const Button:React.FC<IButtonProps> = ({
  canClick,
  
}) => (
  <button 
    className={`text-lg font-medium focus:outline-none text-white py-3  transition-colors ${
    canClick 
      ?  "bg-lime-600 hover:bg-green-700"
      : "bg-gray-300 pointer-events-none" 
    }`}>

  </button>
)