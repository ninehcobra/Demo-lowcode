import React from "react";

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  name,
  className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      className={className}
    />
  );
};
