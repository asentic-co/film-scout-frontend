import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDateRange } from "../utils/dateHelpers";
import { simplifyParkingHeld } from "../utils/addressHelpers";
import openDataLogo from "../assets/open-data-logo.svg";

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

export default function RawDataCard({ record, isSearching, setRawDataComplete }) {
    const [status, setStatus] = useState("waiting");
    const [displayRecord, setDisplayRecord] = useState(null);

    useEffect(() => {
        let searchTimeout;
        let isMounted = true;

        setDisplayRecord(null);

        // Wait for InfoCard search to complete (when a record is found)
        if (isSearching || !record) {
            setStatus("waiting");
            if (setRawDataComplete) setRawDataComplete(false); // Reset when waiting
            return () => {
                isMounted = false;
                if (searchTimeout) clearTimeout(searchTimeout);
            };
        }

        // InfoCard search is complete and we have a record: show "Searching database" for 3s, then show results
        setStatus("pause");
        searchTimeout = setTimeout(() => {
            if (!isMounted) return;
            setDisplayRecord(record);
            setStatus("done");
            if (setRawDataComplete) setRawDataComplete(true); // Signal that RawDataCard is done
        }, MIN_SEARCH_MS);

        return () => {
            isMounted = false;
            if (searchTimeout) clearTimeout(searchTimeout);
        };
    }, [record, isSearching, setRawDataComplete]);

    return (
        <div className="bg-white p-4 mb-4">
            <h3 className="font-semibold text-lg mb-2">Permit Info</h3>

            {/* Show placeholder only when truly waiting (no search in progress, no record) */}
            {status === "waiting" && !isSearching && !record && (
                <div className="text-gray-500 flex flex-col">
                    <p className="mb-4">Permit info will be displayed where available and the agents below will help with additional insights.</p>
                    <div className="flex justify-start">
                        <img
                            src={openDataLogo}
                            alt="NYC Open Data Logo"
                            style={{ width: "150px", height: "auto" }}
                        />
                    </div>
                </div>
            )}

            {/* Show "Searching database" when searching OR when in pause state */}
            {(isSearching || status === "pause") && (
                <div className="text-blue-600 flex flex-col">
                    <div className="flex items-center mb-2">
                        <span className="flex items-center font-medium">
                            Searching database
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
                                <strong>Type:</strong> {displayRecord.subcategoryname || ""}
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
                            <div className="mt-2 flex justify-start">
                                <img
                                    src={openDataLogo}
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
