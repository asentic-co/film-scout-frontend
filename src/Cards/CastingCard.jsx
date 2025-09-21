import React, { useEffect, useState, useMemo, useCallback } from "react";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import { motion } from "framer-motion";
import castWaitImg from "../assets/cast-wait.png";
import castWorkImg from "../assets/cast-work.png";
import { getCastForProduction } from "../utils/inferActorsClient.js";
import { fetchActorImage } from "../utils/actorImageClient.js";
import { statusLightAnimations, statusLightClasses, statusTextClasses } from "../styles/statusLightConfig";
import "../styles/StatusLight.css";

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

const MIN_WORK_MS = 3000;

const getProductionName = (productionRecord) => {
  if (!productionRecord) return null;
  if (typeof productionRecord.productionName === "string")
    return productionRecord.productionName;
  // Handle nested productionName
  if (
    productionRecord.productionName &&
    typeof productionRecord.productionName.productionName === "string"
  )
    return productionRecord.productionName.productionName;
  if (typeof productionRecord === "string") return productionRecord;
  return null;
};

const CastingCard = ({ productionRecord, isSearching, prodSearchComplete, setCastingComplete }) => {
  const [cast, setCast] = useState([]);
  const [status, setStatus] = useState("waiting");

  // Memoize the production name to prevent unnecessary re-renders
  const productionName = useMemo(() => {
    return getProductionName(productionRecord);
  }, [productionRecord?.productionName, productionRecord]);

  // Memoize the production record for the API call
  const stableProductionRecord = useMemo(() => productionRecord, [productionName]);

  useEffect(() => {
    // console.log('CastingCard effect triggered:', {
    //   productionName,
    //   isSearching,
    //   prodSearchComplete
    // });

    let workTimeout;
    let isMounted = true;

    setCast([]);

    // Wait for production search to complete
    if (isSearching || !prodSearchComplete) {
      setStatus("waiting");
      return () => {
        isMounted = false;
        if (workTimeout) clearTimeout(workTimeout);
      };
    }

    // Production search is complete: show "Working" for 3s, then search
    setStatus("working");
    workTimeout = setTimeout(async () => {
      if (!isMounted) return;
      getCastForProduction(productionName, stableProductionRecord)
        .then(async (castList) => {
          // Ensure castList is an array
          const castArray = Array.isArray(castList) ? castList : [];

          const slicedCast = castArray.slice(0, 3);

          const castWithImages = await Promise.all(
            slicedCast.map(async (name, idx) => {
              try {
                const image = await fetchActorImage(name);
                return {
                  id: `${name}-${idx}`,
                  name,
                  image,
                };
              } catch (error) {
                console.warn(`Failed to fetch image for actor ${name}:`, error);
                // Return actor without image rather than failing entirely
                return {
                  id: `${name}-${idx}`,
                  name,
                  image: null,
                };
              }
            })
          );
          if (isMounted) {
            setCast(castWithImages);
            setStatus("done");
            // Signal that casting is complete
            if (setCastingComplete) {
              setCastingComplete(true);
            }
          }
        })
        .catch(() => {
          if (isMounted) {
            setStatus("done");
            // Signal that casting is complete even if there was an error
            if (setCastingComplete) {
              setCastingComplete(true);
            }
          }
        });
    }, MIN_WORK_MS);

    return () => {
      isMounted = false;
      if (workTimeout) clearTimeout(workTimeout);
    };
  }, [productionName, isSearching, prodSearchComplete, stableProductionRecord]);

  return (
    <Card>
      <CardContent className="p-4 h-full flex flex-col text-base">
        <h3 className="font-semibold text-lg mb-2">Casting</h3>
        <div className="flex items-center mt-2">
          {/* Status Light */}
          {status === "done" ? (
            <span
              className={statusLightClasses.done}
              aria-label="Done"
            ></span>
          ) : (
            <motion.span
              className={status === "working" ? statusLightClasses.working : statusLightClasses.waitingCasting}
              aria-label={status === "working" ? "Blue light" : "Aqua light"}
              animate={status === "working" ? statusLightAnimations.working.animate : statusLightAnimations.waiting.animate}
              transition={status === "working" ? statusLightAnimations.working.transition : statusLightAnimations.waiting.transition}
            ></motion.span>
          )}
          {/* Status Text */}
          <span
            className={
              status === "done"
                ? statusTextClasses.done
                : status === "working"
                  ? statusTextClasses.working
                  : statusTextClasses.waitingCasting
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === "waiting" && (
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
        {/* Show status image below status info for waiting/working, then cast list when done */}
        {(status === "working" || status === "waiting") && (
          <div className="w-full flex justify-center mt-4">
            <img
              src={status === "working" ? castWorkImg : castWaitImg}
              alt={status === "working" ? "Working" : "Waiting"}
              className="h-24 w-auto"
              style={{ maxWidth: 135 }}
            />
          </div>
        )}
        {/* Cast List */}
        {status === "done" && (
          <>
            <div className="mt-4">
              <ul className="flex flex-col gap-3">
                {cast.length === 0 ? (
                  <li className="text-gray-400 italic">No cast found.</li>
                ) : (
                  cast.map((actor) => (
                    <li key={actor.id} className="flex items-center">
                      {actor.image ? (
                        <img
                          src={actor.image}
                          alt={actor.name}
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginRight: 10,
                            display: "block",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            backgroundColor: "#e5e7eb",
                            borderRadius: "50%",
                            marginRight: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#6b7280",
                            fontWeight: "bold",
                            flexShrink: 0,
                          }}
                        >
                          {actor.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span
                        style={{
                          display: "inline-block",
                          verticalAlign: "middle",
                          lineHeight: "20px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {actor.name}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CastingCard;