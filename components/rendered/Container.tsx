import React from "react";

interface ContainerProps {
  className?: string;
  children?: React.ReactNode;
  padding?: string;
}

export const Container: React.FC<ContainerProps> = ({
  className = "p-4 bg-white rounded-lg shadow",
  children,
  padding,
}) => {
  const containerClasses = padding
    ? `${padding} bg-white rounded-lg shadow`
    : className;

  return <div className={containerClasses}>{children}</div>;
};
