import { useNewsContext } from "../context/NewsContext.jsx";
import NewsCard from "../components/NewsCard";

export default function Location1Card({ image }) {
    const { news, newsLoading } = useNewsContext();
    const newsItem = news && news.location && news.location[0] ? { ...news.location[0], image } : null;
    return (
        <NewsCard
            tag="Location Scout"
            type="location"
            newsItem={newsItem}
            loading={newsLoading}
        />
    );
}
