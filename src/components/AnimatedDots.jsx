import React from 'react';

const AnimatedDots = () => {
  return (
    <span className="animate-pulse">
      <span className="dot bg-gray-500 inline-block rounded-full w-2 h-2 mr-1"></span>
      <span className="dot bg-gray-500 inline-block rounded-full w-2 h-2 mr-1"></span>
      <span className="dot bg-gray-500 inline-block rounded-full w-2 h-2"></span>
    </span>
  );
};

export default AnimatedDots;