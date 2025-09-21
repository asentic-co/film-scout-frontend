import React from "react";

const StarterPrompts = ({ neighborhoods, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {neighborhoods.map((neighborhood, index) => (
        <button
          key={index}
          className="inline-block text-white font-semibold text-xs uppercase tracking-wide rounded-full transition-all duration-300 border border-white/10 backdrop-blur-sm hover:transform hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #e9eafc 0%, #b6b8e6 100%)', // much lighter purple gradient
            color: '#4B3F72', // softer purple text
            padding: '0.25rem 0.625rem',
            boxShadow: '0 1px 3px rgba(102, 126, 234, 0.12)', // reduced shadow
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 2px 6px rgba(102, 126, 234, 0.18)'; // lighter shadow on hover
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 1px 3px rgba(102, 126, 234, 0.12)';
          }}
          onClick={() => onSelect(neighborhood)}
        >
          {neighborhood}
        </button>
      ))}
    </div>
  );
};

export default StarterPrompts;