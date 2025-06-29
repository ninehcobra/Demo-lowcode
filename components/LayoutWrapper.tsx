import React from "react";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="flex w-full min-w-0">{children}</div>
    </div>
  );
};

export const ResponsiveContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex-1 min-w-0 overflow-auto">
      <div className="h-full">{children}</div>
    </div>
  );
};

export const ScrollableSection: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div className={`overflow-y-auto overflow-x-hidden ${className}`}>
      {children}
    </div>
  );
};
