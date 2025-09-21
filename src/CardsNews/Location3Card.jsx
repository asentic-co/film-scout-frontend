import React from "react";
import { useNewsContext } from "../context/NewsContext.jsx";
import NewsCard from "../components/NewsCard";

export default function Location3Card({ image }) {
    const { news, newsLoading } = useNewsContext();
    const newsItem = news && news.location && news.location[2] ? { ...news.location[2], image } : null;
    return (
        <NewsCard
            tag="Location Alert"
            type="location"
            newsItem={newsItem}
            loading={newsLoading}
        />
    );
}
