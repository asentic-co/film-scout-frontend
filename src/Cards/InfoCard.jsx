import React, { useState, useEffect } from "react";
import StarterPrompts from "../components/StarterPrompts";
import { formatDateRange } from "../utils/dateHelpers";
import { simplifyParkingHeld } from "../utils/addressHelpers";
import { inferLeadActors } from "../utils/inferActorsClient";
import { API_ENDPOINTS } from "../utils/apiConfig";
// import RawDataCard from "../components/RawDataCard"; // Import RawDataCard not needed; using Dashboard parent to pass props

export default function InfoCard({ setRecords, setInfoOutput, setIsSearching, onActorsUpdate, onMostRecentRecord, mostRecentRecord, setMostRecentRecord, productionName: externalProductionName }) {
  const [neighborhood, setNeighborhood] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [productionName, setProductionName] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [leadActors, setLeadActors] = useState([]);
  const [actorsAnimating, setActorsAnimating] = useState(false);
  const [productionTeaser, setProductionTeaser] = useState(null);
  const [teaserLoading, setTeaserLoading] = useState(false);
  const [unsupportedLocationMessage, setUnsupportedLocationMessage] = useState("");

  // Update local productionName when external one changes
  useEffect(() => {
    if (externalProductionName) {
      setProductionName(externalProductionName);
    }
  }, [externalProductionName]);

  const STARTER_NEIGHBORHOODS = ["Manhattan", "Brooklyn", "Queens", "Midtown", "Times Square", "Williamsburg", "Greenpoint"];

  // Function to detect if input is a NYC-related place
  const isNYCRelated = (searchTerm) => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    // NYC boroughs
    const boroughs = [
      'manhattan', 'new york', 'ny', 'nyc',
      'brooklyn', 'bk', 'bkln',
      'queens', 'queen',
      'bronx', 'the bronx',
      'staten island', 'si', 'staten'
    ];

    // NYC neighborhoods and areas
    const neighborhoods = [
      'times square', 'midtown', 'upper east side', 'upper west side',
      'lower east side', 'east village', 'west village', 'greenwich village',
      'soho', 'tribeca', 'chinatown', 'little italy', 'nolita',
      'financial district', 'wall street', 'battery park', 'chelsea',
      'flatiron', 'gramercy', 'murray hill', 'kips bay', 'turtle bay',
      'hell\'s kitchen', 'clinton', 'theater district', 'garment district',
      'diamond district', 'koreatown', 'nomad', 'union square',
      'washington square', 'astor place', 'bowery', 'alphabet city',
      'two bridges', 'stone street', 'south street seaport',
      'brooklyn heights', 'dumbo', 'williamsburg', 'greenpoint',
      'bushwick', 'bed-stuy', 'bedford-stuyvesant', 'park slope',
      'prospect heights', 'crown heights', 'fort greene', 'boerum hill',
      'carroll gardens', 'cobble hill', 'red hook', 'sunset park',
      'bay ridge', 'bensonhurst', 'coney island', 'brighton beach',
      'sheepshead bay', 'canarsie', 'flatbush', 'east flatbush',
      'flatlands', 'mill basin', 'bergen beach', 'marine park',
      'long island city', 'lic', 'astoria', 'sunnyside', 'woodside',
      'elmhurst', 'jackson heights', 'corona', 'east elmhurst',
      'flushing', 'bayside', 'whitestone', 'college point', 'little neck',
      'ridgewood', 'middle village', 'glendale', 'maspeth', 'woodhaven',
      'richmond hill', 'kew gardens', 'forest hills', 'rego park',
      'ozone park', 'howard beach', 'jamaica', 'hollis', 'queens village',
      'bellerose', 'rosedale', 'laurelton', 'springfield gardens',
      'cambria heights', 'st. albans', 'south jamaica', 'south ozone park',
      'far rockaway', 'arverne', 'broad channel', 'rockaway beach',
      'breezy point', 'neponsit', 'belle harbor', 'roxbury',
      'fordham', 'university heights', 'tremont', 'belmont',
      'morris heights', 'highbridge', 'concourse', 'melrose',
      'mott haven', 'port morris', 'hunts point', 'longwood',
      'morrisania', 'crotona park', 'claremont', 'mount eden',
      'morris park', 'bronxdale', 'allerton', 'pelham parkway',
      'norwood', 'bedford park', 'kingsbridge', 'riverdale',
      'spuyten duyvil', 'marble hill', 'fieldston', 'van cortlandt',
      'woodlawn', 'wakefield', 'eastchester', 'baychester',
      'co-op city', 'throggs neck', 'schuylerville', 'edgewater park',
      'castle hill', 'clason point', 'soundview', 'parkchester',
      'west farms', 'east tremont', 'belmont', 'arthur avenue',
      'fordham manor', 'kingsbridge heights', 'jerome park',
      'st. george', 'stapleton', 'clifton', 'great kills',
      'tottenville', 'new dorp', 'oakwood', 'annadale',
      'eltingville', 'huguenot', 'prince\'s bay', 'rossville',
      'charleston', 'richmond valley', 'woodrow', 'pleasant plains',
      'old town', 'dongan hills', 'grant city', 'new springville',
      'bulls head', 'bloomfield', 'willowbrook', 'heartland village',
      'midland beach', 'south beach', 'rosebank', 'arrochar',
      'grasmere', 'concord', 'emerson hill', 'grymes hill',
      'silver lake', 'ward hill', 'sunnyside', 'elm park',
      'port richmond', 'mariners harbor', 'arlington', 'graniteville',
      'westerleigh', 'meiers corners', 'new brighton', 'st. paul\'s',
      'west new brighton', 'livingston', 'randall manor', 'elm hill'
    ];

    // Check if the term matches any NYC-related place
    return boroughs.includes(normalizedTerm) ||
      neighborhoods.includes(normalizedTerm) ||
      // Also check for partial matches for common abbreviations and variations
      boroughs.some(borough => normalizedTerm.includes(borough) || borough.includes(normalizedTerm)) ||
      neighborhoods.some(neighborhood => normalizedTerm.includes(neighborhood) || neighborhood.includes(normalizedTerm));
  };

  // Function to detect unsupported locations (non-NYC areas)
  const detectUnsupportedLocation = (searchTerm) => {
    // If it's not NYC-related, it's unsupported
    return !isNYCRelated(searchTerm);
  };

  // Remove production inference from InfoCard - let ProductionCard handle it
  // InfoCard should only handle raw data search and actor inference after production is found

  // Infer lead actors when production name is available (triggered by ProductionCard)
  useEffect(() => {
    if (productionName && mostRecentRecord && onActorsUpdate) {
      setActorsAnimating(true);
      inferLeadActors(productionName, mostRecentRecord)
        .then((actors) => {
          setLeadActors(actors);
          onActorsUpdate(actors);
        })
        .catch((error) => {
          console.error("Error inferring lead actors:", error);
          setLeadActors([]);
          onActorsUpdate([]);
        })
        .finally(() => {
          setActorsAnimating(false);
        });
    }
  }, [productionName, mostRecentRecord, onActorsUpdate]);

  // Handle animation when production name changes
  useEffect(() => {
    if (productionName) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [productionName]);

  const handleSearch = async (searchNeighborhood) => {
    setHasSearched(true);
    const query = (typeof searchNeighborhood === "string" ? searchNeighborhood : neighborhood).trim();

    if (!query) return;

    // Clear any previous unsupported location message
    setUnsupportedLocationMessage("");

    // Check if the query is an unsupported location
    if (detectUnsupportedLocation(query)) {
      setUnsupportedLocationMessage(`Sorry, "${query}" is not supported. Film Scout currently only covers New York City productions. Try searching for NYC boroughs (Manhattan, Brooklyn, Queens, Bronx, Staten Island) or neighborhoods like Times Square, Upper East Side, Williamsburg, or Astoria.`);
      return;
    }

    setIsSearching(true);
    try {
      // Request 6 records to have options for random selection
      const response = await fetch(`${API_ENDPOINTS.EVENTS}?neighborhood=${encodeURIComponent(query)}&limit=6`);
      const data = await response.json();

      // Log the data being passed up to Dashboard
      // console.log("Film data received from API:", data);

      // Determine if data is the records array or contains a records property
      let recordsArray = Array.isArray(data) ? data : data.records || [];

      // console.log("Identified records array:", recordsArray);
      setRecords(recordsArray);

      if (recordsArray.length > 0) {
        // Randomly select one record from the retrieved records
        const randomIndex = Math.floor(Math.random() * recordsArray.length);
        const selectedRecord = recordsArray[randomIndex];

        setMostRecentRecord(selectedRecord);
        // console.log("Randomly selected record:", selectedRecord, "from", recordsArray.length, "records");
        if (onMostRecentRecord) {
          onMostRecentRecord(selectedRecord);
        }
      }
    } catch (error) {
      console.error("Search failed:", error); // Keeping error logging active
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white p-4 mb-4">
      {/* Container wrapper for controlled width */}
      <div className="max-w-xl mx-auto">
        <h3 className="font-semibold text-lg mb-2">Search</h3>
        <div
          className="flex items-center w-full bg-white px-2 py-4 mb-2"
          style={{ minHeight: 60 }}
        >
          <input
            type="text"
            // Tailwind: px-8 py-5 text-2xl focus:outline-none bg-transparent
            style={{
              paddingLeft: "1rem",    // px-8
              paddingRight: "1rem",   // px-8
              paddingTop: "1rem",  // py-5
              paddingBottom: "1rem", // py-5
              fontSize: "1rem",     // text-2xl
              outline: "none",        // focus:outline-none
              boxShadow: "none",      // Remove any browser default outline
              border: "1.5px solid #e2e8f0", // Add subtle light outline (Tailwind gray-200)
              background: "transparent", // bg-transparent
              height: "12px",
              lineHeight: "1rem",
              flex: 1.6, // 40% more space than the button
            }}
            placeholder="Search NYC neighborhood, borough, or area..."
            value={neighborhood}
            onChange={(e) => {
              setNeighborhood(e.target.value);
              // Clear unsupported location message when user starts typing
              if (unsupportedLocationMessage) {
                setUnsupportedLocationMessage("");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            className="ml-4 rounded-full transition-all duration-300 flex items-center justify-center border border-white/10 backdrop-blur-sm hover:transform hover:-translate-y-0.5"
            aria-label="Search"
            onClick={() => handleSearch()}
            style={{
              background: 'linear-gradient(135deg, #e9eafc 0%, #b6b8e6 100%)', // lighter purple gradient
              color: '#4B3F72', // softer purple text
              height: "40px",
              width: "40px",
              minWidth: "40px",
              minHeight: "40px",
              flex: 0,
              boxShadow: '0 1px 3px rgba(102, 126, 234, 0.12)', // reduced shadow
              outline: "none",
              border: "none",
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 2px 6px rgba(102, 126, 234, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = '0 1px 3px rgba(102, 126, 234, 0.12)';
            }}
          >
            {/* Magnifying glass SVG */}
            <svg
              className="w-7 h-7 text-[#4B3F72]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              viewBox="0 0 28 28"
            >
              <circle cx="13" cy="13" r="10" />
              <line x1="25" y1="25" x2="19.5" y2="19.5" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center mt-4 mb-4">
          <div style={{ maxWidth: '400px' }}>
            <StarterPrompts
              neighborhoods={STARTER_NEIGHBORHOODS}
              onSelect={(n) => {
                setNeighborhood(n);
                handleSearch(n);
              }}
            />
          </div>
        </div>

        {/* Display unsupported location message */}
        {unsupportedLocationMessage && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-start">
              <div className="text-yellow-600 mr-2">ℹ️</div>
              <p className="text-yellow-800 text-sm leading-relaxed">
                {unsupportedLocationMessage}
              </p>
            </div>
          </div>
        )}

        <p className="text-gray-600 mt-4">
          Choose a starter prompt or enter the name of any neighborhood or borough in NYC to see the most recent film or television production in that area.
          <br />
        </p>

        {/* Add your display logic here, e.g. Card, CardContent, etc... */}
      </div> {/* End container wrapper */}
    </div>
  );
}