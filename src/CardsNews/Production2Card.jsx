import React from "react";
import { useNewsContext } from "../context/NewsContext.jsx";
import NewsCard from "../components/NewsCard";

export default function Production2Card({ image }) {
    const { news, newsLoading } = useNewsContext();
    const newsItem = news && news.production && news.production[1] ? { ...news.production[1], image } : null;
    return (
        <NewsCard
            tag="Industry Update"
            type="production"
            newsItem={newsItem}
            loading={newsLoading}
        />
    );
}
