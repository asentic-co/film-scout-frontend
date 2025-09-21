import React from "react";
import asenticBanner from "../assets/asentic-banner.png";

export default function AboutCard({ image }) {
    return (
        <div className="card">
            <div className="card-content">
                <div className="prose prose-lg max-w-none mb-8">
                    <div className="about-layout-container">
                        {/* Image and first paragraph side by side */}
                        <div className="about-top-section">
                            {image && image.url && (
                                <div className="about-image-container">
                                    <img
                                        src={image.url}
                                        alt={image.alt || 'Curated'}
                                        className="about-image rounded shadow"
                                    />
                                </div>
                            )}
                            <div className="about-text-beside">
                                <p className="mb-4 text-sm sm:text-base md:text-lg leading-relaxed">
                                    I'm lucky enough to call New York City my home and love seeing productions filming around the city on an almost daily basis. I learned that the people in the background of my favorite shows are just real people just going about their lives who happened to find themselves in the middle of a film shoot.
                                </p>
                            </div>
                        </div>

                        {/* Remaining text underneath */}
                        <div className="about-text-below">
                            <p className="mb-4 text-sm sm:text-base md:text-lg leading-relaxed">
                                When I was thinking about how I could build an app which blends hard data with agentic tools, I discovered that film permits are amongst the most accessed data sets in the city and how cool it would be to enrich that data with agents that autonomously research the productions to provide further insight...and with that, Film Scout was born.
                            </p>

                            <p className="mb-4 text-sm sm:text-base md:text-lg leading-relaxed">
                                I'm looking forward to building out a mapping feature and other enhancements over the coming months but for now thanks for stopping by and I hope you find it interesting and useful!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-8 pt-8 border-t border-gray-200">
                    <a
                        href="https://asentic.co"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity duration-200"
                    >
                        <img
                            src={asenticBanner}
                            alt="Asentic Banner"
                            className="asentic-banner-img"
                            style={{
                                width: '8rem',
                                height: 'auto',
                                maxWidth: '100%',
                                display: 'block',
                                margin: '0 auto'
                            }}
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}
