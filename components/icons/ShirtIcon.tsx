
import React from 'react';

export const ShirtIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13V5a2 2 0 00-2-2H8a2 2 0 00-2 2v8l-2 3v2h16v-2l-2-3zM8 3v2m8-2v2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 13V3m0 18v-8" />
  </svg>
);
