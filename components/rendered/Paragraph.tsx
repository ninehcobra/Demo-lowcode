import React from "react";

interface ParagraphProps {
  text: string;
  className?: string;
}

export const Paragraph: React.FC<ParagraphProps> = ({
  text,
  className = "text-gray-700 leading-relaxed",
}) => {
  return <p className={className}>{text}</p>;
};
