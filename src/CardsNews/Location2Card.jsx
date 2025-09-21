import React from "react";
import { useNewsContext } from "../context/NewsContext.jsx";
import NewsCard from "../components/NewsCard";

export default function Location2Card({ image }) {
    const { news, newsLoading } = useNewsContext();
    const newsItem = news && news.location && news.location[1] ? { ...news.location[1], image } : null;
    return (
        <NewsCard
            tag="NYC Filming"
            type="location"
            newsItem={newsItem}
            loading={newsLoading}
        />
    );
}
