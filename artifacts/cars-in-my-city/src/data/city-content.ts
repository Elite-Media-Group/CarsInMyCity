import type { City, Climate, Culture } from "./cities";

export const STATE_REGS: Record<string, string> = {
  "alabama": "Alabama requires title transfer within 20 days at your local County Judge of Probate office. No statewide emissions testing is required.",
  "alaska": "Alaska title transfers must occur within 30 days at a DMV office. No emissions testing requirement, but vehicles need a safety inspection for registration.",
  "arizona": "Arizona requires title transfer within 15 days. Maricopa and Pima counties require emissions testing for most vehicles; rural counties are exempt.",
  "arkansas": "Arkansas title transfer must occur within 30 days at your county revenue office. No statewide emissions testing requirement.",
  "california": "California requires a smog certification on most used vehicles (4+ years old, under 175k miles) and title transfer at the DMV within 10 days. CARB emissions standards are the strictest in the nation.",
  "colorado": "Colorado requires title transfer within 60 days. Denver metro, Boulder, and Weld counties require emissions testing every other year for most vehicles.",
  "connecticut": "Connecticut requires title transfer within 60 days at the DMV. Emissions testing is required every two years for vehicles 1975 and newer.",
  "delaware": "Delaware requires title transfer within 30 days at the DMV. No emissions testing is required — an advantage that attracts buyers from neighboring states.",
  "florida": "Florida requires title transfer within 30 days at the county tax collector's office. No state income tax and no emissions testing make Florida one of the most car-buyer-friendly states.",
  "georgia": "Georgia requires title transfer within 30 days. The Atlanta metro area requires annual emissions testing; most rural counties are exempt.",
  "hawaii": "Hawaii requires title transfer within 30 days at a county DMV office. Annual safety inspections are mandatory, and emissions testing is required on Oahu for vehicles 1977 and newer.",
  "idaho": "Idaho requires title transfer within 30 days. Ada County requires emissions testing; other counties are exempt. Idaho has relatively low registration fees.",
  "illinois": "Illinois requires title transfer within 30 days. Emissions testing is required in the Chicago metro area and certain downstate counties for vehicles 4–7 years old.",
  "indiana": "Indiana requires title transfer within 31 days. No statewide emissions testing requirement, though Lake County near Chicago has local air quality programs.",
  "iowa": "Iowa requires title transfer within 30 days at the county treasurer's office. No emissions testing is required statewide.",
  "kansas": "Kansas requires title transfer within 60 days at the county treasurer's office. No statewide emissions testing, though the Johnson County metro area follows stricter standards.",
  "kentucky": "Kentucky requires title transfer within 15 days. No statewide emissions testing, though Jefferson County has local air quality programs.",
  "louisiana": "Louisiana requires title transfer within 40 days at the OMV (Office of Motor Vehicles). No statewide emissions testing requirement.",
  "maine": "Maine requires title transfer within 30 days at the BMV. Annual safety inspections are required; emissions testing is part of the inspection for most gasoline vehicles.",
  "maryland": "Maryland requires title transfer within 60 days at the MVA. Emissions testing is required every two years for most gasoline-powered vehicles.",
  "massachusetts": "Massachusetts requires title transfer within 10 days at the RMV. Annual safety inspections and biennial emissions testing are required for most gasoline vehicles.",
  "michigan": "Michigan requires title transfer within 15 days at the Secretary of State office. No statewide emissions testing requirement.",
  "minnesota": "Minnesota requires title transfer within 10 days. No statewide emissions testing requirement, though the Twin Cities metro has voluntary air quality programs.",
  "mississippi": "Mississippi requires title transfer within 7 days at the county tax collector. No statewide emissions testing requirement.",
  "missouri": "Missouri requires title transfer within 30 days. Emissions testing is required in St. Louis and Kansas City metro areas for vehicles under 10 years old.",
  "montana": "Montana has no state sales tax on vehicle purchases and no emissions testing requirement. Title transfer is required within 60 days.",
  "nebraska": "Nebraska requires title transfer within 30 days at the county treasurer's office. No statewide emissions testing requirement.",
  "nevada": "Nevada requires title transfer within 30 days. Clark County (Las Vegas) requires biennial emissions testing for most vehicles; Washoe County has similar requirements.",
  "new-hampshire": "New Hampshire requires title transfer within 30 days. Annual safety inspections are required, with emissions testing included for 1996+ gasoline vehicles. No state sales tax.",
  "new-jersey": "New Jersey requires title transfer within 10 days at the DMV. Biennial emissions testing is required for most gasoline vehicles.",
  "new-mexico": "New Mexico requires title transfer within 30 days at the MVD. Bernalillo County (Albuquerque) requires emissions testing every two years.",
  "new-york": "New York requires title transfer within 30 days at the DMV. Annual safety and emissions inspections are required for all registered vehicles.",
  "north-carolina": "North Carolina requires title transfer within 28 days at the DMV. Annual safety and emissions inspections are required in 48 counties, primarily in urban areas.",
  "north-dakota": "North Dakota requires title transfer within 30 days. No emissions testing and no state vehicle inspection requirement.",
  "ohio": "Ohio requires title transfer within 30 days at the county title office. No statewide emissions testing, though some counties in the Cleveland and Cincinnati metros have local programs.",
  "oklahoma": "Oklahoma requires title transfer within 30 days at the county tag office. No statewide emissions testing requirement.",
  "oregon": "Oregon requires title transfer within 30 days. Portland metro, Medford, and Grants Pass areas require biennial emissions testing (DEQ).",
  "pennsylvania": "Pennsylvania requires title transfer within 10 days at the DMV. Annual safety inspections and biennial emissions testing are required for most vehicles.",
  "rhode-island": "Rhode Island requires title transfer within 10 days at the DMV. Biennial safety and emissions inspections are required.",
  "south-carolina": "South Carolina requires title transfer within 45 days at the SCDMV. No statewide emissions testing requirement, and the state's low vehicle property tax is a significant advantage.",
  "south-dakota": "South Dakota has no state income tax, no vehicle emissions testing, and a 4% state excise tax on vehicle purchases. Title transfer is required within 30 days.",
  "tennessee": "Tennessee requires title transfer within 30 days at the county clerk's office. Emissions testing is required in Davidson and Shelby County metros.",
  "texas": "Texas requires title transfer within 30 days at the county tax office. Safety inspections are required annually; emissions testing applies in DFW, Houston, and El Paso metro areas.",
  "utah": "Utah requires title transfer within 30 days. The Wasatch Front (Salt Lake, Davis, Utah, Weber counties) requires biennial emissions testing for most vehicles.",
  "vermont": "Vermont requires title transfer within 30 days at the DMV. Annual safety inspections and biennial emissions tests are required for most vehicles.",
  "virginia": "Virginia requires title transfer within 30 days at the DMV. Annual safety inspections are required; biennial emissions testing applies in Northern Virginia, Richmond, and Hampton Roads metro areas.",
  "washington": "Washington requires title transfer within 15 days. No statewide emissions testing program; annual safety inspections are not required.",
  "west-virginia": "West Virginia requires title transfer within 30 days at the DMV. Annual safety and emissions inspections are required for all registered vehicles.",
  "wisconsin": "Wisconsin requires title transfer within 7 days at the DMV. Biennial emissions testing is required in the Milwaukee and Madison metro areas.",
  "wyoming": "Wyoming has no state income tax and no vehicle emissions testing requirement. Title transfer is required within 30 days at the county clerk's office.",
};

interface ClimateContent {
  label: string;
  intro: string;
  carRec: string;
  checkTip: string;
  popularTypes: string[];
}

export const CLIMATE_CONTENT: Record<Climate, ClimateContent> = {
  "hot-dry": {
    label: "Hot & Dry Desert",
    intro: "With intense sun, scorching summers, and minimal rainfall",
    carRec: "In the desert heat, prioritize vehicles with reliable air conditioning, UV-resistant interiors, and engines rated for high-temperature performance. Light-colored vehicles run noticeably cooler, and vehicles with excellent cooling systems are worth the premium.",
    checkTip: "On any used vehicle, test the AC on full blast, inspect rubber seals for heat cracking, and carefully check coolant levels and radiator condition.",
    popularTypes: ["Toyota Camry", "Honda CR-V", "Ford F-150", "Jeep Grand Cherokee"],
  },
  "hot-humid": {
    label: "Hot & Humid",
    intro: "With hot summers, high humidity, and occasional severe weather",
    carRec: "SUVs, trucks, and minivans are popular for family transportation, with four-wheel drive valued during heavy rain season. AC reliability is non-negotiable, and flood damage history is a critical inspection point — particularly near coastal or low-lying areas.",
    checkTip: "Inspect the undercarriage for flood damage signs (mud behind panels, rust in unusual places) and test all AC components on their highest setting.",
    popularTypes: ["Ford F-150", "Chevrolet Silverado", "Toyota RAV4", "Honda Pilot"],
  },
  "mild": {
    label: "Mild Year-Round",
    intro: "With mild year-round temperatures and moderate rainfall",
    carRec: "The forgiving climate means almost any vehicle type performs well here. Buyers often prioritize fuel efficiency for urban commutes, and hybrids and EVs are more common in mild-climate cities than almost anywhere else in the country.",
    checkTip: "In areas with rain, check windshield wipers, tire tread depth, and brake pad wear — moisture takes its toll even in mild climates, and rust can appear on brake rotors.",
    popularTypes: ["Toyota Prius", "Tesla Model 3", "Honda Civic", "Subaru Outback"],
  },
  "cold": {
    label: "Cold Winters",
    intro: "With harsh winters, heavy snow, and extended cold spells",
    carRec: "AWD or 4WD is practically essential for winter driving here. Heated seats, remote start, and winter-package options add real-world value. Rust from road salt is a major concern — inspect the undercarriage carefully on any vehicle that has spent winters in this region.",
    checkTip: "Always inspect the undercarriage for salt-induced rust, check the 4WD/AWD system function, and verify the battery is rated for cold-weather starting (-20°F or lower).",
    popularTypes: ["Subaru Outback", "Toyota RAV4 AWD", "Ford F-150 4WD", "Jeep Grand Cherokee 4x4"],
  },
  "mountain": {
    label: "Mountain & High Altitude",
    intro: "With high altitudes, dramatic seasonal swings, and mountain terrain",
    carRec: "AWD and 4WD are important for snowy mountain passes, and ground clearance matters on unpaved mountain roads. Modern fuel-injected engines adjust automatically to altitude, but transmission and brake systems face extra stress on steep descents.",
    checkTip: "Test the 4WD/AWD system thoroughly, check transmission and brake wear for mountain driving stress, and inspect cooling system capacity.",
    popularTypes: ["Toyota 4Runner", "Jeep Wrangler", "Subaru Forester AWD", "Ram 2500 4WD"],
  },
  "coastal": {
    label: "Coastal",
    intro: "With coastal conditions, salt air, and seasonal weather events",
    carRec: "Salt air accelerates corrosion, making undercarriage condition especially important in coastal markets. Many local buyers prefer SUVs and trucks with decent ground clearance for beach access and weather events, alongside reliable AC for the humidity.",
    checkTip: "Inspect all metal components for salt corrosion, check wheel wells and exhaust systems carefully, and look for signs of flood or storm damage.",
    popularTypes: ["Toyota Tacoma 4WD", "Ford F-150", "Chevrolet Suburban", "Jeep Wrangler Unlimited"],
  },
};

export const CULTURE_CONTENT: Record<Culture, string> = {
  "truck": "Trucks are the dominant vehicle in this market — full-size pickups routinely outsell all other segments combined. Whether for work, weekend adventures, or simply tradition, a well-specced truck holds its value well here and is always in demand.",
  "commuter": "This is a commuter-driven market where fuel economy, reliability, and low maintenance costs are the top priorities. Compact sedans, reliable Japanese brands, and increasingly hybrid crossovers dominate the for-sale listings.",
  "luxury": "This market skews toward premium vehicles — BMW, Mercedes-Benz, Lexus, and Audi appear frequently in local listings. Certified pre-owned programs from these brands can offer compelling value compared to buying brand-new.",
  "outdoor": "Adventure-ready vehicles dominate here — lifted Jeeps, off-road-equipped trucks, and all-wheel-drive SUVs with roof racks and tow hitches. Buyers in this market often know their vehicles well and maintain them meticulously.",
  "urban": "Dense urban driving means compact cars, plug-in hybrids, and EVs are highly valued. Parking is at a premium, so smaller footprints are a genuine plus. Many buyers are looking to reduce car ownership costs without giving up flexibility.",
  "mixed": "This market has something for everyone — a healthy mix of trucks and SUVs in the suburbs, fuel-efficient commuters near downtown, and work vehicles in outlying areas. Prices and selection are generally broad, giving buyers good negotiating leverage.",
};

interface GeneratedContent {
  pageTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  whyBuySection: string;
  carRecSection: string;
  stateRegSection: string;
  hoodSection: string;
  faqs: { q: string; a: string }[];
  jsonLd: Record<string, unknown>[];
}

function formatPop(pop: number): string {
  if (pop >= 1000000) return `${(pop / 1000000).toFixed(1)} million`;
  if (pop >= 100000) return `${Math.round(pop / 1000)}k`;
  return pop.toLocaleString();
}

function priceRange(pop: number, culture: Culture): string {
  if (culture === "luxury") return "$20,000–$55,000";
  if (pop > 500000) return "$12,000–$35,000";
  if (pop > 150000) return "$8,000–$28,000";
  return "$6,000–$22,000";
}

function marketDesc(pop: number): string {
  if (pop > 1000000) return "one of the largest used car markets in the country";
  if (pop > 500000) return "one of the largest used car markets in the state";
  if (pop > 200000) return "a substantial regional used car market";
  if (pop > 100000) return "an active mid-size used car market";
  return "a close-knit community market";
}

export function generateCityContent(city: City): GeneratedContent {
  const climate = CLIMATE_CONTENT[city.climate];
  const culture = CULTURE_CONTENT[city.culture];
  const stateReg = STATE_REGS[city.stateSlug] ?? `${city.state} requires title transfer at the state DMV within 30 days of purchase.`;
  const popStr = formatPop(city.pop);
  const prices = priceRange(city.pop, city.culture);
  const market = marketDesc(city.pop);

  const pageTitle = `Used Cars for Sale in ${city.city}, ${city.stateAbbr} | CarsInMyCity`;
  const metaDescription = `Find used cars for sale in ${city.city}, ${city.state}. Browse trusted local listings from private sellers and dealers in the ${city.city} metro area. Buy or sell your car locally on CarsInMyCity.`;
  const h1 = `Used Cars for Sale in ${city.city}, ${city.state}`;

  const intro = `${city.city}, ${city.state} (population ${popStr}) is ${market} — and CarsInMyCity connects local buyers and sellers across every neighborhood from ${city.hoods[0]} to ${city.hoods[city.hoods.length - 1]}. ${climate.intro}, ${city.city} drivers have specific needs that national marketplaces often overlook. ${city.insight}`;

  const whyBuySection = `Buying locally in ${city.city} means you can inspect the vehicle in person before committing, negotiate face-to-face, and understand the car's actual local history. ${culture} When you search on CarsInMyCity, every listing is tied to a real ${city.city}-area seller — no out-of-state inventory padded in to boost search results.`;

  const carRecSection = `${climate.carRec} The most popular used vehicle types among ${city.city} buyers include ${climate.popularTypes.join(", ")}. ${climate.checkTip}`;

  const stateRegSection = `${stateReg} Before purchasing any used vehicle in ${city.city}, verify the title is clean (no liens, salvage, or flood brands) using the National Motor Vehicle Title Information System (NMVTIS) or a paid service like Carfax.`;

  const hoodSection = `${city.city}'s used car listings span the full metro area, including ${city.hoods.join(", ")}. Private sellers in residential neighborhoods like ${city.hoods[0]} and ${city.hoods[1]} often offer better prices than dealers, while the commercial corridors near ${city.hoods[2]} typically have the highest density of franchise and independent dealer inventory.`;

  const avgPrice = city.culture === "luxury" ? "$32,000" : city.pop > 500000 ? "$22,000" : "$16,500";

  const faqs: { q: string; a: string }[] = [
    {
      q: `How much does a used car cost in ${city.city}, ${city.stateAbbr}?`,
      a: `Used car prices in ${city.city} typically range from ${prices}, depending on make, model, year, and condition. ${city.culture === "luxury" ? `The ${city.city} market skews toward premium vehicles, so expect above-average pricing for brands like BMW, Mercedes-Benz, and Lexus.` : city.culture === "truck" ? `Trucks command a premium in ${city.city} — a well-equipped late-model full-size truck can easily exceed $35,000.` : `Competitive dealer markets in the ${city.city} metro generally keep prices in line with regional averages.`} The average used vehicle listed in the ${city.city} area sells for approximately ${avgPrice}.`,
    },
    {
      q: `What are the most popular used cars in ${city.city}?`,
      a: `In ${city.city}'s ${climate.label.toLowerCase()} climate, the most sought-after used vehicles are ${climate.popularTypes.join(", ")}. ${city.culture === "truck" ? `Full-size trucks from Ford, GM, and Ram dominate the market here.` : city.culture === "outdoor" ? `Off-road capable vehicles like the Toyota 4Runner and Jeep Wrangler hold their value especially well in ${city.city}.` : city.culture === "urban" ? `Compact and fuel-efficient models are preferred by city residents in ${city.city} who deal with parking constraints.` : `Reliable, practical vehicles from Toyota, Honda, and Subaru consistently rank among the top sellers in ${city.city}.`}`,
    },
    {
      q: `Do I need a vehicle inspection when buying a used car in ${city.state}?`,
      a: `${stateReg} Regardless of state requirements, CarsInMyCity strongly recommends a pre-purchase inspection (PPI) from an independent mechanic before completing any used car purchase. A PPI typically costs $100–$150 and can reveal hidden issues that protect you from expensive surprises.`,
    },
    {
      q: `Which neighborhoods in ${city.city} have the best used car listings?`,
      a: `${city.city}'s used car market is active across ${city.hoods.join(", ")}. ${city.hoods[0]} and ${city.hoods[1]} tend to have the strongest private seller listings, often from long-term residents with well-maintained vehicles. The dealer corridor near ${city.hoods[2]} offers the broadest selection of certified pre-owned and late-model inventory.`,
    },
    {
      q: `Is it better to buy from a dealer or private seller in ${city.city}?`,
      a: `Both options have advantages in ${city.city}. Private sellers in the ${city.city} metro typically price 10–20% below comparable dealer listings, and you can often negotiate directly with the owner who knows the vehicle's full history. Dealers offer financing, certified pre-owned warranties, and simpler paperwork — especially valuable for first-time buyers. CarsInMyCity connects you with both private sellers and local dealers in ${city.city} so you can compare and decide what works best for your situation.`,
    },
  ];

  const canonicalUrl = `https://carsinmycity.com/cities/${city.stateSlug}/${city.slug}`;

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: h1,
      description: metaDescription,
      url: canonicalUrl,
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://carsinmycity.com" },
          { "@type": "ListItem", position: 2, name: "Cities", item: "https://carsinmycity.com/cities" },
          { "@type": "ListItem", position: 3, name: city.state, item: `https://carsinmycity.com/cities/${city.stateSlug}` },
          { "@type": "ListItem", position: 4, name: city.city, item: canonicalUrl },
        ],
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".city-intro", ".city-faqs"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return { pageTitle, metaDescription, h1, intro, whyBuySection, carRecSection, stateRegSection, hoodSection, faqs, jsonLd };
}
