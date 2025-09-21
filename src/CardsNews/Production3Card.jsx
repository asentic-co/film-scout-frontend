import React from "react";
import { useNewsContext } from "../context/NewsContext.jsx";
import NewsCard from "../components/NewsCard";

export default function Production3Card({ image }) {
    const { news, newsLoading } = useNewsContext();
    const newsItem = news && news.production && news.production[2] ? { ...news.production[2], image } : null;
    return (
        <NewsCard
            tag="Production Spotlight"
            type="production"
            newsItem={newsItem}
            loading={newsLoading}
        />
    );
}
