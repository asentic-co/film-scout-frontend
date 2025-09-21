// Fallback data provider - separates static data from business logic
class FallbackDataProvider {
    getFallbackNews(type, limit = 3) {
        const data = type === 'production'
            ? this.getProductionData()
            : this.getLocationData();

        return data.slice(0, limit);
    }

    getProductionData() {
        return [
            {
                id: 'fallback-prod-1',
                title: "Netflix Expands AI-Assisted Content Creation Tools",
                summary: "Streaming giant introduces new machine learning tools for script analysis and audience preference prediction, helping creators develop more targeted content while maintaining creative integrity...",
                date: this.getRecentDate(1),
                category: 'production',
                source: 'Variety',
                sourceUrl: 'https://variety.com/netflix-ai-content-creation-tools',
                isFallback: true
            },
            {
                id: 'fallback-prod-2',
                title: "Sundance Partners with Emerging Filmmakers Initiative",
                summary: "Festival announces $50M fund for underrepresented voices in independent cinema, providing production resources and distribution support for innovative storytelling projects...",
                date: this.getRecentDate(2),
                category: 'production',
                source: 'The Hollywood Reporter',
                sourceUrl: 'https://hollywoodreporter.com/sundance-emerging-filmmakers-fund',
                isFallback: true
            },
            {
                id: 'fallback-prod-3',
                title: "Virtual Production Studios Report Record Growth",
                summary: "LED wall facilities see 300% increase in bookings as productions embrace cost-effective virtual backgrounds, reducing location shoots and environmental impact significantly...",
                date: this.getRecentDate(3),
                category: 'production',
                source: 'Deadline',
                sourceUrl: 'https://deadline.com/virtual-production-studios-growth',
                isFallback: true
            }
        ];
    }

    getLocationData() {
        return [
            {
                id: 'fallback-loc-1',
                title: "California Launches Green Filming Initiative",
                summary: "State announces comprehensive sustainability program offering additional tax credits for productions meeting environmental standards, targeting carbon-neutral filming by 2027...",
                date: this.getRecentDate(1),
                category: 'location',
                source: 'Entertainment Weekly',
                sourceUrl: 'https://ew.com/california-green-filming-initiative',
                isFallback: true
            },
            {
                id: 'fallback-loc-2',
                title: "Prague Studios Unveil Europe's Largest Virtual Set",
                summary: "Barrandov Studios completes €100M expansion featuring 360-degree LED walls and motion capture technology, positioning Prague as leading destination for international productions...",
                date: this.getRecentDate(2),
                category: 'location',
                source: 'Screen International',
                sourceUrl: 'https://screeninternational.com/prague-studios-virtual-set',
                isFallback: true
            },
            {
                id: 'fallback-loc-3',
                title: "New Zealand Streamlines International Film Permits",
                summary: "Government introduces digital-first permit system reducing approval times from weeks to days, strengthening the country's position as premier filming destination for major productions...",
                date: this.getRecentDate(3),
                category: 'location',
                source: 'Location Manager Magazine',
                sourceUrl: 'https://locationmanager.com/new-zealand-digital-permits',
                isFallback: true
            }
        ];
    }

    // Generate recent dates for fallback content
    getRecentDate(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString();
    }
}

export default FallbackDataProvider;
