export interface GuideSection {
  heading: string;
  body: string[];
  bullets?: string[];
}

export interface GuideTopic {
  slug: string;
  number: number;
  icon: "wallet" | "car" | "clipboard-check" | "gauge" | "shield-check";
  navLabel: string;
  question: string;
  shortAnswer: string;
  metaDescription: string;
  keywords: string[];
  sections: GuideSection[];
  faqs: { question: string; answer: string }[];
}

export interface SellingGuideTopic {
  slug: string;
  number: number;
  icon: "sparkles" | "camera" | "tag" | "file-text" | "handshake";
  navLabel: string;
  question: string;
  shortAnswer: string;
  metaDescription: string;
  keywords: string[];
  sections: GuideSection[];
  faqs: { question: string; answer: string }[];
}

export const sellingGuideTopics: SellingGuideTopic[] = [
  {
    slug: "prep-the-car",
    number: 1,
    icon: "sparkles",
    navLabel: "Prep the Car",
    question: "How should you prep your car before selling it?",
    shortAnswer:
      "A clean, well-presented car sells faster and for more money because buyers read cleanliness as a signal of good maintenance. Invest in a professional detail (or a thorough weekend clean) and fix cheap cosmetic issues before you list — every dollar spent here typically returns more in the final sale price.",
    metaDescription:
      "How to prep your car before selling it privately: detailing tips, which cheap cosmetic fixes are worth doing, and what to gather before you list.",
    keywords: ["how to prep a car for sale", "detail car before selling", "sell my car checklist", "car selling prep"],
    sections: [
      {
        heading: "Detail it like you mean it",
        body: [
          "A professional detail ($100-$250 depending on your area) typically pays for itself many times over in a faster sale and a higher final price. If you're doing it yourself, don't stop at a quick vacuum — shampoo the carpets and seats, clean the headliner, degrease the engine bay, and clay-bar and wax the paint so it photographs well.",
        ],
      },
      {
        heading: "Fix the cheap, obvious stuff",
        body: [
          "Buyers fixate on small, visible flaws even when they don't affect the car mechanically — a burnt-out taillight bulb or a cracked wiper blade can make a buyer wonder what else is neglected. Fix anything under about $50 before listing: bulbs, wipers, floor mats, minor touch-up paint on chips.",
        ],
      },
      {
        heading: "Gather your paperwork early",
        body: [
          "Have your title, maintenance records, and a recent vehicle history report ready before you list. Buyers who see organized documentation move faster and negotiate less aggressively, because it signals a well-cared-for car with nothing to hide.",
        ],
        bullets: [
          "Clean, physical title (or loan payoff information if still financed)",
          "Maintenance records — oil changes, tires, major repairs",
          "A vehicle history report (Carfax/AutoCheck) you can share proactively",
          "Current registration and, if applicable, smog/emissions certificate",
        ],
      },
    ],
    faqs: [
      {
        question: "Is it worth getting a car professionally detailed before selling it?",
        answer:
          "Yes, in almost every case. A $100-$250 professional detail typically returns more than its cost through a faster sale and a higher final price, since buyers strongly associate a clean car with a well-maintained one.",
      },
      {
        question: "What small repairs should I make before selling my car?",
        answer:
          "Fix anything cheap and visible — burnt-out bulbs, cracked wiper blades, minor paint chips, worn floor mats. These small details disproportionately affect a buyer's first impression relative to their actual repair cost.",
      },
      {
        question: "What documents do I need before listing my car for sale?",
        answer:
          "Have your clean title (or loan payoff details), maintenance records, a vehicle history report, and current registration ready. Sharing these proactively builds buyer trust and speeds up the sale.",
      },
    ],
  },
  {
    slug: "take-great-photos",
    number: 2,
    icon: "camera",
    navLabel: "Take Great Photos",
    question: "What makes a great car listing photo?",
    shortAnswer:
      "Great listing photos are the single biggest factor in getting clicks on your ad. Shoot during golden hour (just after sunrise or before sunset) in a clean, uncluttered location, and capture every angle a buyer would want to see — including honest shots of any flaws.",
    metaDescription:
      "How to take car listing photos that get more clicks: best lighting, must-have angles and shots, and why photographing flaws honestly actually helps you sell faster.",
    keywords: ["car listing photos", "how to photograph a car for sale", "sell car photo tips", "best car sale pictures"],
    sections: [
      {
        heading: "Lighting and location matter more than your camera",
        body: [
          "You don't need a professional camera — a modern phone is plenty. What matters is light: shoot during 'golden hour,' just after sunrise or before sunset, when soft light eliminates harsh shadows and makes paint look its best. Choose a clean, uncluttered backdrop — a quiet street or empty parking lot beats your driveway full of trash cans.",
        ],
      },
      {
        heading: "The shot list every listing needs",
        body: ["Buyers scroll past listings with only 2-3 photos. Aim for at least 12-15 covering:"],
        bullets: [
          "3/4 angle shots of the front and rear (the most flattering angle for most cars)",
          "Straight-on shots of all four sides",
          "Interior dashboard, wide shot showing the full cabin",
          "Front seats and rear seats separately",
          "Odometer showing current, accurate mileage",
          "Trunk/cargo area",
          "Any major flaws — honesty here saves everyone time later",
        ],
      },
      {
        heading: "Small details that build trust",
        body: [
          "Include a photo of the tire tread depth and the engine bay — buyers specifically look for these because sellers often skip them. Wipe down the interior and remove all personal items before shooting; a car full of clutter photographs as poorly maintained even if it isn't.",
        ],
      },
    ],
    faqs: [
      {
        question: "What time of day is best for taking car sale photos?",
        answer:
          "Golden hour — shortly after sunrise or before sunset — produces the most flattering light, softening shadows and making the paint and body lines look their best without harsh glare.",
      },
      {
        question: "How many photos should I include in a car listing?",
        answer:
          "Aim for 12-15 photos covering all exterior angles, the full interior, the odometer, the engine bay, and any existing flaws. Listings with more thorough photos consistently get more serious inquiries.",
      },
      {
        question: "Should I photograph damage or flaws on my car?",
        answer:
          "Yes. Photographing flaws honestly upfront filters out buyers who wouldn't be interested anyway and builds trust with serious buyers, which leads to faster, smoother transactions with fewer last-minute renegotiations.",
      },
    ],
  },
  {
    slug: "price-it-right",
    number: 3,
    icon: "tag",
    navLabel: "Price It Right",
    question: "How do you price a car to sell quickly and fairly?",
    shortAnswer:
      "Check similar, recently sold listings in your area — not just national averages — and price slightly above your absolute bottom line to leave room for negotiation. Pricing too high stalls your listing for weeks; pricing too low leaves money on the table.",
    metaDescription:
      "How to price your car for a fast, fair sale using local market comparisons, negotiation math, and signals that tell you when to adjust your asking price.",
    keywords: ["how to price a car for sale", "car pricing guide", "sell car fast pricing", "used car listing price"],
    sections: [
      {
        heading: "Use local, real data — not just national tools",
        body: [
          "Kelley Blue Book and Edmunds are a good starting point, but they reflect national averages, not what buyers in your specific area are actually paying right now. Cross-reference with active and recently sold listings on CarsInMyCity and other local marketplaces for your exact make, model, year, mileage, and trim.",
        ],
      },
      {
        heading: "Leave room to negotiate — but not too much",
        body: [
          "Price about 5-8% above your true bottom line. Buyers expect to negotiate a private-party sale, and a small buffer accommodates that without making your listing look overpriced compared to similar cars. Pricing 15-20% above market to 'leave room' almost always backfires — it just gets your listing scrolled past.",
        ],
      },
      {
        heading: "Read the signals and adjust",
        body: [
          "If you get zero inquiries within the first week, your price is too high relative to the market — drop it. If you're getting a flood of lowball offers well below asking, your price is roughly right and you should hold firm rather than panic-dropping the price further.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I find the right price for my used car?",
        answer:
          "Cross-reference Kelley Blue Book and Edmunds with real, recently sold local listings for your exact make, model, year, mileage, and trim. Local sold data is more accurate than national tools alone.",
      },
      {
        question: "Should I price my car higher to leave room for negotiation?",
        answer:
          "A modest buffer of 5-8% above your bottom line is reasonable. Pricing 15-20% higher to 'leave room' usually backfires by making your listing look overpriced next to comparable cars.",
      },
      {
        question: "What does it mean if no one is inquiring about my car listing?",
        answer:
          "Zero inquiries after about a week is a strong signal your price is too high for the local market. Lower it rather than waiting — the longer a listing sits, the more buyers assume something is wrong with the car.",
      },
    ],
  },
  {
    slug: "write-a-detailed-description",
    number: 4,
    icon: "file-text",
    navLabel: "Write a Description",
    question: "What should you include in a car listing description?",
    shortAnswer:
      "A strong listing description includes the car's ownership and maintenance history, recent major repairs, an honest reason for selling, and full transparency about any known issues. Specificity and honesty build buyer trust and reduce time-wasting inquiries.",
    metaDescription:
      "How to write a car listing description that attracts serious buyers: what history and details to include, how much detail is too much, and how honesty speeds up the sale.",
    keywords: ["car listing description tips", "how to write a car ad", "sell car description example", "private car sale listing"],
    sections: [
      {
        heading: "Lead with the facts buyers actually search for",
        body: [
          "Open with the essentials: year, make, model, trim, mileage, and transmission type. Buyers scan for these first, and clearly stating them upfront (rather than making buyers dig through photos) keeps unqualified inquiries to a minimum.",
        ],
      },
      {
        heading: "Include ownership and maintenance history",
        body: [
          "Mention how long you've owned the car, whether you're the original owner, and any major maintenance recently performed — new tires, brakes, timing belt, etc. Specific details ('replaced all four tires in March 2026') are far more credible and persuasive than vague claims like 'well maintained.'",
        ],
      },
      {
        heading: "Be transparent about known issues and your reason for selling",
        body: [
          "State your honest reason for selling (upgrading, moving, downsizing) — vague or evasive answers make buyers suspicious. Disclose any known mechanical issues or cosmetic flaws directly in the description rather than waiting for the buyer to discover them in person; it builds trust and dramatically reduces wasted showings.",
        ],
      },
    ],
    faqs: [
      {
        question: "What information should a car listing description include?",
        answer:
          "Include year, make, model, trim, mileage, transmission, ownership history, recent major maintenance, your reason for selling, and honest disclosure of any known issues.",
      },
      {
        question: "Should I disclose problems with my car in the listing?",
        answer:
          "Yes. Disclosing known issues upfront filters out buyers who wouldn't proceed anyway and builds trust with serious ones, which leads to fewer wasted showings and smoother negotiations.",
      },
      {
        question: "Does saying why I'm selling my car matter to buyers?",
        answer:
          "Yes. A clear, honest reason for selling (upgrading, relocating, downsizing) reassures buyers that you're not hiding a problem with the car, while vague or evasive answers tend to raise suspicion.",
      },
    ],
  },
  {
    slug: "safe-transactions",
    number: 5,
    icon: "handshake",
    navLabel: "Safe Transactions",
    question: "How do you complete a car sale safely?",
    shortAnswer:
      "Always meet in a public, well-lit location — a police station parking lot is ideal — and never accept a personal check. Cash or a cashier's check verified at the buyer's bank during business hours is the safest way to complete a private car sale.",
    metaDescription:
      "How to safely complete a private car sale: where to meet buyers, which payment methods to accept, and how to transfer the title without exposing yourself to fraud.",
    keywords: ["safe car selling tips", "how to sell a car safely", "car sale payment safety", "avoid car selling scams"],
    sections: [
      {
        heading: "Meet in a safe, public place",
        body: [
          "Arrange to meet buyers in a public, well-lit, and ideally monitored location. Many police departments offer designated 'safe exchange zones' with security cameras specifically for transactions like this — using one costs nothing and adds real protection for both parties.",
        ],
      },
      {
        heading: "Only accept payment you can verify on the spot",
        body: [
          "Never accept a personal check — they're the most common tool used in car sale scams and can bounce days after the buyer has already driven away. Cash is safest for smaller amounts. For larger amounts, a cashier's check verified in person at the issuing bank during business hours (call the bank directly, don't just look at the check) is the standard safe method.",
        ],
        bullets: [
          "Cash — count it together before handing over keys",
          "Cashier's check — verify directly with the issuing bank, in person, during business hours",
          "Bank-to-bank wire transfer — confirm funds have actually cleared before releasing the car",
          "Never: personal checks, money orders from unfamiliar buyers, or 'overpayment' refund requests",
        ],
      },
      {
        heading: "Handle the paperwork correctly",
        body: [
          "Sign the title over to the buyer, provide a bill of sale with both parties' signatures, the sale price, and the date, and remove your license plates if your state requires it. Notify your state's DMV of the sale (many states have an online 'release of liability' form) to protect yourself from tickets or liability after the sale.",
        ],
      },
    ],
    faqs: [
      {
        question: "Where is the safest place to meet a buyer for a car sale?",
        answer:
          "A public, well-lit location is best — many police departments offer a designated safe exchange zone with security cameras specifically for transactions like private car sales, which costs nothing to use.",
      },
      {
        question: "What is the safest way to accept payment for a used car?",
        answer:
          "Cash (counted together on the spot) or a cashier's check verified directly with the issuing bank in person during business hours are the safest methods. Never accept a personal check.",
      },
      {
        question: "Do I need to notify the DMV after selling my car?",
        answer:
          "Yes, in most states. Filing a release of liability (often available online) after the sale protects you from tickets, tolls, or other liability the new owner may incur after the sale but before they register the title in their name.",
      },
    ],
  },
];

export function getSellingGuideTopic(slug: string): SellingGuideTopic | undefined {
  return sellingGuideTopics.find((t) => t.slug === slug);
}

export const buyingGuideTopics: GuideTopic[] = [
  {
    slug: "car-buying-budget",
    number: 1,
    icon: "wallet",
    navLabel: "Set Your Budget",
    question: "How much should you budget for a used car?",
    shortAnswer:
      "A good rule of thumb is to keep your total monthly car costs — payment, insurance, fuel, and maintenance — under 15-20% of your monthly take-home pay. For a one-time cash purchase, aim to spend no more than 3-6 months of your net income so you keep a healthy emergency fund.",
    metaDescription:
      "Learn how much car you can actually afford. A simple budgeting formula, the true cost of car ownership, and how to avoid getting upside-down on a loan.",
    keywords: ["car buying budget", "how much car can I afford", "used car affordability", "car payment rule of thumb"],
    sections: [
      {
        heading: "The 15-20% rule for monthly costs",
        body: [
          "Lenders will often approve you for more than you can comfortably afford, so don't rely on a loan offer to set your budget. Instead, add up your realistic monthly car payment, insurance premium, fuel, and a maintenance reserve, and keep that total under 15-20% of your monthly take-home (after-tax) pay.",
          "Example: if you take home $4,000/month, your total car costs — not just the payment — should stay under $600-$800/month.",
        ],
      },
      {
        heading: "Don't forget the hidden costs of ownership",
        body: [
          "The sticker price is only the starting point. Before you commit, budget for these recurring costs, which vary a lot by make, model, and age:",
        ],
        bullets: [
          "Insurance — get a quote for the specific VIN before you buy, not just the model",
          "Fuel or charging costs based on your commute",
          "Routine maintenance (oil changes, tires, brakes)",
          "Registration, taxes, and inspection fees",
          "An emergency repair fund — aim for at least $500-$1,000 set aside",
        ],
      },
      {
        heading: "Cash vs. financing",
        body: [
          "Paying cash avoids interest entirely and gives you the strongest negotiating position with a private seller. If you finance, get pre-approved by a bank or credit union before you shop — a pre-approval gives you a real interest rate to compare against any dealer financing offer and prevents you from falling in love with a car you can't actually afford.",
          "Avoid loan terms longer than 60 months. Longer terms lower your payment but increase the total interest paid and raise the risk of being 'upside-down' (owing more than the car is worth) if you need to sell early.",
        ],
      },
    ],
    faqs: [
      {
        question: "What percentage of my income should go toward a car payment?",
        answer:
          "Keep your total monthly car costs (payment, insurance, fuel, and maintenance combined) under 15-20% of your monthly take-home pay.",
      },
      {
        question: "Is it better to buy a used car with cash or a loan?",
        answer:
          "Cash avoids interest and strengthens your negotiating position, especially with private sellers. If you need to finance, get pre-approved by a bank or credit union first so you know your real rate before shopping.",
      },
      {
        question: "How much should I set aside for car repairs?",
        answer:
          "Keep an emergency repair fund of at least $500-$1,000 on top of your regular budget, since even well-maintained used cars can need unexpected repairs.",
      },
    ],
  },
  {
    slug: "choosing-the-right-car",
    number: 2,
    icon: "car",
    navLabel: "Choose the Right Car",
    question: "How do you choose the right car for your needs?",
    shortAnswer:
      "Start with how you actually use a vehicle day-to-day — commute distance, passengers, cargo, and climate — before considering style or brand. Matching the car to your real needs (not your aspirational ones) is the single biggest factor in long-term satisfaction and cost.",
    metaDescription:
      "A practical framework for picking the right car type, size, and features based on your commute, family, and budget — not just looks.",
    keywords: ["how to choose a car", "best car for my needs", "body style comparison", "car buying guide"],
    sections: [
      {
        heading: "Start with how you'll actually use it",
        body: [
          "It's easy to fall in love with a sporty coupe in photos, but if you regularly carpool three kids to practice, a two-door car will make your life harder every single day. Before browsing listings, write down your non-negotiables:",
        ],
        bullets: [
          "Daily commute distance and terrain (highway, city stop-and-go, hills, snow)",
          "Number of regular passengers and car seats, if any",
          "Cargo needs — sports gear, strollers, work equipment, towing",
          "Parking situation — tight city spaces favor smaller footprints",
        ],
      },
      {
        heading: "Match body style to lifestyle",
        body: [
          "Sedans generally offer the best fuel economy and are easiest to park. SUVs and crossovers trade some efficiency for cargo room, higher seating, and often better resale value. Trucks make sense if you regularly haul or tow; otherwise, the fuel and maintenance costs rarely pay off. Hatchbacks and wagons are an underrated middle ground — sedan-like efficiency with SUV-like cargo flexibility.",
        ],
      },
      {
        heading: "New, used, or certified pre-owned?",
        body: [
          "A 2-3 year old used car has typically already absorbed the steepest depreciation hit while still having most of its useful life ahead. Certified pre-owned (CPO) vehicles cost more than standard used cars but include an extended warranty and a multi-point inspection, which is worth it if you want new-car peace of mind at a used-car price.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I buy an SUV or a sedan?",
        answer:
          "Choose a sedan for the best fuel economy and easiest parking. Choose an SUV or crossover if you need more cargo room, higher seating position, or better resale value — you'll trade some efficiency for that flexibility.",
      },
      {
        question: "Is a certified pre-owned (CPO) car worth the extra cost?",
        answer:
          "Yes, if you want warranty protection and inspection assurance similar to a new car, but at a lower price point. CPO vehicles undergo a multi-point inspection and include an extended warranty, which reduces the risk typical of buying used.",
      },
    ],
  },
  {
    slug: "used-car-inspection-checklist",
    number: 3,
    icon: "clipboard-check",
    navLabel: "The Inspection Checklist",
    question: "What should you check when inspecting a used car?",
    shortAnswer:
      "Inspect the exterior for uneven panel gaps or mismatched paint, check tires for uneven wear, look under the hood for fluid leaks and clean oil, and test every electronic feature inside the cabin. Always inspect in daylight and never skip a section, even on a car that looks great.",
    metaDescription:
      "The exact used car inspection checklist to run through before you buy — exterior, tires, engine bay, and interior — plus red flags that signal you should walk away.",
    keywords: ["used car inspection checklist", "how to inspect a used car", "car buying red flags", "pre purchase checklist"],
    sections: [
      {
        heading: "Exterior: panels, paint, and rust",
        body: ["Walk around the car in daylight and sight down each body panel from the front and rear."],
        bullets: [
          "Uneven panel gaps or doors that don't close flush can indicate prior accident repair",
          "Mismatched paint color or texture between panels suggests a repaint",
          "Check wheel wells, door sills, and the trunk floor for rust or bubbling paint",
          "Look underneath for fresh undercoating, which can be used to hide rust or leaks",
        ],
      },
      {
        heading: "Tires and wheels",
        body: [
          "Tires tell an honest story about how a car has been driven and maintained. Uneven wear across the tread, or different wear front-to-back, can point to alignment or suspension issues. Also check that all four tires match in brand and wear level — mismatched tires often means a slow leak or unresolved handling problem the seller is masking.",
        ],
      },
      {
        heading: "Under the hood",
        body: [
          "Pop the hood before starting the engine so you can check for any active leaks. Pull the oil dipstick: healthy oil should be amber-to-dark brown, never milky (a milky look signals coolant is mixing with oil — a serious and expensive problem). Check coolant color and level, look at belts and hoses for cracking, and scan the battery terminals for corrosion.",
        ],
      },
      {
        heading: "Interior and electronics",
        body: [
          "Test literally everything: every window, every seat adjustment, the sunroof, all infotainment functions, both climate zones, and every warning light on the dash after startup. Check under the floor mats and in the trunk spare-tire well for water staining, which is a strong signal of prior flood damage.",
        ],
      },
    ],
    faqs: [
      {
        question: "What are red flags when inspecting a used car?",
        answer:
          "Mismatched paint or uneven panel gaps (signs of accident repair), milky engine oil (coolant contamination), mismatched tire wear, water staining under carpets, and dashboard warning lights that stay on after startup are all red flags worth walking away from or negotiating hard on.",
      },
      {
        question: "Can I inspect a used car myself, or do I need a mechanic?",
        answer:
          "You can and should do a basic visual and functional check yourself using a checklist. But for any car you're seriously considering, also get a professional pre-purchase inspection (PPI) before finalizing — a mechanic can catch issues invisible to the untrained eye.",
      },
    ],
  },
  {
    slug: "used-car-test-drive-tips",
    number: 4,
    icon: "gauge",
    navLabel: "The Test Drive",
    question: "What should you do during a used car test drive?",
    shortAnswer:
      "Drive the car for at least 15-20 minutes across varied conditions — city streets, highway speed, and if possible a bumpy road — while listening for unusual noises, testing the brakes firmly, and confirming the transmission shifts smoothly with no hesitation or slipping.",
    metaDescription:
      "How to test drive a used car the right way: what routes to take, what noises to listen for, and how to test brakes, transmission, and steering before you buy.",
    keywords: ["how to test drive a used car", "test drive checklist", "car test drive tips", "what to listen for test drive"],
    sections: [
      {
        heading: "Drive more than just around the block",
        body: [
          "A five-minute drive around the seller's neighborhood won't reveal much. Plan a route that includes city stop-and-go driving, a stretch of highway at full speed, and if you can find one, a rougher road to check suspension and rattles. Aim for at least 15-20 minutes behind the wheel.",
        ],
      },
      {
        heading: "What to listen and feel for",
        body: ["Turn the radio off for at least part of the drive so you can hear the car clearly."],
        bullets: [
          "Clunks or knocks over bumps — can indicate worn suspension components",
          "Grinding or squealing when braking — brake pads or rotors may need replacement",
          "Hesitation, harsh shifts, or slipping in an automatic transmission",
          "Vibration through the steering wheel at highway speed — could be tires or alignment",
          "Any burning smell, which can point to a clutch, brake, or electrical issue",
        ],
      },
      {
        heading: "Test every function, not just the drive",
        body: [
          "Before and after the drive, test the brakes firmly (not just gently) in a safe, empty area to confirm the car stops straight without pulling to one side. Check that the steering returns to center on its own after a turn. Try parking sensors, backup camera, cruise control, and Bluetooth pairing while you're at it — these are common items sellers forget are broken.",
        ],
      },
    ],
    faqs: [
      {
        question: "How long should a used car test drive be?",
        answer:
          "Plan for at least 15-20 minutes covering city driving, highway speed, and ideally a rougher road, so you can evaluate the transmission, brakes, suspension, and any unusual noises across different conditions.",
      },
      {
        question: "What noises during a test drive mean I should walk away?",
        answer:
          "Grinding or squealing brakes, clunking over bumps, harsh or hesitant transmission shifts, and any burning smell are all signs of problems that should either lower your offer significantly or make you walk away, depending on severity.",
      },
    ],
  },
  {
    slug: "pre-purchase-inspection",
    number: 5,
    icon: "shield-check",
    navLabel: "The Pre-Purchase Inspection",
    question: "What is a pre-purchase inspection and do you need one?",
    shortAnswer:
      "A pre-purchase inspection (PPI) is a thorough check by an independent mechanic — separate from the buyer or seller — that typically costs $100-$200 and can reveal hidden mechanical, frame, or electrical issues before you finalize a purchase. It's strongly recommended for any private-party used car sale.",
    metaDescription:
      "Everything you need to know about a pre-purchase inspection (PPI): what it costs, what it covers, and how to use the results to negotiate or walk away.",
    keywords: ["pre-purchase inspection", "PPI car buying", "independent mechanic inspection", "should I get a car inspected before buying"],
    sections: [
      {
        heading: "Why an independent inspection matters",
        body: [
          "Even a thorough visual inspection and test drive can't catch everything. A pre-purchase inspection puts the car on a lift, checks for frame damage, tests compression, scans for stored diagnostic codes, and examines components you simply can't see or test from the driver's seat. For a $100-$200 fee, it's one of the highest-value steps in the entire buying process.",
        ],
      },
      {
        heading: "When it's worth it (almost always)",
        body: [
          "A PPI is especially critical for private-party sales, where there's no dealer warranty or return policy to fall back on. It's also worth it for higher-mileage vehicles, cars with an unclear maintenance history, or any vehicle you're buying sight-unseen from another city.",
        ],
      },
      {
        heading: "How to arrange one",
        body: [
          "Choose your own mechanic — ideally an independent shop, not one recommended by the seller. Most shops can perform a PPI same-day or next-day for $100-$200. Bring (or ask the seller for) the VIN in advance so the shop can check for any open recalls before you even arrive.",
        ],
      },
      {
        heading: "Using the results to negotiate",
        body: [
          "If the inspection turns up minor issues, use the estimated repair cost as leverage to negotiate the price down. If it reveals major problems — frame damage, transmission issues, signs of flood damage — walk away. No single car is worth the financial and safety risk of ignoring a failed PPI.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much does a pre-purchase inspection cost?",
        answer:
          "A typical independent pre-purchase inspection costs $100-$200, depending on your area and the shop. This is a small cost relative to the risk of buying a car with hidden mechanical or structural problems.",
      },
      {
        question: "Who should perform a pre-purchase inspection?",
        answer:
          "Always use your own independent mechanic, not one recommended by the seller, to avoid any conflict of interest. Most independent auto shops offer this service and can typically complete it same-day or next-day.",
      },
      {
        question: "What happens if the pre-purchase inspection finds problems?",
        answer:
          "For minor issues, use the estimated repair cost to negotiate a lower price. For major issues like frame damage or signs of flood damage, it's best to walk away from the deal entirely.",
      },
    ],
  },
];

export function getGuideTopic(slug: string): GuideTopic | undefined {
  return buyingGuideTopics.find((t) => t.slug === slug);
}
