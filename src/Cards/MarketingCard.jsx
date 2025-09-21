import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import { motion } from "framer-motion";
import mktWaitImg from "../assets/mkt-wait.png";
import mktWorkImg from "../assets/mkt-wk.png";
import { fetchProductionTeaser } from "../utils/prodTeaserClient";
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

  let name = null;

  if (typeof productionRecord.productionName === "string") {
    name = productionRecord.productionName;
  } else if (
    productionRecord.productionName &&
    typeof productionRecord.productionName.productionName === "string"
  ) {
    name = productionRecord.productionName.productionName;
  } else if (typeof productionRecord === "string") {
    name = productionRecord;
  }

  // Strip "Maybe: " prefix if present
  if (name && name.startsWith("Maybe: ")) {
    name = name.replace("Maybe: ", "");
  }

  return name;
};

const MarketingCard = ({ productionRecord, castingComplete = false }) => {
  const [teaser, setTeaser] = useState("");
  const [status, setStatus] = useState("waiting");

  // Extract production name
  const productionName = getProductionName(productionRecord);

  useEffect(() => {
    let workTimeout;
    let isMounted = true;

    setTeaser("");

    // Wait for casting to complete
    if (!castingComplete || !productionName) {
      setStatus("waiting");
      return () => {
        isMounted = false;
        if (workTimeout) clearTimeout(workTimeout);
      };
    }

    // Casting is complete: show "Working" for 3s, then fetch teaser
    setStatus("working");
    workTimeout = setTimeout(async () => {
      if (!isMounted) return;
      try {
        const teaserText = await fetchProductionTeaser(productionName);
        if (isMounted) {
          setTeaser(teaserText);
          setStatus("done");
        }
      } catch (error) {
        console.error("Error fetching teaser:", error);
        if (isMounted) {
          setTeaser("Unable to fetch production teaser at this time.");
          setStatus("done");
        }
      }
    }, MIN_WORK_MS);

    return () => {
      isMounted = false;
      if (workTimeout) clearTimeout(workTimeout);
    };
  }, [productionName, castingComplete]);

  return (
    <Card>
      <CardContent className="p-4 text-base">
        <h3 className="font-semibold text-lg mb-2">Marketing</h3>
        <div className="flex items-center mt-2">
          {/* Status Light */}
          {status === "done" ? (
            <span
              className={statusLightClasses.done}
              aria-label="Done"
            ></span>
          ) : (
            <motion.span
              className={status === "working" ? statusLightClasses.working : statusLightClasses.waitingMarketing}
              aria-label={status === "working" ? "Blue light" : "Pink light"}
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
                  : statusTextClasses.waitingMarketing
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
        {/* Show status image below status info for waiting/working, then teaser when done */}
        {(status === "working" || status === "waiting") && (
          <div className="w-full flex justify-center mt-4">
            <img
              src={status === "working" ? mktWorkImg : mktWaitImg}
              alt={status === "working" ? "Working" : "Waiting"}
              className="h-24 w-auto"
              style={{ maxWidth: 135 }}
            />
          </div>
        )}
        {/* Show teaser or error message below status row when done */}
        {status === "done" && (
          <blockquote
            className="mt-4 text-gray-800 italic border-l-4 border-purple-300 bg-purple-50 px-4 py-3 rounded-md shadow-sm"
            style={{ fontSize: '1.08em', fontFamily: 'Georgia, serif', lineHeight: 1.5 }}
          >
            {teaser}
          </blockquote>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketingCard;