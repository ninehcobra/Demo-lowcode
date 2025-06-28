import React from "react";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className = "rounded-lg shadow-md",
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
      }}
    />
  );
};
