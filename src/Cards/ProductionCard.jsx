import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import { fetchCompanyLogo } from "../utils/inferLogoClient";
import { inferProductionData } from "../utils/inferProdClient";
import { statusLightAnimations, statusLightClasses, statusTextClasses } from "../styles/statusLightConfig";
import "../styles/StatusLight.css";

import prdWait from "../assets/prd-wait.png";
import prdWork from "../assets/prd-work.png";

// Helper to get backend base URL depending on environment
const getBackendBaseUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:4000';
    } else {
      return 'https://api.filmscout.app';
    }
  }
  return '';
};

const dotVariants = {
  animate: (i) => ({
    opacity: [0.3, 0.7, 0.3],
    scale: [1, 1.25, 1],
    transition: {
      repeat: Infinity,
      duration: 1.1,
      delay: i * 0.25,
      ease: "easeInOut",
    },
  }),
};

export default function ProductionCard({
  mostRecentRecord,
  infoOutput,
  productionData,
  isSearching = false,
  rawDataComplete = false, // New prop to wait for RawDataCard
  setIsPopulated,
  setProdSearchComplete,
  setInfoOutput,
  setIsSearching,
  setProductionName
}) {
  // Add this comprehensive logging
  // console.log("=== FULL infoOutput DEBUG ===");
  //console.log("infoOutput (full object):", JSON.stringify(infoOutput, null, 2));
  // console.log("infoOutput keys:", infoOutput ? Object.keys(infoOutput) : 'infoOutput is null/undefined');
  // console.log("===========================");

  // Add these logs for troubleshooting
  //console.log("ProductionCard props received:");
  //console.log("- infoOutput:", infoOutput);
  //console.log("- isSearching:", isSearching);
  //console.log("- typeof isSearching:", typeof isSearching);

  const [logoUrl, setLogoUrl] = useState(null);
  const [logoLoading, setLogoLoading] = useState(false);

  // Trigger production inference when mostRecentRecord is available AND RawDataCard is complete
  useEffect(() => {
    if (mostRecentRecord && rawDataComplete && setIsSearching && setInfoOutput) {
      console.log("ProductionCard: Starting production search after RawDataCard completion");
      setIsSearching(true);
      inferProductionData(mostRecentRecord)
        .then((result) => {
          const enrichedResult = {
            ...result,
            originalRecord: mostRecentRecord
          };
          setInfoOutput(enrichedResult);

          // Extract and communicate production name back to Dashboard
          const prodName = typeof result.productionName === "string"
            ? result.productionName
            : result.productionName?.productionName;

          if (setProductionName && prodName) {
            setProductionName(prodName);
          }
        })
        .catch((error) => {
          console.error("Error inferring production data:", error);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }
  }, [mostRecentRecord, rawDataComplete, setIsSearching, setInfoOutput, setProductionName]);

  // Fix the data extraction - add more defensive checks and use productionData as fallback
  const dataSource = infoOutput || productionData;
  const hasResult = dataSource && typeof dataSource === 'object' && dataSource.productionName;
  const productionDataExtracted = hasResult ? dataSource.productionName : null;

  //console.log("Data extraction:");
  //console.log("- hasResult:", hasResult);
  //console.log("- productionData:", productionData);

  const companyName =
    dataSource?.record?.company ||
    dataSource?.company ||
    dataSource?.record?.network ||
    null;

  // Fix the status logic - be more explicit about types
  let status = "Waiting";
  if (isSearching === true) {
    status = "Researching";
  } else if (isSearching === false && hasResult && dataSource?.productionName) {
    status = "Done";
  }

  // Only set productionName if status is Done
  const productionName =
    status === "Done"
      ? (typeof dataSource?.productionName === "string"
        ? dataSource.productionName
        : dataSource?.productionName?.productionName)
      : null;

  // Extract confidence and isSpeculative from the nested structure
  const confidence = dataSource?.productionName?.confidence;
  const isSpeculative = dataSource?.productionName?.isSpeculative;

  // Better debugging logs
  // console.log("=== ProductionCard Final Values ===");
  // console.log("isSearching:", isSearching, "type:", typeof isSearching);
  // console.log("hasResult:", hasResult, "type:", typeof hasResult);
  // console.log("status:", status, "type:", typeof status);
  // console.log("productionName:", productionName, "type:", typeof productionName);
  // console.log("companyName:", companyName, "type:", typeof companyName);
  // console.log("dataSource:", dataSource);
  // console.log("confidence:", confidence);
  // console.log("isSpeculative:", isSpeculative);
  // console.log("status === 'Done':", status === "Done");
  // console.log("!!productionName:", !!productionName);
  // console.log("condition for showing Name section:", (status === "Done" && !!productionName));
  // console.log("will show Name section:", !!(status === "Done" && productionName));
  // console.log("Logo fetch conditions - hasResult:", hasResult, "productionName:", !!productionName, "!isSearching:", !isSearching, "companyName:", !!companyName);

  useEffect(() => {
    setLogoUrl(null);
    if (hasResult && productionName && !isSearching && companyName) {
      setLogoLoading(true);
      fetchCompanyLogo(companyName)
        .then((url) => {
          const backendBase = getBackendBaseUrl();
          setLogoUrl(`${backendBase}/proxy-image?url=${encodeURIComponent(url)}`);
        })
        .catch((error) => {
          console.error("Logo fetch error:", error);
        })
        .finally(() => setLogoLoading(false));
    }
  }, [hasResult, productionName, isSearching, companyName]);

  // When status becomes "Done", signal that production search is complete
  useEffect(() => {
    if (status === "Done" && productionName && setProdSearchComplete) {
      setProdSearchComplete(true);
    } else if (isSearching && setProdSearchComplete) {
      // Reset when a new search starts
      setProdSearchComplete(false);
    }
  }, [status, productionName, isSearching, setProdSearchComplete]);

  return (
    <Card>
      <CardContent className="p-4 text-base">
        <h3 className="font-semibold text-lg mb-2">Production</h3>
        <div className="flex items-center mt-2">
          {/* Status Light */}
          <span>
            {hasResult && productionName && !isSearching ? (
              <span
                className={statusLightClasses.done}
                aria-label="Done"
              ></span>
            ) : (
              <motion.span
                className={isSearching ? statusLightClasses.working : statusLightClasses.waitingProduction}
                aria-label={isSearching ? "Blue light" : "Amber light"}
                animate={isSearching ? statusLightAnimations.working.animate : statusLightAnimations.waiting.animate}
                transition={isSearching ? statusLightAnimations.working.transition : statusLightAnimations.waiting.transition}
              ></motion.span>
            )}
          </span>
          {/* Status Text */}
          <span
            className={
              status === "Done"
                ? statusTextClasses.done
                : status === "Researching"
                  ? statusTextClasses.working
                  : statusTextClasses.waitingProduction
            }
          >
            {status}
            {status === "Waiting" && (
              <span className="ml-1 flex" style={{ alignItems: 'flex-start', marginTop: '-0.7em' }}>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={dotVariants}
                    animate="animate"
                    className="font-bold text-2xl"
                    style={{ marginLeft: "0.1em", marginRight: "0.1em" }}
                  >
                    .
                  </motion.span>
                ))}
              </span>
            )}
          </span>
        </div>
        {/* Move prdWork/prdWait image below status info and make it bigger */}
        {(status === "Researching" || status === "Waiting") && (
          <div className="w-full flex justify-center mt-4">
            <img
              src={status === "Researching" ? prdWork : prdWait}
              alt={status === "Researching" ? "Working" : "Waiting"}
              className="h-24 w-auto"
              style={{ maxWidth: 135 }}
            />
          </div>
        )}
        {/* Show production and company/network info */}
        {status === "Done" && productionName && (
          <div style={{ marginTop: '24px' }}>
            {productionName && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <strong>Name: </strong>
                  <span style={{ marginLeft: '8px' }}>
                    {productionName.startsWith('Maybe: ') ? (
                      <>
                        <em style={{ color: '#6b7280' }}>Maybe: </em>
                        {productionName.replace('Maybe: ', '')}
                      </>
                    ) : (
                      productionName
                    )}
                  </span>
                </div>
                {/* Show confidence level for speculative results */}
                {(productionName.startsWith('Maybe: ') || isSpeculative) && confidence && (
                  <div style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    marginLeft: '8px',
                    fontStyle: 'italic'
                  }}>
                    Confidence: {confidence}
                  </div>
                )}
              </div>
            )}
            {companyName && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '48px' }}>
                {logoLoading ? (
                  <span style={{ color: '#9ca3af', fontSize: '12px' }}>Loading logo...</span>
                ) : (
                  logoUrl && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <img
                        src={logoUrl}
                        alt={`${companyName} logo`}
                        style={{
                          height: '80px',
                          width: 'auto',
                          objectFit: 'contain',
                          backgroundColor: 'white',
                          borderRadius: '4px',
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                          maxWidth: '150px'
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

      </CardContent>
    </Card>
  );
}