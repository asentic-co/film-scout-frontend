// src/components/PreloadingIndicator.jsx
import React from 'react';
import './PreloadingIndicator.css';

export default function PreloadingIndicator({ isPreloading }) {
    if (!isPreloading) return null;

    return (
        <div className="preloading-indicator">
            <div className="preloading-spinner"></div>
            <span className="preloading-text">Loading news content...</span>
        </div>
    );
}
