import React from "react";

interface HeadingProps {
  text: string;
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  text,
  level,
  className = "text-2xl font-bold text-gray-900",
}) => {
  const Tag = level as keyof JSX.IntrinsicElements;

  return <Tag className={className}>{text}</Tag>;
};
