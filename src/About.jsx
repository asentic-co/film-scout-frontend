import React, { useEffect, useState } from "react";
import curatedNewsImageClient from "./utils/curatedNewsImageClient";
import './App.css';
import './News.css';
import './About.css';
import AboutCard from "./Cards/AboutCard";

export default function About() {
    const [image, setImage] = useState(null);
    useEffect(() => {
        curatedNewsImageClient.fetchUniqueRandomCuratedImages(1)
            .then(results => {
                setImage(results[0]);
            })
            .catch(() => {
                setImage({ url: null, alt: 'Image unavailable' });
            });
    }, []);
    return (
        <div className="page-container news-page">
            <section>
                <div className="flex justify-center">
                    <div className="w-full max-w-2xl">
                        <div className="about-card-container">
                            <AboutCard image={image} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
