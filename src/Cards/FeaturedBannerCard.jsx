import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FeaturedBannerCard() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/news');
    };

    return (
        <div className="featured-banner-card" onClick={handleClick}>
            <div className="banner-content">
                <div className="banner-image">
                    <div className="banner-placeholder"></div>
                </div>
                <div className="banner-text-overlay">
                    <div className="banner-text-content">
                        <h2>Film Scout News</h2>
                        <p>Stay updated with production and location updates</p>
                    </div>
                    <div className="banner-cta-content">
                        <button className="cta-button">
                            Read News →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
