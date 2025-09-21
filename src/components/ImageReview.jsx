import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../utils/apiConfig';
import { addCuratedImage, fetchCuratedImages, deleteCuratedImage } from '../utils/curatedImagesApi';
import './ImageReview.css';
import DbCheck from '../components/DbCheck';

const ImageReview = () => {
    const [images, setImages] = useState([]);
    const [curatedImages, setCuratedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentView, setCurrentView] = useState('review'); // 'review' or 'curated'
    const [currentSearchPhrase, setCurrentSearchPhrase] = useState('');

    // Expanded NYC and generic street scene search phrases (50 total, all will add 'landscape' for orientation)
    const nycSearchPhrases = [
        'NYC film production Brooklyn',
        'Manhattan movie filming',
        'Queens television production',
        'Bronx film crew',
        'Staten Island movie set',
        'NYC film permits',
        'New York City casting call',
        'Brooklyn film studio',
        'Manhattan production office',
        'NYC film equipment',
        'New York movie location',
        'NYC film industry',
        'Manhattan film festival',
        'Brooklyn independent film',
        'NYC documentary filming',
        'NYC street scene',
        'New York City busy street',
        'Times Square crowd',
        'Central Park walkway',
        'NYC yellow cabs',
        'Brooklyn Bridge pedestrian',
        'SoHo street art',
        'Harlem street life',
        'Chelsea market street',
        'NYC rainy street',
        'NYC night street',
        'NYC street food vendor',
        'NYC crosswalk',
        'NYC skyline from street',
        'NYC street musicians',
        'NYC street festival',
        'NYC Lower East Side street',
        'NYC Chinatown street',
        'NYC Little Italy street',
        'NYC street in winter',
        'NYC street in summer',
        'NYC street with graffiti',
        'NYC street with brownstones',
        'NYC street with fire escapes',
        'NYC street with bicycles',
        'NYC street with dog walkers',
        'NYC street with food trucks',
        'NYC street with delivery trucks',
        'NYC street with construction',
        'NYC street with subway entrance',
        'NYC street with school children',
        'NYC street with police cars',
        'NYC street with streetlights',
        'NYC street with traffic jam',
        'NYC street with flower stands',
        'NYC street with hot dog stand',
        'NYC street with newsstand',
        'NYC street with mural',
    ];

    // Load curated images from backend on component mount
    useEffect(() => {
        const loadCurated = async () => {
            try {
                const images = await fetchCuratedImages();
                setCuratedImages(images);
            } catch (err) {
                console.error('Error loading curated images:', err);
            }
        };
        loadCurated();
    }, []);

    const getRandomSearchPhrase = () => {
        // Always append 'landscape' to encourage landscape orientation
        const phrase = nycSearchPhrases[Math.floor(Math.random() * nycSearchPhrases.length)];
        return `${phrase} landscape`;
    };

    const handleGetImages = async () => {
        setLoading(true);
        setError(null);

        // Debug: Check what URL is being constructed
        console.log('API_ENDPOINTS.NEWS_IMAGES:', API_ENDPOINTS.NEWS_IMAGES);
        console.log('Full search URL:', `${API_ENDPOINTS.NEWS_IMAGES}/search`);

        try {
            // Pick one random phrase for all six images
            const phrase = getRandomSearchPhrase();
            setCurrentSearchPhrase(phrase);
            console.log(`[ImageReview] Using single phrase for all images: "${phrase}"`);

            // Fetch once for the phrase
            const response = await fetch(`${API_ENDPOINTS.NEWS_IMAGES}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    searchTerm: phrase,
                    newsType: 'production'
                })
            });

            let data = null;
            try {
                data = await response.json();
            } catch (jsonErr) {
                console.error(`[ImageReview] Failed to parse JSON for phrase "${phrase}":`, jsonErr);
            }

            if (!response.ok) {
                console.error(`[ImageReview] Backend error for phrase "${phrase}":`, data);
                setError(data?.error || response.statusText);
                setImages([]);
                setLoading(false);
                return;
            }

            // Collect up to 6 unique images from the response
            let imagesArr = [];
            if (data) {
                // Prefer 'images' array, fallback to 'alternatives', fallback to 'primary'
                if (Array.isArray(data.images) && data.images.length > 0) {
                    imagesArr = data.images.slice(0, 6);
                } else if (Array.isArray(data.alternatives) && data.alternatives.length > 0) {
                    imagesArr = data.alternatives.slice(0, 6);
                } else if (data.primary) {
                    imagesArr = [data.primary];
                }
            }

            if (!imagesArr.length) {
                setError('No images found for the search phrase.');
                setImages([]);
                setLoading(false);
                return;
            }

            // Map to the expected format for rendering
            const results = imagesArr.map((img, idx) => ({
                searchPhrase: phrase,
                image: img,
                allImages: imagesArr,
                error: null
            }));

            setImages(results);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching images:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCurateImage = async (imageResult) => {
        try {
            const newImage = await addCuratedImage({
                url: imageResult.image.url,
                title: imageResult.image.title || imageResult.searchPhrase,
                searchPhrase: imageResult.searchPhrase
            });
            setCuratedImages(prev => [...prev, { ...newImage, curatedAt: new Date().toISOString() }]);
        } catch (err) {
            alert('Failed to curate image: ' + err.message);
        }
    };

    const handleRemoveFromCurated = async (imageId) => {
        try {
            await deleteCuratedImage(imageId);
            setCuratedImages(prev => prev.filter(img => img.id !== imageId));
        } catch (err) {
            alert('Failed to remove curated image: ' + err.message);
        }
    };

    const handleClearAllCurated = async () => {
        if (window.confirm('Are you sure you want to remove all curated images?')) {
            try {
                // Remove each image from backend
                await Promise.all(curatedImages.map(img => deleteCuratedImage(img.id)));
                setCuratedImages([]);
            } catch (err) {
                alert('Failed to clear curated images: ' + err.message);
            }
        }
    };

    const renderImageGrid = () => {
        if (loading) {
            return (
                <div className="image-grid loading">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="image-slot loading-slot">
                            <div className="loading-spinner">Loading...</div>
                        </div>
                    ))}
                </div>
            );
        }

        if (images.length === 0) {
            return (
                <div className="image-grid empty">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="image-slot empty-slot">
                            <div className="empty-message">Click "Get Images" to load</div>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="image-grid">
                {Array.from({ length: 6 }).map((_, index) => {
                    const imageResult = images[index];

                    if (!imageResult || !imageResult.image) {
                        return (
                            <div key={index} className="image-slot empty-slot">
                                <div className="empty-message">No image found</div>
                            </div>
                        );
                    }

                    const isAlreadyCurated = curatedImages.some(
                        curated => curated.url === imageResult.image.url
                    );

                    return (
                        <div key={index} className="image-slot">
                            <div className="image-container">
                                <img
                                    src={imageResult.image.url}
                                    alt={imageResult.image.title || imageResult.searchPhrase}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                                <div className="image-error" style={{ display: 'none' }}>
                                    Image failed to load
                                </div>
                            </div>
                            <div className="image-info">
                                <div className="search-phrase">{imageResult.searchPhrase}</div>
                                <div className="image-title">{imageResult.image.title || 'Untitled'}</div>
                            </div>
                            <div className="image-actions">
                                <button
                                    className={`curate-btn ${isAlreadyCurated ? 'already-curated' : ''}`}
                                    onClick={() => handleCurateImage(imageResult)}
                                    disabled={isAlreadyCurated}
                                >
                                    {isAlreadyCurated ? '✓ Curated' : '⭐ Curate'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderCuratedView = () => {
        if (curatedImages.length === 0) {
            return (
                <div className="curated-empty">
                    <h3>No curated images yet</h3>
                    <p>Switch to Review mode and curate some images to see them here.</p>
                </div>
            );
        }

        return (
            <div className="curated-grid">
                {curatedImages.map((curatedImage) => (
                    <div key={curatedImage.id} className="curated-item">
                        <div className="image-container">
                            <img
                                src={curatedImage.url}
                                alt={curatedImage.title}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <div className="image-error" style={{ display: 'none' }}>
                                Image failed to load
                            </div>
                        </div>
                        <div className="curated-info">
                            <div className="curated-title">{curatedImage.title}</div>
                            <div className="curated-phrase">From: {curatedImage.searchPhrase}</div>
                            <div className="curated-date">
                                Curated: {new Date(curatedImage.curatedAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="curated-actions">
                            <button
                                className="remove-btn"
                                onClick={() => handleRemoveFromCurated(curatedImage.id)}
                            >
                                🗑️ Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="image-review-container">
            <div className="image-review-header">
                <h1>Image Review & Curation</h1>
                <div className="view-controls" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                        className={`view-btn ${currentView === 'review' ? 'active' : ''}`}
                        onClick={() => setCurrentView('review')}
                    >
                        Review Images ({images.length})
                    </button>
                    <button
                        className={`view-btn ${currentView === 'curated' ? 'active' : ''}`}
                        onClick={() => setCurrentView('curated')}
                    >
                        Curated Images ({curatedImages.length})
                    </button>
                </div>
            </div>

            {currentView === 'review' && (
                <div className="review-section">
                    <div className="review-controls">
                        <button
                            className="get-images-btn"
                            onClick={handleGetImages}
                            disabled={loading}
                        >
                            {loading ? 'Loading Images...' : '🔍 Get Images'}
                        </button>
                        {images.length > 0 && (
                            <div className="review-info">
                                Showing {images.length} images from search phrase:<br />
                                <span style={{ fontWeight: 'bold', color: '#2a4d8f' }}>{currentSearchPhrase}</span>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="error-message">
                            ❌ Error: {error}
                        </div>
                    )}

                    {renderImageGrid()}
                </div>
            )}

            {currentView === 'curated' && (
                <div className="curated-section">
                    <div className="curated-controls">
                        {curatedImages.length > 0 && (
                            <button
                                className="clear-all-btn"
                                onClick={handleClearAllCurated}
                            >
                                🗑️ Clear All Curated
                            </button>
                        )}
                    </div>

                    {renderCuratedView()}
                </div>
            )}
            {/* DB Check button at the very bottom of the page */}
            <div style={{ margin: '32px 0 0 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <DbCheck />
            </div>
        </div>
    );
};

export default ImageReview;
