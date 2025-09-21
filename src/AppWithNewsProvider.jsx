// App.jsx integration example
import React from 'react';
import { NewsProvider } from './context/NewsContext';
import News from './News';
import './App.css';

function App() {
    // Determine environment
    const environment = process.env.NODE_ENV === 'development' ? 'development' : 'production';

    return (
        <NewsProvider environment={environment}>
            <div className="App">
                <News />
                {/* Other components */}
            </div>
        </NewsProvider>
    );
}

export default App;
