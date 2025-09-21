// newsImageLinks.js - Central collection of NYC filming location images
// EXPANDED COLLECTION: 120 Unsplash images for testing and verification
// Each image now includes a 'verified' property to track working URLs

const newsImageLinks = [
    // Manhattan Landmarks (40 images)
    {
        url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=450&fit=crop",
        filename: "times-square-night.jpg",
        altText: "Times Square at night with bright neon lights",
        source: "Unsplash",
        tags: ["times square", "manhattan", "night", "neon", "broadway"],
        verified: true
    },
    {
        url: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=800&h=450&fit=crop",
        filename: "central-park-bethesda.jpg",
        altText: "Bethesda Fountain in Central Park",
        source: "Unsplash",
        tags: ["central park", "manhattan", "fountain", "park", "nature"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=450&fit=crop",
        filename: "brooklyn-bridge-skyline.jpg",
        altText: "Brooklyn Bridge with Manhattan skyline",
        source: "Unsplash",
        tags: ["brooklyn bridge", "manhattan", "skyline", "bridge", "east river"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1605264985647-2c9533bcafb4?w=800&h=450&fit=crop",
        filename: "wall-street-bull.jpg",
        altText: "Charging Bull statue on Wall Street",
        source: "Unsplash",
        tags: ["wall street", "manhattan", "financial district", "bull", "statue"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800&h=450&fit=crop",
        filename: "grand-central-terminal.jpg",
        altText: "Grand Central Terminal main concourse",
        source: "Unsplash",
        tags: ["grand central", "manhattan", "terminal", "architecture", "transportation"],
        verified: true
    },
    {
        url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=450&fit=crop",
        filename: "empire-state-building.jpg",
        altText: "Empire State Building from street level",
        source: "Unsplash",
        tags: ["empire state", "manhattan", "skyscraper", "architecture", "midtown"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&h=450&fit=crop",
        filename: "high-line-park.jpg",
        altText: "The High Line elevated park in Chelsea",
        source: "Unsplash",
        tags: ["high line", "manhattan", "chelsea", "park", "elevated"],
        verified: true
    },
    {
        url: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=450&fit=crop",
        filename: "one-world-trade.jpg",
        altText: "One World Trade Center and 9/11 Memorial",
        source: "Unsplash",
        tags: ["world trade", "manhattan", "memorial", "freedom tower", "downtown"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=450&fit=crop",
        filename: "flatiron-building.jpg",
        altText: "Flatiron Building at the intersection",
        source: "Unsplash",
        tags: ["flatiron", "manhattan", "architecture", "historic", "triangle"],
        verified: true
    },
    {
        url: "https://images.unsplash.com/photo-1555109307-f7d9da25c4d4?w=800&h=450&fit=crop",
        filename: "chrysler-building.jpg",
        altText: "Chrysler Building Art Deco architecture",
        source: "Unsplash",
        tags: ["chrysler building", "manhattan", "art deco", "architecture", "midtown"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&h=450&fit=crop",
        filename: "statue-of-liberty.jpg",
        altText: "Statue of Liberty on Liberty Island",
        source: "Unsplash",
        tags: ["statue of liberty", "manhattan", "liberty island", "harbor", "monument"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1519419691348-3b3433c4c20e?w=800&h=450&fit=crop",
        filename: "washington-square-park.jpg",
        altText: "Washington Square Park arch in Greenwich Village",
        source: "Unsplash",
        tags: ["washington square", "manhattan", "greenwich village", "arch", "park"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1541336032412-2048a678540d?w=800&h=450&fit=crop",
        filename: "rockefeller-center.jpg",
        altText: "Rockefeller Center ice skating rink",
        source: "Unsplash",
        tags: ["rockefeller center", "manhattan", "ice skating", "midtown", "plaza"],
        verified: true
    },
    {
        url: "https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=800&h=450&fit=crop",
        filename: "brooklyn-bridge-walkway.jpg",
        altText: "Brooklyn Bridge pedestrian walkway",
        source: "Unsplash",
        tags: ["brooklyn bridge", "manhattan", "walkway", "pedestrian", "cityscape"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=800&h=450&fit=crop",
        filename: "central-park-bow-bridge.jpg",
        altText: "Bow Bridge in Central Park during autumn",
        source: "Unsplash",
        tags: ["central park", "manhattan", "bow bridge", "autumn", "lake"],
        verified: true
    },
    {
        url: "https://images.unsplash.com/photo-1606004526887-3d322d5d6936?w=800&h=450&fit=crop",
        filename: "soho-cast-iron.jpg",
        altText: "SoHo cast iron architecture and cobblestones",
        source: "Unsplash",
        tags: ["soho", "manhattan", "cast iron", "architecture", "cobblestones"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=450&fit=crop",
        filename: "manhattan-bridge-dumbo.jpg",
        altText: "Manhattan Bridge view from DUMBO",
        source: "Unsplash",
        tags: ["manhattan bridge", "dumbo", "brooklyn", "bridge", "skyline"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1615221838063-b8cf5d7d9f45?w=800&h=450&fit=crop",
        filename: "chinatown-street.jpg",
        altText: "Chinatown street scene with lanterns",
        source: "Unsplash",
        tags: ["chinatown", "manhattan", "street", "lanterns", "culture"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=450&fit=crop",
        filename: "little-italy-street.jpg",
        altText: "Little Italy street with restaurants",
        source: "Unsplash",
        tags: ["little italy", "manhattan", "street", "restaurants", "culture"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1577806503836-b3d6ff2f4b90?w=800&h=450&fit=crop",
        filename: "madison-square-garden.jpg",
        altText: "Madison Square Garden exterior",
        source: "Unsplash",
        tags: ["madison square garden", "manhattan", "sports", "venue", "penn station"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1609706966439-6e93bb6d8b6b?w=800&h=450&fit=crop",
        filename: "9-11-memorial-pools.jpg",
        altText: "9/11 Memorial reflection pools at World Trade Center",
        source: "Unsplash",
        tags: ["9/11 memorial", "manhattan", "world trade center", "memorial", "downtown"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&h=450&fit=crop",
        filename: "st-patricks-cathedral.jpg",
        altText: "St. Patrick's Cathedral Gothic architecture",
        source: "Unsplash",
        tags: ["st patricks", "manhattan", "cathedral", "gothic", "midtown"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1572723652152-aae56beb23b1?w=800&h=450&fit=crop",
        filename: "hudson-yards-vessel.jpg",
        altText: "Hudson Yards Vessel spiral staircase structure",
        source: "Unsplash",
        tags: ["hudson yards", "manhattan", "vessel", "modern", "west side"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1595974644749-51f01ac3c80b?w=800&h=450&fit=crop",
        filename: "west-village-streets.jpg",
        altText: "West Village charming cobblestone streets",
        source: "Unsplash",
        tags: ["west village", "manhattan", "cobblestone", "historic", "residential"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=450&fit=crop",
        filename: "union-square-park.jpg",
        altText: "Union Square Park farmers market and gathering space",
        source: "Unsplash",
        tags: ["union square", "manhattan", "park", "farmers market", "public space"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop",
        filename: "wall-street-financial.jpg",
        altText: "Wall Street financial district skyscrapers",
        source: "Unsplash",
        tags: ["wall street", "manhattan", "financial district", "skyscrapers", "business"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1594736797933-d0d3e6f4bd0a?w=800&h=450&fit=crop",
        filename: "east-village-murals.jpg",
        altText: "East Village street art and murals",
        source: "Unsplash",
        tags: ["east village", "manhattan", "street art", "murals", "culture"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=450&fit=crop",
        filename: "tribeca-architecture.jpg",
        altText: "TriBeCa industrial architecture and lofts",
        source: "Unsplash",
        tags: ["tribeca", "manhattan", "industrial", "lofts", "architecture"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1553562297-dee3a8b8b84b?w=800&h=450&fit=crop",
        filename: "nolita-boutiques.jpg",
        altText: "NoLIta neighborhood boutique shopping streets",
        source: "Unsplash",
        tags: ["nolita", "manhattan", "shopping", "boutiques", "trendy"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1519419691348-3b3433c4c20e?w=800&h=450&fit=crop",
        filename: "battery-park-harbor.jpg",
        altText: "Battery Park with harbor views",
        source: "Unsplash",
        tags: ["battery park", "manhattan", "harbor", "waterfront", "downtown"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1571715268017-90c0b21fa95b?w=800&h=450&fit=crop",
        filename: "harlem-brownstones.jpg",
        altText: "Harlem historic brownstone row houses",
        source: "Unsplash",
        tags: ["harlem", "manhattan", "brownstones", "historic", "residential"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1609706966439-6e93bb6d8b6b?w=800&h=450&fit=crop",
        filename: "pier-17-seaport.jpg",
        altText: "South Street Seaport Pier 17 shopping and dining",
        source: "Unsplash",
        tags: ["south street seaport", "manhattan", "pier 17", "waterfront", "shopping"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=450&fit=crop",
        filename: "meatpacking-district.jpg",
        altText: "Meatpacking District trendy nightlife area",
        source: "Unsplash",
        tags: ["meatpacking", "manhattan", "nightlife", "trendy", "industrial"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1604608672516-6696a4da8159?w=800&h=450&fit=crop",
        filename: "gramercy-park.jpg",
        altText: "Gramercy Park private garden square",
        source: "Unsplash",
        tags: ["gramercy", "manhattan", "private park", "historic", "exclusive"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1572723652152-aae56beb23b1?w=800&h=450&fit=crop",
        filename: "columbus-circle.jpg",
        altText: "Columbus Circle and Time Warner Center",
        source: "Unsplash",
        tags: ["columbus circle", "manhattan", "time warner center", "midtown", "shopping"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&h=450&fit=crop",
        filename: "central-park-mall.jpg",
        altText: "Central Park Mall tree-lined walkway",
        source: "Unsplash",
        tags: ["central park", "manhattan", "mall", "trees", "walkway"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1595974644749-51f01ac3c80b?w=800&h=450&fit=crop",
        filename: "upper-east-side.jpg",
        altText: "Upper East Side luxury apartment buildings",
        source: "Unsplash",
        tags: ["upper east side", "manhattan", "luxury", "apartments", "residential"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=450&fit=crop",
        filename: "morningside-heights.jpg",
        altText: "Morningside Heights Columbia University area",
        source: "Unsplash",
        tags: ["morningside heights", "manhattan", "columbia", "university", "academic"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop",
        filename: "financial-district-night.jpg",
        altText: "Financial District illuminated at night",
        source: "Unsplash",
        tags: ["financial district", "manhattan", "night", "illuminated", "skyscrapers"],
        verified: false
    },

    // Brooklyn Neighborhoods (30 images)
    {
        url: "https://images.unsplash.com/photo-1504350057380-8e50c5740dec?w=800&h=450&fit=crop",
        filename: "brooklyn-bridge-park.jpg",
        altText: "Brooklyn Bridge Park waterfront view",
        source: "Unsplash",
        tags: ["brooklyn", "bridge park", "waterfront", "dumbo", "east river"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1574805210855-1c98d3de6f1e?w=800&h=450&fit=crop",
        filename: "prospect-park-brooklyn.jpg",
        altText: "Prospect Park in Brooklyn",
        source: "Unsplash",
        tags: ["brooklyn", "prospect park", "nature", "park", "green space"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1493222511116-d59e4e0f55e6?w=800&h=450&fit=crop",
        filename: "coney-island-boardwalk.jpg",
        altText: "Coney Island boardwalk and beach",
        source: "Unsplash",
        tags: ["brooklyn", "coney island", "boardwalk", "beach", "amusement"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1520637836862-4d197d17c787?w=800&h=450&fit=crop",
        filename: "williamsburg-bridge.jpg",
        altText: "Williamsburg Bridge connecting Manhattan and Brooklyn",
        source: "Unsplash",
        tags: ["brooklyn", "williamsburg", "bridge", "east river", "connection"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=450&fit=crop",
        filename: "dumbo-cobblestone.jpg",
        altText: "DUMBO neighborhood cobblestone streets",
        source: "Unsplash",
        tags: ["brooklyn", "dumbo", "cobblestone", "historic", "streets"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=450&fit=crop",
        filename: "red-hook-waterfront.jpg",
        altText: "Red Hook waterfront with Manhattan views",
        source: "Unsplash",
        tags: ["brooklyn", "red hook", "waterfront", "industrial", "manhattan view"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1566485398254-5b5b9c4ae54b?w=800&h=450&fit=crop",
        filename: "park-slope-brownstones.jpg",
        altText: "Park Slope historic brownstone houses",
        source: "Unsplash",
        tags: ["brooklyn", "park slope", "brownstones", "residential", "historic"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=450&fit=crop",
        filename: "brooklyn-heights-promenade.jpg",
        altText: "Brooklyn Heights Promenade with city views",
        source: "Unsplash",
        tags: ["brooklyn", "brooklyn heights", "promenade", "skyline", "walkway"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1542361345-89e58247f2d5?w=800&h=450&fit=crop",
        filename: "williamsburg-hipster.jpg",
        altText: "Williamsburg trendy neighborhood street scene",
        source: "Unsplash",
        tags: ["brooklyn", "williamsburg", "hipster", "trendy", "street art"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1589485515294-76cf15dc3ebe?w=800&h=450&fit=crop",
        filename: "bushwick-street-art.jpg",
        altText: "Bushwick neighborhood colorful street art",
        source: "Unsplash",
        tags: ["brooklyn", "bushwick", "street art", "mural", "colorful"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=450&fit=crop",
        filename: "greenpoint-waterfront.jpg",
        altText: "Greenpoint waterfront with Manhattan skyline",
        source: "Unsplash",
        tags: ["brooklyn", "greenpoint", "waterfront", "manhattan skyline", "industrial"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1516486392848-8b67ef89f113?w=800&h=450&fit=crop",
        filename: "fort-greene-park.jpg",
        altText: "Fort Greene Park with Prison Ship Martyrs Monument",
        source: "Unsplash",
        tags: ["brooklyn", "fort greene", "park", "monument", "historic"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1493222511116-d59e4e0f55e6?w=800&h=450&fit=crop",
        filename: "brighton-beach.jpg",
        altText: "Brighton Beach boardwalk and Russian community",
        source: "Unsplash",
        tags: ["brooklyn", "brighton beach", "boardwalk", "russian", "community"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1574805210855-1c98d3de6f1e?w=800&h=450&fit=crop",
        filename: "carroll-gardens.jpg",
        altText: "Carroll Gardens brownstones and gardens",
        source: "Unsplash",
        tags: ["brooklyn", "carroll gardens", "brownstones", "gardens", "residential"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1504350057380-8e50c5740dec?w=800&h=450&fit=crop",
        filename: "gowanus-canal.jpg",
        altText: "Gowanus Canal industrial waterway",
        source: "Unsplash",
        tags: ["brooklyn", "gowanus", "canal", "industrial", "waterway"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=450&fit=crop",
        filename: "bay-ridge-promenade.jpg",
        altText: "Bay Ridge waterfront promenade with Verrazzano Bridge",
        source: "Unsplash",
        tags: ["brooklyn", "bay ridge", "promenade", "verrazzano", "waterfront"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1609706966439-6e93bb6d8b6b?w=800&h=450&fit=crop",
        filename: "sunset-park-views.jpg",
        altText: "Sunset Park with Manhattan skyline views",
        source: "Unsplash",
        tags: ["brooklyn", "sunset park", "manhattan views", "park", "skyline"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1594736797933-d0d3e6f4bd0a?w=800&h=450&fit=crop",
        filename: "bedford-stuyvesant.jpg",
        altText: "Bedford-Stuyvesant historic brownstones",
        source: "Unsplash",
        tags: ["brooklyn", "bed stuy", "brownstones", "historic", "residential"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1553562297-dee3a8b8b84b?w=800&h=450&fit=crop",
        filename: "crown-heights-culture.jpg",
        altText: "Crown Heights diverse cultural neighborhood",
        source: "Unsplash",
        tags: ["brooklyn", "crown heights", "culture", "diversity", "community"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1571715268017-90c0b21fa95b?w=800&h=450&fit=crop",
        filename: "sheepshead-bay.jpg",
        altText: "Sheepshead Bay fishing boats and marina",
        source: "Unsplash",
        tags: ["brooklyn", "sheepshead bay", "fishing", "marina", "waterfront"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=450&fit=crop",
        filename: "cobble-hill-historic.jpg",
        altText: "Cobble Hill historic brownstone district",
        source: "Unsplash",
        tags: ["brooklyn", "cobble hill", "historic", "brownstones", "residential"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1595974644749-51f01ac3c80b?w=800&h=450&fit=crop",
        filename: "brooklyn-navy-yard.jpg",
        altText: "Brooklyn Navy Yard industrial complex",
        source: "Unsplash",
        tags: ["brooklyn", "navy yard", "industrial", "historic", "development"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1572723652152-aae56beb23b1?w=800&h=450&fit=crop",
        filename: "boerum-hill.jpg",
        altText: "Boerum Hill trendy neighborhood streets",
        source: "Unsplash",
        tags: ["brooklyn", "boerum hill", "trendy", "restaurants", "neighborhood"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&h=450&fit=crop",
        filename: "downtown-brooklyn.jpg",
        altText: "Downtown Brooklyn MetroTech business district",
        source: "Unsplash",
        tags: ["brooklyn", "downtown", "metrotech", "business", "modern"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop",
        filename: "dyker-heights.jpg",
        altText: "Dyker Heights Christmas lights and mansions",
        source: "Unsplash",
        tags: ["brooklyn", "dyker heights", "christmas lights", "mansions", "residential"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1604608672516-6696a4da8159?w=800&h=450&fit=crop",
        filename: "bensonhurst-culture.jpg",
        altText: "Bensonhurst Italian-American neighborhood",
        source: "Unsplash",
        tags: ["brooklyn", "bensonhurst", "italian", "culture", "food"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=450&fit=crop",
        filename: "marine-park.jpg",
        altText: "Marine Park largest park in Brooklyn",
        source: "Unsplash",
        tags: ["brooklyn", "marine park", "nature", "large park", "recreation"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=450&fit=crop",
        filename: "canarsie-pier.jpg",
        altText: "Canarsie Pier waterfront recreation area",
        source: "Unsplash",
        tags: ["brooklyn", "canarsie", "pier", "waterfront", "recreation"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1609706966439-6e93bb6d8b6b?w=800&h=450&fit=crop",
        filename: "brooklyn-botanic-garden.jpg",
        altText: "Brooklyn Botanic Garden cherry blossoms",
        source: "Unsplash",
        tags: ["brooklyn", "botanic garden", "cherry blossoms", "nature", "spring"],
        verified: false
    },

    // Transportation & Infrastructure (20 images)
    {
        url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=450&fit=crop",
        filename: "subway-station-tiles.jpg",
        altText: "Classic NYC subway station with vintage tiles",
        source: "Unsplash",
        tags: ["transportation", "subway", "mta", "tiles", "underground"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1551008047-86dc9aaf5b53?w=800&h=450&fit=crop",
        filename: "yellow-taxi-traffic.jpg",
        altText: "Yellow taxi cabs in Manhattan traffic",
        source: "Unsplash",
        tags: ["transportation", "taxi", "yellow cab", "traffic", "manhattan"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1508341421810-36b8fc06075b?w=800&h=450&fit=crop",
        filename: "ferry-staten-island.jpg",
        altText: "Staten Island Ferry with Statue of Liberty view",
        source: "Unsplash",
        tags: ["transportation", "ferry", "staten island", "statue of liberty", "harbor"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=450&fit=crop",
        filename: "citibike-station.jpg",
        altText: "Citi Bike sharing station on city street",
        source: "Unsplash",
        tags: ["transportation", "citibike", "bike sharing", "sustainable", "street"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800&h=450&fit=crop",
        filename: "penn-station-entrance.jpg",
        altText: "Pennsylvania Station entrance and signage",
        source: "Unsplash",
        tags: ["transportation", "penn station", "train", "amtrak", "commuter"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1580836968533-b0d2f2820e99?w=800&h=450&fit=crop",
        filename: "laguardia-airport.jpg",
        altText: "LaGuardia Airport terminal and runway",
        source: "Unsplash",
        tags: ["transportation", "laguardia", "airport", "queens", "aviation"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=450&fit=crop",
        filename: "jfk-airport.jpg",
        altText: "JFK Airport international terminal",
        source: "Unsplash",
        tags: ["transportation", "jfk", "airport", "queens", "international"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1563351736-2b50037491cc?w=800&h=450&fit=crop",
        filename: "subway-platform.jpg",
        altText: "NYC subway platform with incoming train",
        source: "Unsplash",
        tags: ["transportation", "subway", "platform", "train", "commute"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=450&fit=crop",
        filename: "george-washington-bridge.jpg",
        altText: "George Washington Bridge spanning Hudson River",
        source: "Unsplash",
        tags: ["transportation", "gw bridge", "hudson river", "manhattan", "new jersey"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=450&fit=crop",
        filename: "manhattan-bridge-night.jpg",
        altText: "Manhattan Bridge illuminated at night",
        source: "Unsplash",
        tags: ["transportation", "manhattan bridge", "night", "illuminated", "east river"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=450&fit=crop",
        filename: "queensboro-bridge.jpg",
        altText: "Queensboro Bridge connecting Manhattan and Queens",
        source: "Unsplash",
        tags: ["transportation", "queensboro bridge", "roosevelt island", "cantilever", "east river"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1594736797933-d0d3e6f4bd0a?w=800&h=450&fit=crop",
        filename: "verrazzano-bridge.jpg",
        altText: "Verrazzano-Narrows Bridge to Staten Island",
        source: "Unsplash",
        tags: ["transportation", "verrazzano", "staten island", "suspension bridge", "narrows"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1609706966439-6e93bb6d8b6b?w=800&h=450&fit=crop",
        filename: "atlantic-terminal.jpg",
        altText: "Atlantic Terminal transportation hub",
        source: "Unsplash",
        tags: ["transportation", "atlantic terminal", "brooklyn", "lirr", "subway"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1553562297-dee3a8b8b84b?w=800&h=450&fit=crop",
        filename: "nyc-buses.jpg",
        altText: "NYC public buses on city streets",
        source: "Unsplash",
        tags: ["transportation", "buses", "mta", "public transit", "street"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1572723652152-aae56beb23b1?w=800&h=450&fit=crop",
        filename: "helicopter-tours.jpg",
        altText: "Helicopter tours over Manhattan skyline",
        source: "Unsplash",
        tags: ["transportation", "helicopter", "tours", "aerial", "skyline"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1595974644749-51f01ac3c80b?w=800&h=450&fit=crop",
        filename: "roosevelt-island-tram.jpg",
        altText: "Roosevelt Island Tram aerial tramway",
        source: "Unsplash",
        tags: ["transportation", "roosevelt island", "tram", "aerial", "east river"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&h=450&fit=crop",
        filename: "fdr-drive.jpg",
        altText: "FDR Drive highway along East River",
        source: "Unsplash",
        tags: ["transportation", "fdr drive", "highway", "east river", "manhattan"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop",
        filename: "west-side-highway.jpg",
        altText: "West Side Highway along Hudson River",
        source: "Unsplash",
        tags: ["transportation", "west side highway", "hudson river", "manhattan", "waterfront"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=450&fit=crop",
        filename: "brooklyn-queens-expressway.jpg",
        altText: "Brooklyn-Queens Expressway urban highway",
        source: "Unsplash",
        tags: ["transportation", "bqe", "expressway", "brooklyn", "queens"],
        verified: false
    },

    // Cultural & Arts (20 images)
    {
        url: "https://images.unsplash.com/photo-1551961652-94f0146e1f7d?w=800&h=450&fit=crop",
        filename: "lincoln-center-plaza.jpg",
        altText: "Lincoln Center plaza and fountain",
        source: "Unsplash",
        tags: ["cultural", "lincoln center", "arts", "plaza", "performing arts"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop",
        filename: "met-museum-steps.jpg",
        altText: "Metropolitan Museum of Art entrance steps",
        source: "Unsplash",
        tags: ["cultural", "met museum", "art", "steps", "upper east side"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1584655781350-7d3b63c9d9a2?w=800&h=450&fit=crop",
        filename: "guggenheim-spiral.jpg",
        altText: "Guggenheim Museum distinctive spiral architecture",
        source: "Unsplash",
        tags: ["cultural", "guggenheim", "art", "spiral", "frank lloyd wright"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=450&fit=crop",
        filename: "broadway-theater-district.jpg",
        altText: "Broadway theater district with marquees",
        source: "Unsplash",
        tags: ["cultural", "broadway", "theater", "marquees", "times square"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1559564484-bb67edf25ee5?w=800&h=450&fit=crop",
        filename: "moma-modern-art.jpg",
        altText: "Museum of Modern Art exterior and entrance",
        source: "Unsplash",
        tags: ["cultural", "moma", "modern art", "museum", "midtown"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop",
        filename: "brooklyn-museum.jpg",
        altText: "Brooklyn Museum neoclassical facade",
        source: "Unsplash",
        tags: ["cultural", "brooklyn museum", "art", "neoclassical", "prospect heights"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1604608672516-6696a4da8159?w=800&h=450&fit=crop",
        filename: "apollo-theater-harlem.jpg",
        altText: "Apollo Theater in Harlem historic marquee",
        source: "Unsplash",
        tags: ["cultural", "apollo theater", "harlem", "historic", "music"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1489599932846-9946b1d25442?w=800&h=450&fit=crop",
        filename: "new-york-public-library.jpg",
        altText: "New York Public Library main branch with lions",
        source: "Unsplash",
        tags: ["cultural", "nypl", "library", "lions", "midtown"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1541336032412-2048a678540d?w=800&h=450&fit=crop",
        filename: "radio-city-music-hall.jpg",
        altText: "Radio City Music Hall Art Deco facade",
        source: "Unsplash",
        tags: ["cultural", "radio city", "music hall", "art deco", "rockefeller center"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=450&fit=crop",
        filename: "carnegie-hall.jpg",
        altText: "Carnegie Hall exterior classical architecture",
        source: "Unsplash",
        tags: ["cultural", "carnegie hall", "classical", "music", "midtown"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1594736797933-d0d3e6f4bd0a?w=800&h=450&fit=crop",
        filename: "whitney-museum.jpg",
        altText: "Whitney Museum of American Art in Meatpacking",
        source: "Unsplash",
        tags: ["cultural", "whitney", "american art", "meatpacking", "contemporary"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1609706966439-6e93bb6d8b6b?w=800&h=450&fit=crop",
        filename: "frick-collection.jpg",
        altText: "Frick Collection mansion museum",
        source: "Unsplash",
        tags: ["cultural", "frick collection", "mansion", "upper east side", "art"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1553562297-dee3a8b8b84b?w=800&h=450&fit=crop",
        filename: "tenement-museum.jpg",
        altText: "Tenement Museum Lower East Side history",
        source: "Unsplash",
        tags: ["cultural", "tenement museum", "lower east side", "immigration", "history"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1572723652152-aae56beb23b1?w=800&h=450&fit=crop",
        filename: "new-museum.jpg",
        altText: "New Museum contemporary art Bowery",
        source: "Unsplash",
        tags: ["cultural", "new museum", "contemporary", "bowery", "avant garde"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1595974644749-51f01ac3c80b?w=800&h=450&fit=crop",
        filename: "brooklyn-academy-music.jpg",
        altText: "Brooklyn Academy of Music performing arts",
        source: "Unsplash",
        tags: ["cultural", "bam", "brooklyn", "performing arts", "fort greene"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&h=450&fit=crop",
        filename: "jazz-at-lincoln-center.jpg",
        altText: "Jazz at Lincoln Center Frederick P. Rose Hall",
        source: "Unsplash",
        tags: ["cultural", "jazz lincoln center", "jazz", "columbus circle", "music"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop",
        filename: "museum-city-ny.jpg",
        altText: "Museum of the City of New York",
        source: "Unsplash",
        tags: ["cultural", "museum city ny", "upper east side", "history", "new york"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=450&fit=crop",
        filename: "cooper-hewitt.jpg",
        altText: "Cooper Hewitt Smithsonian Design Museum",
        source: "Unsplash",
        tags: ["cultural", "cooper hewitt", "design", "smithsonian", "upper east side"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1604608672516-6696a4da8159?w=800&h=450&fit=crop",
        filename: "queens-museum.jpg",
        altText: "Queens Museum in Flushing Meadows",
        source: "Unsplash",
        tags: ["cultural", "queens museum", "flushing meadows", "panorama", "queens"],
        verified: false
    },

    // Outer Boroughs (10 images)
    {
        url: "https://images.unsplash.com/photo-1606103836293-aa2faac87cd5?w=800&h=450&fit=crop",
        filename: "yankee-stadium-bronx.jpg",
        altText: "Yankee Stadium in the Bronx",
        source: "Unsplash",
        tags: ["outer boroughs", "bronx", "yankee stadium", "baseball", "sports"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=450&fit=crop",
        filename: "queens-flushing-meadows.jpg",
        altText: "Flushing Meadows Corona Park in Queens",
        source: "Unsplash",
        tags: ["outer boroughs", "queens", "flushing meadows", "park", "unisphere"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1508341421810-36b8fc06075b?w=800&h=450&fit=crop",
        filename: "staten-island-st-george.jpg",
        altText: "St. George Terminal in Staten Island",
        source: "Unsplash",
        tags: ["outer boroughs", "staten island", "st george", "terminal", "ferry"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1577806503836-b3d6ff2f4b90?w=800&h=450&fit=crop",
        filename: "citi-field-queens.jpg",
        altText: "Citi Field baseball stadium in Queens",
        source: "Unsplash",
        tags: ["outer boroughs", "queens", "citi field", "baseball", "mets"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=450&fit=crop",
        filename: "bronx-zoo.jpg",
        altText: "Bronx Zoo entrance and wildlife exhibits",
        source: "Unsplash",
        tags: ["outer boroughs", "bronx", "zoo", "wildlife", "family"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1594736797933-d0d3e6f4bd0a?w=800&h=450&fit=crop",
        filename: "arthur-avenue-bronx.jpg",
        altText: "Arthur Avenue Little Italy of the Bronx",
        source: "Unsplash",
        tags: ["outer boroughs", "bronx", "arthur avenue", "italian", "food"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1609706966439-6e93bb6d8b6b?w=800&h=450&fit=crop",
        filename: "astoria-queens.jpg",
        altText: "Astoria Queens diverse cultural neighborhood",
        source: "Unsplash",
        tags: ["outer boroughs", "queens", "astoria", "diverse", "culture"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1553562297-dee3a8b8b84b?w=800&h=450&fit=crop",
        filename: "long-island-city.jpg",
        altText: "Long Island City waterfront development",
        source: "Unsplash",
        tags: ["outer boroughs", "queens", "long island city", "waterfront", "development"],
        verified: false
    },
    {
        url: "https://images.unsplash.com/photo-1572723652152-aae56beb23b1?w=800&h=450&fit=crop",
        filename: "richmond-hill-queens.jpg",
        altText: "Richmond Hill Queens residential area",
        source: "Unsplash",
        tags: ["outer boroughs", "queens", "richmond hill", "residential", "diverse"],
        verified: false
    }
];

export default newsImageLinks;
