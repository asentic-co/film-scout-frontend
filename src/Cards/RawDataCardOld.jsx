import React, { useEffect, useState, useMemo } fr      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [record, isSearching, prodSearchComplete]);

return (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">{";
import {motion} from "framer-motion";
    import {formatDateRange} from "../utils/dateHelpers";
    import {simplifyParkingHeld} from "../utils/addressHelpers";

    const dotVariants = {
      animate: (i) => ({
      opacity: [0.2, 1, 0.2],
    scale: [1, 1.7, 1],
    transition: {
      repeat: Infinity,
    duration: 1.1,
    delay: i * 0.25,
    ease: "easeInOut",
    },
  }),
};

    const MIN_SEARCH_MS = 3000;

    export default function RawDataCard({record, isSearching, prodSearchComplete}) {
  const [status, setStatus] = useState("waiting");
    const [displayRecord, setDisplayRecord] = useState(null);

  useEffect(() => {
      let searchTimeout;
    let isMounted = true;

    setDisplayRecord(null);

    // Wait for production search to complete
    if (isSearching || !prodSearchComplete) {
      setStatus("waiting");
      return () => {
      isMounted = false;
    if (searchTimeout) clearTimeout(searchTimeout);
      };
    }

    // Production search is complete: show "Searching database" for 3s, then show results
    setStatus("searching");
    searchTimeout = setTimeout(() => {
      if (!isMounted) return;
    setDisplayRecord(record);
    setStatus("done");
    }, MIN_SEARCH_MS);

    return () => {
      isMounted = false;
    if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [record, isSearching, prodSearchComplete]);

    return (
    // console.log("RawDataCard received record:", record);

    return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-semibold text-lg mb-2">Permit Info</h3>

      {status === "waiting" && (
        <div className="text-gray-500 flex flex-col items-center">
          <div className="flex items-center mb-2">
            <motion.span
              className="inline-block rounded-full mr-3 border-2"
              style={{
                width: "1.7em",
                height: "1.7em",
                borderColor: "#06b6d4", // aqua
                backgroundColor: "#06b6d4",
                boxShadow: "0 0 18px 6px #06b6d4",
                borderRadius: "50em",
              }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            ></motion.span>
            <span className="flex items-center">
              Waiting
              <span className="ml-1 flex">
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
            </span>
          </div>
          <p>This panel will show filming information when a production is found.</p>
        </div>
      )}

      {status === "searching" && (
        <div className="text-blue-600 flex flex-col items-center">
          <div className="flex items-center mb-2">
            <motion.span
              className="inline-block rounded-full mr-3 border-2"
              style={{
                width: "1.7em",
                height: "1.7em",
                borderColor: "#2563eb", // blue
                backgroundColor: "#2563eb",
                boxShadow: "0 0 18px 6px #2563eb",
                borderRadius: "50em",
              }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            ></motion.span>
            <span className="flex items-center font-medium">
              Searching database
              <span className="ml-1 flex">
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
            </span>
          </div>
        </div>
      )}

      {status === "done" && (
        <>
          {displayRecord ? (
            <div className="text-left">
              <div>
                <strong>Event Type:</strong> {displayRecord.eventtype || ""}
              </div>
              <div>
                <strong>Category:</strong> {displayRecord.category || ""}
              </div>
              <div>
                <strong>Neighborhood:</strong> {displayRecord.neighborhood || ""}
              </div>
              <div>
                <strong>Location:</strong>{" "}
                {displayRecord.parkingheld ? simplifyParkingHeld(displayRecord.parkingheld) : ""}
              </div>
              <div>
                <strong>Active:</strong>{" "}
                {displayRecord.startdatetime && displayRecord.enddatetime
                  ? formatDateRange(displayRecord.startdatetime, displayRecord.enddatetime)
                  : ""}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">
              <p>This panel will show filming information when a production is found.</p>
              <div className="mt-2 flex justify-center">
                <img
                  src="../src/assets/nyc-open-data-logo.svg"
                  alt="NYC Open Data Logo"
                  style={{ width: "150px", height: "auto" }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
    );
}