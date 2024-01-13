import React from "react";

interface IButtonProps {
  canClick: boolean;
  actionText: string;
}

export const Button:React.FC<IButtonProps> = ({
  canClick,
  actionText
}) => (
  <button 
    className={`text-lg font-medium focus:outline-none text-white py-3  transition-colors ${
    canClick 
      ? "bg-green-400 hover:bg-lime-200"
      : "bg-gray-300 pointer-events-none" 
    }`}>
    {canClick && actionText }
  </button>
)