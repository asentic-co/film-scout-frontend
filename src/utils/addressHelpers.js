export function toMixedCase(str) {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function abbreviateStreetType(str) {
  return str
    .replace(/\bAvenue\b/i, "Ave")
    .replace(/\bStreet\b/i, "St")
    .replace(/\bRoad\b/i, "Rd")
    .replace(/\bBoulevard\b/i, "Blvd")
    .replace(/\bDrive\b/i, "Dr")
    .replace(/\bLane\b/i, "Ln")
    .replace(/\bCourt\b/i, "Ct")
    .replace(/\bPlace\b/i, "Pl")
    .replace(/\bTerrace\b/i, "Ter")
    .replace(/\bParkway\b/i, "Pkwy")
    .replace(/\bCircle\b/i, "Cir")
    .replace(/\bWay\b/i, "Way")
    .replace(/\bPlaza\b/i, "Plz")
    .replace(/\bSquare\b/i, "Sq")
    .replace(/\bAlley\b/i, "Aly")
    .replace(/\bHighway\b/i, "Hwy")
    .replace(/\bExpressway\b/i, "Expwy")
    .replace(/\bBroadway\b/i, "Broadway");
}

export function addOrdinal(numStr) {
  const num = parseInt(numStr, 10);
  if (isNaN(num)) return numStr;
  const j = num % 10,
    k = num % 100;
  if (j === 1 && k !== 11) return num + "st";
  if (j === 2 && k !== 12) return num + "nd";
  if (j === 3 && k !== 13) return num + "rd";
  return num + "th";
}

export function abbreviateDirection(str) {
  return str
    .replace(/\bWest\b/i, "W")
    .replace(/\bEast\b/i, "E")
    .replace(/\bNorth\b/i, "N")
    .replace(/\bSouth\b/i, "S");
}

export function prettifyStreet(str) {
  str = str.trim();
  str = str.replace(/^(\d+)\b/, (m, n) => addOrdinal(n));
  str = abbreviateDirection(str);
  str = toMixedCase(str);
  str = abbreviateStreetType(str);
  str = str.replace(/\b(Tenth|Eleventh|Twelfth|Thirteenth|Fourteenth|Fifteenth|Sixteenth|Seventeenth|Eighteenth|Nineteenth|Twentieth)\b/gi, (match) => {
    const map = {
      Tenth: "10th",
      Eleventh: "11th",
      Twelfth: "12th",
      Thirteenth: "13th",
      Fourteenth: "14th",
      Fifteenth: "15th",
      Sixteenth: "16th",
      Seventeenth: "17th",
      Eighteenth: "18th",
      Nineteenth: "19th",
      Twentieth: "20th"
    };
    return map[match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()] || match;
  });
  return str;
}

export function simplifyParkingHeld(parkingHeldRaw) {
  if (!parkingHeldRaw) return "N/A";
  const first = parkingHeldRaw.split(",")[0];
  const match = first.match(/^(.*?)\s+between\s+(.*?)\s+and\s+(.*)$/i);
  if (match) {
    let main = prettifyStreet(match[1]);
    let street1 = prettifyStreet(match[2]);
    let street2 = prettifyStreet(match[3]);
    const streetTypeMatch1 = street1.match(/\b(Ave|St|Rd|Blvd|Dr|Ln|Ct|Pl|Ter|Pkwy|Cir|Sq|Aly|Hwy|Expwy|Plz)\b/i);
    const streetTypeMatch2 = street2.match(/\b(Ave|St|Rd|Blvd|Dr|Ln|Ct|Pl|Ter|Pkwy|Cir|Sq|Aly|Hwy|Expwy|Plz)\b/i);

    if (
      streetTypeMatch1 &&
      streetTypeMatch2 &&
      streetTypeMatch1[0].toLowerCase() === streetTypeMatch2[0].toLowerCase()
    ) {
      street1 = street1.replace(/\b(Ave|St|Rd|Blvd|Dr|Ln|Ct|Pl|Ter|Pkwy|Cir|Sq|Aly|Hwy|Expwy|Plz)\b/i, "").trim();
      return `${main} & ${street1}/${street2}`;
    }
    return `${main} & ${street1} / ${street2}`;
  }
  return prettifyStreet(first.trim());
}

// Popular neighborhood shorthand mapping
const neighborhoodMap = {
  "fidi": "Financial District",
  "financial district": "Financial District",
  "uws": "Upper West Side",
  "upper west side": "Upper West Side",
  "ues": "Upper East Side",
  "upper east side": "Upper East Side",
  "midtown": "Midtown",
  "midtown east": "Midtown East",
  "midtown west": "Midtown West",
  "soho": "SoHo",
  "nolita": "NoLita",
  "nomad": "NoMad",
  "tribeca": "Tribeca",
  "bk": "Brooklyn",
  "williamsburg": "Williamsburg",
  "greenpoint": "Greenpoint",
  "bed stuy": "Bedford-Stuyvesant",
  "bed-stuy": "Bedford-Stuyvesant",
  "bedford-stuyvesant": "Bedford-Stuyvesant",
  "astoria": "Astoria",
  "lic": "Long Island City",
  "long island city": "Long Island City",
  "harlem": "Harlem",
  "east harlem": "East Harlem",
  "west village": "West Village",
  "east village": "East Village",
  "chinatown": "Chinatown",
  "bk heights": "Brooklyn Heights",
  "brooklyn heights": "Brooklyn Heights",
  "dtbk": "Downtown Brooklyn",
  "downtown brooklyn": "Downtown Brooklyn",
  "dumbo": "DUMBO",
  "hells kitchen": "Hell's Kitchen",
  "hell's kitchen": "Hell's Kitchen",
  "k-town": "K-Town",
    "k town": "K-Town",
  "kips bay": "Kips Bay",
  "flatiron": "Flatiron",
  "murray hill": "Murray Hill",
  "gramercy": "Gramercy",
  "east harlem": "East Harlem",
  "west harlem": "West Harlem",
  "washington heights": "Washington Heights",
  "inwood": "Inwood",
  "stuyvesant town": "Stuyvesant Town",
  "stuy town": "Stuyvesant Town",
};

export function prettifyNeighborhood(str) {
  if (!str) return "";
  const normalized = str.trim().toLowerCase();
  // Try direct match
  if (neighborhoodMap[normalized]) {
    return neighborhoodMap[normalized];
  }
  // Try removing spaces and match (e.g., "uws" vs "u w s")
  const compact = normalized.replace(/\s+/g, "");
  if (neighborhoodMap[compact]) {
    return neighborhoodMap[compact];
  }
  // Default: mixed case
  return toMixedCase(str.trim());
}