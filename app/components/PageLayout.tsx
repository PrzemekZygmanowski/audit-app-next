import React from "react";
import { Navigation } from "./Navigation";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className='bg-gray-50 min-h-screen'>
      <Navigation />
      <div className='p-8'>{children}</div>
    </div>
  );
};
