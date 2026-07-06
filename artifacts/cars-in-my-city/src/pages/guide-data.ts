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
