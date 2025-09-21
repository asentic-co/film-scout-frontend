// Setup script to populate Firestore with initial news data
const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore();

const productionNews = [
    {
        id: 'prod-1',
        title: "Netflix Expands AI-Assisted Content Creation Tools",
        summary: "Streaming giant introduces new machine learning tools for script analysis and audience preference prediction, helping creators develop more targeted content while maintaining creative integrity and reducing development timelines significantly.",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        category: 'production',
        source: 'Variety',
        sourceUrl: 'https://variety.com/netflix-ai-content-creation-tools',
        isFallback: false
    },
    {
        id: 'prod-2',
        title: "Sundance Partners with Emerging Filmmakers Initiative",
        summary: "Festival announces $50M fund for underrepresented voices in independent cinema, providing production resources and distribution support for innovative storytelling projects while fostering diversity in the film industry.",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        category: 'production',
        source: 'The Hollywood Reporter',
        sourceUrl: 'https://hollywoodreporter.com/sundance-emerging-filmmakers-fund',
        isFallback: false
    },
    {
        id: 'prod-3',
        title: "Virtual Production Studios Report Record Growth",
        summary: "LED wall facilities see 300% increase in bookings as productions embrace cost-effective virtual backgrounds, reducing location shoots and environmental impact while providing unprecedented creative flexibility for filmmakers.",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        category: 'production',
        source: 'Deadline',
        sourceUrl: 'https://deadline.com/virtual-production-studios-growth',
        isFallback: false
    },
    {
        id: 'prod-4',
        title: "Major Studios Embrace Remote Collaboration Tools",
        summary: "Industry leaders adopt cloud-based production platforms enabling seamless collaboration across global teams, revolutionizing post-production workflows and reducing project timelines by up to 40% while maintaining quality standards.",
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        category: 'production',
        source: 'Film Journal International',
        sourceUrl: 'https://filmjournal.com/remote-collaboration-tools',
        isFallback: false
    },
    {
        id: 'prod-5',
        title: "Indie Film Financing Reaches All-Time High",
        summary: "Independent film funding surpasses $2.5 billion in 2024, driven by streaming platform acquisitions and international co-production deals, creating unprecedented opportunities for emerging filmmakers and diverse storytelling.",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        category: 'production',
        source: 'Screen International',
        sourceUrl: 'https://screeninternational.com/indie-financing-record',
        isFallback: false
    }
];

const locationNews = [
    {
        id: 'loc-1',
        title: "California Launches Green Filming Initiative",
        summary: "State announces comprehensive sustainability program offering additional tax credits for productions meeting environmental standards, targeting carbon-neutral filming by 2027 while maintaining competitive incentives for major productions.",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        category: 'location',
        source: 'Entertainment Weekly',
        sourceUrl: 'https://ew.com/california-green-filming-initiative',
        isFallback: false
    },
    {
        id: 'loc-2',
        title: "Prague Studios Unveil Europe's Largest Virtual Set",
        summary: "Barrandov Studios completes €100M expansion featuring 360-degree LED walls and motion capture technology, positioning Prague as the leading destination for international productions seeking cutting-edge facilities at competitive rates.",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        category: 'location',
        source: 'Screen International',
        sourceUrl: 'https://screeninternational.com/prague-studios-virtual-set',
        isFallback: false
    },
    {
        id: 'loc-3',
        title: "New Zealand Streamlines International Film Permits",
        summary: "Government introduces digital-first permit system reducing approval times from weeks to days, strengthening the country's position as premier filming destination for major productions while maintaining environmental protections.",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        category: 'location',
        source: 'Location Manager Magazine',
        sourceUrl: 'https://locationmanager.com/new-zealand-digital-permits',
        isFallback: false
    },
    {
        id: 'loc-4',
        title: "Atlanta Studios Expand Capacity by 40%",
        summary: "Georgia's film industry adds 12 new soundstages and state-of-the-art post-production facilities, reinforcing Atlanta's status as the 'Hollywood of the South' and creating over 3,000 new jobs in the entertainment sector.",
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        category: 'location',
        source: 'Georgia Film Office',
        sourceUrl: 'https://georgiafilm.org/atlanta-expansion',
        isFallback: false
    },
    {
        id: 'loc-5',
        title: "UK Introduces Enhanced Tax Relief for Productions",
        summary: "British government increases film tax relief to 35% for qualifying productions, making UK one of the most competitive filming destinations globally while supporting local crew development and infrastructure investment.",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        category: 'location',
        source: 'Screen Daily',
        sourceUrl: 'https://screendaily.com/uk-enhanced-tax-relief',
        isFallback: false
    }
];

async function setupFirestore() {
    try {
        console.log('Setting up Firestore with news data...');

        // Create production news document
        const productionRef = firestore.collection('news').doc('production');
        await productionRef.set({
            items: productionNews,
            lastUpdated: new Date().toISOString(),
            type: 'production'
        });
        console.log('✅ Production news stored successfully');

        // Create location news document  
        const locationRef = firestore.collection('news').doc('location');
        await locationRef.set({
            items: locationNews,
            lastUpdated: new Date().toISOString(),
            type: 'location'
        });
        console.log('✅ Location news stored successfully');

        console.log('🎉 Firestore setup complete!');
        console.log(`📊 Total items stored: ${productionNews.length + locationNews.length}`);

    } catch (error) {
        console.error('❌ Error setting up Firestore:', error);
        process.exit(1);
    }
}

// Run the setup
setupFirestore().then(() => {
    console.log('Firestore setup finished');
    process.exit(0);
});
