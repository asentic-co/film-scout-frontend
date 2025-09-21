import React from "react";
import { useNewsContext } from "../context/NewsContext.jsx";
import NewsCard from "../components/NewsCard";

export default function Production1Card({ image }) {
    const { news, newsLoading } = useNewsContext();
    const newsItem = news && news.production && news.production[0] ? { ...news.production[0], image } : null;
    return (
        <NewsCard
            tag="Production News"
            type="production"
            newsItem={newsItem}
            loading={newsLoading}
        />
    );
}
