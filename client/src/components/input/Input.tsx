import React, { ChangeEvent } from "react";
import "./input.scss";

type InputProps = {
  label: string;
  name: string;
  type: "text" | "number" | "datetime" | "datetime-local";
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({ label, name, type, value, onChange }: InputProps) => {
  return (
    <div className="input flex flex-col gap-2 w-full">
      <label htmlFor={`#${label.toLowerCase()}`}>{label}</label>
      <input
        id={label.toLowerCase()}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
