import React from "react";

interface LabelProps {
  text: string;
  htmlFor?: string;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ text, htmlFor, className }) => (
  <label
    htmlFor={htmlFor}
    className={className || "block text-sm font-medium text-gray-700"}
  >
    {text}
  </label>
);

export default Label;
