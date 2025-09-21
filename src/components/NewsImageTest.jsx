import React, { useState, useEffect } from 'react';
import newsImageClient from '../utils/newsImageClient';
import { API_ENDPOINTS } from '../utils/apiConfig';

const NewsImageTest = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [newsType, setNewsType] = useState('production');
    const [imageData, setImageData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [healthData, setHealthData] = useState(null);

    // Test API health on component mount
    useEffect(() => {
        testAPIHealth();
    }, []);

    const testAPIHealth = async () => {
        try {
            const response = await fetch(`${API_ENDPOINTS.NEWS_IMAGES}/health`);
            const health = await response.json();
            setHealthData(health);
        } catch (err) {
            setHealthData({ error: err.message, status: 'error' });
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        setLoading(true);
        setError(null);
        setImageData(null);

        try {
            const result = await newsImageClient.fetchNewsImage(searchTerm, newsType);
            setImageData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const testNewsItem = {
        title: "Netflix Production in Brooklyn",
        summary: "New streaming series filming in popular NYC neighborhoods",
        type: "production"
    };

    const handleTestEnhance = async () => {
        setLoading(true);
        setError(null);
        setImageData(null);

        try {
            const enhanced = await newsImageClient.enhanceNewsItemWithImage(testNewsItem);
            setImageData({
                primary: enhanced.image,
                alternatives: enhanced.imageAlternatives || [],
                searchQuery: enhanced.imageSearchTerm,
                enhanced: enhanced
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1>News Images Test Page</h1>

            {/* API Health Status */}
            <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: healthData?.status === 'ok' ? '#f0f8ff' : '#ffe6e6' }}>
                <h2>API Health Status</h2>
                <div style={{ fontSize: '0.9em' }}>
                    <p><strong>Endpoint:</strong> {API_ENDPOINTS.NEWS_IMAGES}</p>
                    {healthData ? (
                        healthData.error ? (
                            <div style={{ color: 'red' }}>
                                <p>❌ Error: {healthData.error}</p>
                                <p>💡 Make sure the backend server is running</p>
                            </div>
                        ) : (
                            <div>
                                <p>✅ Status: {healthData.status}</p>
                                <p>🔑 Has API Key: {healthData.config?.hasApiKey ? '✅' : '❌'}</p>
                                <p>🆔 Has CX ID: {healthData.config?.hasCxId ? '✅' : '❌'}</p>
                                <p>📅 Timestamp: {healthData.timestamp}</p>
                                {(!healthData.config?.hasApiKey || !healthData.config?.hasCxId) && (
                                    <p style={{ color: 'orange' }}>⚠️ Missing Google API credentials in backend</p>
                                )}
                            </div>
                        )
                    ) : (
                        <p>🔄 Checking API health...</p>
                    )}
                </div>
                <button
                    onClick={testAPIHealth}
                    style={{ padding: '4px 8px', fontSize: '0.8em', marginTop: '10px' }}
                >
                    Refresh Health Check
                </button>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h2>Manual Search Test</h2>
                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter search term (e.g., 'Netflix filming Brooklyn')"
                        style={{ width: '300px', padding: '8px', marginRight: '10px' }}
                    />
                    <select
                        value={newsType}
                        onChange={(e) => setNewsType(e.target.value)}
                        style={{ padding: '8px', marginRight: '10px' }}
                    >
                        <option value="production">Production</option>
                        <option value="location">Location</option>
                        <option value="general">General</option>
                    </select>
                    <button
                        onClick={handleSearch}
                        disabled={loading || !searchTerm.trim()}
                        style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        {loading ? 'Searching...' : 'Search Images'}
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h2>News Enhancement Test</h2>
                <p>Test enhancing this sample news item:</p>
                <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                    <strong>{testNewsItem.title}</strong><br />
                    <em>{testNewsItem.summary}</em><br />
                    <small>Type: {testNewsItem.type}</small>
                </div>
                <button
                    onClick={handleTestEnhance}
                    disabled={loading}
                    style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    {loading ? 'Enhancing...' : 'Enhance with Image'}
                </button>
            </div>

            {error && (
                <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px', marginBottom: '1rem' }}>
                    Error: {error}
                </div>
            )}

            {imageData && (
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
                    <h3>Results</h3>

                    {imageData.searchQuery && (
                        <p><strong>Search Query:</strong> {imageData.searchQuery}</p>
                    )}

                    {imageData.primary ? (
                        <div style={{ marginBottom: '1rem' }}>
                            <h4>Primary Image</h4>
                            <img
                                src={imageData.primary.url}
                                alt={imageData.primary.altText}
                                style={{ maxWidth: '300px', height: 'auto', borderRadius: '4px' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
                                <p>Alt text: {imageData.primary.altText}</p>
                                {imageData.primary.title && <p>Title: {imageData.primary.title}</p>}
                                {imageData.primary.width && <p>Dimensions: {imageData.primary.width} x {imageData.primary.height}</p>}
                            </div>
                        </div>
                    ) : (
                        <p>No primary image found</p>
                    )}

                    {imageData.alternatives && imageData.alternatives.length > 0 && (
                        <div>
                            <h4>Alternative Images</h4>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {imageData.alternatives.slice(0, 3).map((alt, index) => (
                                    <img
                                        key={index}
                                        src={alt.thumbnail || alt.url}
                                        alt={alt.altText}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {imageData.enhanced && (
                        <div style={{ marginTop: '1rem', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
                            <h4>Enhanced News Item</h4>
                            <pre style={{ fontSize: '0.8em', overflow: 'auto' }}>
                                {JSON.stringify(imageData.enhanced, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NewsImageTest;
