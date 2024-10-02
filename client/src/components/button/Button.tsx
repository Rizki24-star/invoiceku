import React from "react";
import "./button.scss";

const Button: React.FC<{
  text: string;
  Icon?: React.ElementType;
  outlined?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
}> = ({ text, Icon, onClick, type = "button", outlined }) => {
  return (
    <button
      className={`button flex items-center justify-center ${outlined && "outlined"}`}
      onClick={onClick}
      type={type}
    >
      {Icon && <Icon width={20} />}
      <span>{text}</span>
    </button>
  );
};

export default Button;
