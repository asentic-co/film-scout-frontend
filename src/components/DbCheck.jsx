import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function DbCheck() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCheck = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await fetch(`${API_URL}/curated-images/db-check`);
            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Automatically run db-check when component loads
    useEffect(() => {
        handleCheck();
    }, []);

    return (
        <div style={{ margin: "2em 0", padding: "1.5em", border: "1px solid #ccc", borderRadius: 8, maxWidth: 600, minWidth: 500 }}>
            <button onClick={handleCheck} disabled={loading} style={{ padding: "0.5em 1em", fontWeight: 600 }}>
                {loading ? "Checking..." : "DB Check"}
            </button>
            {error && <div style={{ color: "red", marginTop: 8 }}>Error: {error}</div>}
            {result && (
                <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <div><b>DB Available:</b> {result.dbAvailable ? "✅" : "❌"}</div>
                        <div><b>Connection Host:</b> {result.hostname || "localhost"}</div>
                        {result.serverHostname && result.serverHostname !== result.hostname && (
                            <div><b>Server Name:</b> {result.serverHostname}</div>
                        )}
                    </div>
                    <div>
                        <div><b>Table Exists:</b> {result.tableExists ? "✅" : "❌"}</div>
                        <div><b>Environment:</b> {
                            result.hostname === 'localhost' ? 'Local Development' :
                                result.hostname === 'mariadb' ? 'Local (Docker-style)' :
                                    result.hostname?.includes('localhost') || result.hostname?.includes('127.0.0.1') ? 'Local Development' :
                                        'Production/Remote'
                        }</div>
                        {result.tableCreated && (
                            <div style={{ color: "green", fontSize: "0.9em", fontStyle: "italic" }}>
                                ✨ Table was just created
                            </div>
                        )}
                    </div>
                    {result.error && <div style={{ color: "red", gridColumn: '1 / -1' }}>Error: {result.error}</div>}
                </div>
            )}
        </div>
    );
}
