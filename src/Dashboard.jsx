import React, { useState, useEffect, useCallback, useContext } from "react";
import './App.css';
import InfoCard from "./Cards/InfoCard";
import RawDataCard from "./Cards/RawDataCard";
import ProductionCard from "./Cards/ProductionCard";
import CastingCard from "./Cards/CastingCard";
import MarketingCard from "./Cards/MarketingCard";
import FeaturedBannerCard from "./Cards/FeaturedBannerCard";
import { API_ENDPOINTS } from "./utils/apiConfig";
import DbCheck from "./components/DbCheck";
import { useNewsContext } from "./context/NewsContext.jsx";

console.log('Dashboard component imports:', {
  InfoCard,
  RawDataCard,
  ProductionCard,
  CastingCard,
  MarketingCard,
  FeaturedBannerCard
});

function DashboardInner() {
  // Preload News data after Dashboard mounts
  const { setNews, setNewsLoading } = useNewsContext();
  useEffect(() => {
    setNewsLoading(true);
    fetch(API_ENDPOINTS.NEWS)
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setNewsLoading(false);
      })
      .catch(() => {
        setNews(null);
        setNewsLoading(false);
      });
  }, [setNews, setNewsLoading]);
  const [production, setProduction] = useState(null);
  const [isPopulated, setIsPopulated] = useState(false);
  const [productionRecord, setProductionRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const [infoOutput, setInfoOutput] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [prodSearchComplete, setProdSearchComplete] = useState(false);
  const [rawDataComplete, setRawDataComplete] = useState(false); // New state to track when RawDataCard is done
  const [actorImages, setActorImages] = useState([]);
  const [actorImagesLoading, setActorImagesLoading] = useState(false);
  const [actorImagesReady, setActorImagesReady] = useState(false);
  const [mostRecentRecord, setMostRecentRecord] = useState(null); // <-- moved here
  const [productionName, setProductionName] = useState(null); // For ProductionCard to communicate back to InfoCard
  const [productionData, setProductionData] = useState(null); // For ProductionCard
  const [prodSearching, setProdSearching] = useState(false); // For ProductionCard searching state
  const [castingComplete, setCastingComplete] = useState(false); // For MarketingCard timing

  useEffect(() => {
    if (infoOutput) {
      setProductionRecord(infoOutput);
    }
  }, [infoOutput]);

  // Reset states when a new search starts
  useEffect(() => {
    if (isSearching) {
      setRawDataComplete(false);
      setCastingComplete(false);
      setProdSearchComplete(false);
      setInfoOutput(null);
      setProductionName(null);
    }
  }, [isSearching]);

  const handleActorsUpdate = useCallback((actors) => {
    if (actors.length > 0) {
      setActorImagesLoading(true);
      setActorImagesReady(false);
      setActorImages([]);
      const fetchPromises = actors.map(actorName =>
        fetch(API_ENDPOINTS.ACTOR_IMAGE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ actorName }),
        })
          .then((res) => res.json())
          .then((data) => ({
            actorName,
            url: data.url || null,
            thumbnail: data.thumbnail || null
          }))
          .catch(() => ({
            actorName,
            url: null,
            thumbnail: null
          }))
      );
      Promise.all(fetchPromises)
        .then((results) => {
          setActorImages(results);
          setActorImagesLoading(false);
          setActorImagesReady(true);
        })
        .catch(() => {
          setActorImagesLoading(false);
          setActorImagesReady(true);
        });
    } else {
      setActorImages([]);
      setActorImagesLoading(false);
      setActorImagesReady(false);
    }
  }, []);

  // Add this useEffect to track records changes
  useEffect(() => {
    // console.log("Dashboard received records update:", {
    //   recordsCount: records.length,
    //   records: records,
    //   firstRecord: records.length > 0 ? records[0] : null
    // });
  }, [records]);

  // Your existing useEffect for mostRecentRecord
  useEffect(() => {
    // console.log("mostRecentRecord changed:", mostRecentRecord);
  }, [mostRecentRecord]);

  // console.log("Dashboard passing mostRecentRecord to RawDataCard:", mostRecentRecord);

  // Create a wrapped setRecords function with logging
  const setRecordsWithLogging = useCallback((newRecords) => {
    // console.log("Dashboard setRecords called with:", {
    //   received: newRecords,
    //   isArray: Array.isArray(newRecords),
    //   hasLength: newRecords && newRecords.length,
    //   type: typeof newRecords,
    //   // Add this to see JSON representation
    //   asString: JSON.stringify(newRecords),
    //   // Add stack trace to see where this is called from
    //   stack: new Error().stack
    // });

    // Check if we're receiving the correct structure
    if (newRecords && typeof newRecords === 'object' && !Array.isArray(newRecords)) {
      // console.log("Converting object to array before setting records");
      const recordsArray = newRecords.records || [];
      setRecords(recordsArray);
    } else {
      setRecords(newRecords || []);
    }
  }, []);

  // Add this to log when the component mounts
  useEffect(() => {
    // console.log("Dashboard mounted, props prepared for InfoCard:", {
    //   setRecordsFunction: !!setRecordsWithLogging,
    //   setMostRecentRecordFunction: !!setMostRecentRecord
    // });
  }, []);

  // Add this to track what's happening on render
  // console.log("Dashboard render state:", {
  //   recordsLength: records.length,
  //   mostRecentRecord,
  //   isRecordsArray: Array.isArray(records)
  // });

  return (
    <div className="page-container" style={{ marginTop: '24px', marginBottom: '24px' }}>
      <div className="dashboard-container">
        <div className="grid-row">
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <InfoCard
              setRecords={setRecordsWithLogging}
              setInfoOutput={setInfoOutput}
              setIsSearching={setIsSearching}
              onActorsUpdate={handleActorsUpdate}
              mostRecentRecord={mostRecentRecord}
              setMostRecentRecord={setMostRecentRecord}
              productionName={productionName}
            />
          </div>
          <div className="card" style={{ gridColumn: 'span 1' }}>
            <RawDataCard
              record={mostRecentRecord}
              isSearching={isSearching}
              setRawDataComplete={setRawDataComplete}
            />
          </div>
        </div>
        <div className="grid-row">
          <div className="card" style={{ padding: '16px 12px', margin: '8px 0' }}>
            <ProductionCard
              mostRecentRecord={mostRecentRecord}
              infoOutput={infoOutput}
              productionData={productionData}
              isSearching={prodSearching}
              rawDataComplete={rawDataComplete}
              setIsPopulated={setIsPopulated}
              setProdSearchComplete={setProdSearchComplete}
              setInfoOutput={setInfoOutput}
              setIsSearching={setProdSearching}
              setProductionName={setProductionName}
            />
          </div>
          <div className="card" style={{ padding: '16px 12px', margin: '8px 0' }}>
            <CastingCard
              productionRecord={infoOutput}
              isSearching={isSearching}
              prodSearchComplete={prodSearchComplete}
              setCastingComplete={setCastingComplete}
            />
          </div>
          <div className="card" style={{ padding: '16px 12px', margin: '8px 0' }}>
            <MarketingCard
              productionRecord={infoOutput}
              castingComplete={castingComplete}
            />
          </div>
        </div>
        <div className="grid-row">
          <div className="card" style={{ padding: '16px 12px', margin: '8px 0' }}>
            <FeaturedBannerCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard(props) {
  return (
    <DashboardInner {...props} />
  );
}