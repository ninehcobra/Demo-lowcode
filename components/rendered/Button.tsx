import React from "react";

interface ButtonProps {
  text: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  variant = "primary",
  size = "medium",
  className,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-500 text-white hover:bg-blue-600";
      case "secondary":
        return "bg-gray-500 text-white hover:bg-gray-600";
      case "outline":
        return "border border-blue-500 text-blue-500 hover:bg-blue-50";
      case "ghost":
        return "text-blue-500 hover:bg-blue-50";
      default:
        return "bg-blue-500 text-white hover:bg-blue-600";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "px-3 py-1 text-sm";
      case "medium":
        return "px-4 py-2";
      case "large":
        return "px-6 py-3 text-lg";
      default:
        return "px-4 py-2";
    }
  };

  const buttonClasses =
    className ||
    `${getVariantClasses()} ${getSizeClasses()} rounded transition-colors duration-200`;

  return <button className={buttonClasses}>{text}</button>;
};
