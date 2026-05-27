import { Router, type IRouter } from "express";
import { db, carsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const SITE = "https://carsinmycity.com";
const TODAY = new Date().toISOString().split("T")[0];

const staticRoutes: { loc: string; changefreq: string; priority: string; lastmod?: string }[] = [
  { loc: "/",               changefreq: "daily",   priority: "1.0" },
  { loc: "/search",         changefreq: "hourly",  priority: "0.9" },
  { loc: "/sell",           changefreq: "monthly", priority: "0.7" },
  { loc: "/blog",           changefreq: "weekly",  priority: "0.8" },
  { loc: "/buying-guide",   changefreq: "monthly", priority: "0.7" },
  { loc: "/selling-guide",  changefreq: "monthly", priority: "0.7" },
  { loc: "/about",          changefreq: "monthly", priority: "0.5" },
  { loc: "/terms",          changefreq: "yearly",  priority: "0.3" },
  { loc: "/privacy",        changefreq: "yearly",  priority: "0.3" },
  { loc: "/affiliates",     changefreq: "monthly", priority: "0.4" },
  { loc: "/cities",         changefreq: "weekly",  priority: "0.8" },
];

// 50 state index pages
const stateRoutes: string[] = [
  "alabama","alaska","arizona","arkansas","california","colorado","connecticut",
  "delaware","florida","georgia","hawaii","idaho","illinois","indiana","iowa",
  "kansas","kentucky","louisiana","maine","maryland","massachusetts","michigan",
  "minnesota","mississippi","missouri","montana","nebraska","nevada","new-hampshire",
  "new-jersey","new-mexico","new-york","north-carolina","north-dakota","ohio",
  "oklahoma","oregon","pennsylvania","rhode-island","south-carolina","south-dakota",
  "tennessee","texas","utah","vermont","virginia","washington","west-virginia",
  "wisconsin","wyoming",
];

// 250 city pages: [stateSlug, citySlug]
const cityRoutes: [string, string][] = [
  ["alabama","birmingham"],["alabama","huntsville"],["alabama","montgomery"],["alabama","mobile"],["alabama","tuscaloosa"],
  ["alaska","anchorage"],["alaska","fairbanks"],["alaska","juneau"],["alaska","sitka"],["alaska","ketchikan"],
  ["arizona","phoenix"],["arizona","tucson"],["arizona","mesa"],["arizona","chandler"],["arizona","scottsdale"],
  ["arkansas","little-rock"],["arkansas","fort-smith"],["arkansas","fayetteville"],["arkansas","springdale"],["arkansas","jonesboro"],
  ["california","los-angeles"],["california","san-diego"],["california","san-jose"],["california","san-francisco"],["california","fresno"],
  ["colorado","denver"],["colorado","colorado-springs"],["colorado","aurora"],["colorado","fort-collins"],["colorado","lakewood"],
  ["connecticut","bridgeport"],["connecticut","new-haven"],["connecticut","hartford"],["connecticut","stamford"],["connecticut","waterbury"],
  ["delaware","wilmington"],["delaware","dover"],["delaware","newark"],["delaware","middletown"],["delaware","smyrna"],
  ["florida","jacksonville"],["florida","miami"],["florida","tampa"],["florida","orlando"],["florida","st-petersburg"],
  ["georgia","atlanta"],["georgia","augusta"],["georgia","columbus"],["georgia","savannah"],["georgia","athens"],
  ["hawaii","honolulu"],["hawaii","pearl-city"],["hawaii","hilo"],["hawaii","kailua"],["hawaii","waipahu"],
  ["idaho","boise"],["idaho","nampa"],["idaho","meridian"],["idaho","idaho-falls"],["idaho","pocatello"],
  ["illinois","chicago"],["illinois","aurora"],["illinois","rockford"],["illinois","joliet"],["illinois","naperville"],
  ["indiana","indianapolis"],["indiana","fort-wayne"],["indiana","evansville"],["indiana","south-bend"],["indiana","carmel"],
  ["iowa","des-moines"],["iowa","cedar-rapids"],["iowa","davenport"],["iowa","sioux-city"],["iowa","iowa-city"],
  ["kansas","wichita"],["kansas","overland-park"],["kansas","kansas-city"],["kansas","topeka"],["kansas","olathe"],
  ["kentucky","louisville"],["kentucky","lexington"],["kentucky","bowling-green"],["kentucky","owensboro"],["kentucky","covington"],
  ["louisiana","new-orleans"],["louisiana","baton-rouge"],["louisiana","shreveport"],["louisiana","metairie"],["louisiana","lafayette"],
  ["maine","portland"],["maine","lewiston"],["maine","bangor"],["maine","south-portland"],["maine","auburn"],
  ["maryland","baltimore"],["maryland","columbia"],["maryland","germantown"],["maryland","silver-spring"],["maryland","waldorf"],
  ["massachusetts","boston"],["massachusetts","worcester"],["massachusetts","springfield"],["massachusetts","lowell"],["massachusetts","cambridge"],
  ["michigan","detroit"],["michigan","grand-rapids"],["michigan","warren"],["michigan","sterling-heights"],["michigan","lansing"],
  ["minnesota","minneapolis"],["minnesota","saint-paul"],["minnesota","rochester"],["minnesota","duluth"],["minnesota","bloomington"],
  ["mississippi","jackson"],["mississippi","gulfport"],["mississippi","southaven"],["mississippi","hattiesburg"],["mississippi","biloxi"],
  ["missouri","kansas-city"],["missouri","st-louis"],["missouri","springfield"],["missouri","columbia"],["missouri","independence"],
  ["montana","billings"],["montana","missoula"],["montana","great-falls"],["montana","bozeman"],["montana","butte"],
  ["nebraska","omaha"],["nebraska","lincoln"],["nebraska","bellevue"],["nebraska","grand-island"],["nebraska","kearney"],
  ["nevada","las-vegas"],["nevada","henderson"],["nevada","reno"],["nevada","north-las-vegas"],["nevada","sparks"],
  ["new-hampshire","manchester"],["new-hampshire","nashua"],["new-hampshire","concord"],["new-hampshire","derry"],["new-hampshire","dover"],
  ["new-jersey","newark"],["new-jersey","jersey-city"],["new-jersey","paterson"],["new-jersey","elizabeth"],["new-jersey","edison"],
  ["new-mexico","albuquerque"],["new-mexico","las-cruces"],["new-mexico","rio-rancho"],["new-mexico","santa-fe"],["new-mexico","roswell"],
  ["new-york","new-york-city"],["new-york","buffalo"],["new-york","rochester"],["new-york","yonkers"],["new-york","syracuse"],
  ["north-carolina","charlotte"],["north-carolina","raleigh"],["north-carolina","greensboro"],["north-carolina","durham"],["north-carolina","winston-salem"],
  ["north-dakota","fargo"],["north-dakota","bismarck"],["north-dakota","grand-forks"],["north-dakota","minot"],["north-dakota","west-fargo"],
  ["ohio","columbus"],["ohio","cleveland"],["ohio","cincinnati"],["ohio","toledo"],["ohio","akron"],
  ["oklahoma","oklahoma-city"],["oklahoma","tulsa"],["oklahoma","norman"],["oklahoma","broken-arrow"],["oklahoma","edmond"],
  ["oregon","portland"],["oregon","salem"],["oregon","eugene"],["oregon","gresham"],["oregon","hillsboro"],
  ["pennsylvania","philadelphia"],["pennsylvania","pittsburgh"],["pennsylvania","allentown"],["pennsylvania","erie"],["pennsylvania","reading"],
  ["rhode-island","providence"],["rhode-island","cranston"],["rhode-island","warwick"],["rhode-island","pawtucket"],["rhode-island","east-providence"],
  ["south-carolina","columbia"],["south-carolina","charleston"],["south-carolina","north-charleston"],["south-carolina","mount-pleasant"],["south-carolina","rock-hill"],
  ["south-dakota","sioux-falls"],["south-dakota","rapid-city"],["south-dakota","aberdeen"],["south-dakota","brookings"],["south-dakota","watertown"],
  ["tennessee","nashville"],["tennessee","memphis"],["tennessee","knoxville"],["tennessee","chattanooga"],["tennessee","clarksville"],
  ["texas","houston"],["texas","san-antonio"],["texas","dallas"],["texas","austin"],["texas","fort-worth"],
  ["utah","salt-lake-city"],["utah","west-valley-city"],["utah","provo"],["utah","west-jordan"],["utah","orem"],
  ["vermont","burlington"],["vermont","south-burlington"],["vermont","rutland"],["vermont","barre"],["vermont","montpelier"],
  ["virginia","virginia-beach"],["virginia","norfolk"],["virginia","chesapeake"],["virginia","richmond"],["virginia","newport-news"],
  ["washington","seattle"],["washington","spokane"],["washington","tacoma"],["washington","vancouver"],["washington","bellevue"],
  ["west-virginia","charleston"],["west-virginia","huntington"],["west-virginia","morgantown"],["west-virginia","parkersburg"],["west-virginia","wheeling"],
  ["wisconsin","milwaukee"],["wisconsin","madison"],["wisconsin","green-bay"],["wisconsin","kenosha"],["wisconsin","racine"],
  ["wyoming","cheyenne"],["wyoming","casper"],["wyoming","laramie"],["wyoming","gillette"],["wyoming","rock-springs"],
];

const blogArticles: { slug: string; lastmod: string }[] = [
  { slug: "10-things-to-check-when-buying-a-used-car",  lastmod: "2024-03-01" },
  { slug: "how-to-price-your-car-for-a-fast-sale",      lastmod: "2024-03-01" },
  { slug: "understanding-car-title-types",               lastmod: "2024-03-01" },
  { slug: "new-vs-used-vs-certified-pre-owned",          lastmod: "2024-03-01" },
  { slug: "tips-for-taking-great-car-photos",            lastmod: "2024-03-01" },
  { slug: "financing-a-used-car",                        lastmod: "2024-03-01" },
  { slug: "how-to-transfer-a-car-title-safely",          lastmod: "2024-03-01" },
  { slug: "best-time-of-year-to-buy-a-car",             lastmod: "2024-03-01" },
];

function urlEntry(loc: string, opts: { changefreq?: string; priority?: string; lastmod?: string }) {
  return [
    "  <url>",
    `    <loc>${SITE}${loc}</loc>`,
    opts.lastmod ? `    <lastmod>${opts.lastmod}</lastmod>` : `    <lastmod>${TODAY}</lastmod>`,
    opts.changefreq ? `    <changefreq>${opts.changefreq}</changefreq>` : "",
    opts.priority ? `    <priority>${opts.priority}</priority>` : "",
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

router.get("/sitemap.xml", async (req, res) => {
  try {
    const cars = await db
      .select({ id: carsTable.id, updatedAt: carsTable.updatedAt })
      .from(carsTable)
      .where(eq(carsTable.status, "active"));

    const staticEntries = staticRoutes
      .map((r) => urlEntry(r.loc, { changefreq: r.changefreq, priority: r.priority }))
      .join("\n");

    const blogEntries = blogArticles
      .map((a) => urlEntry(`/blog/${a.slug}`, { changefreq: "monthly", priority: "0.6", lastmod: a.lastmod }))
      .join("\n");

    const carEntries = cars
      .map((c) => {
        const lastmod = c.updatedAt
          ? new Date(c.updatedAt).toISOString().split("T")[0]
          : TODAY;
        return urlEntry(`/cars/${c.id}`, { changefreq: "weekly", priority: "0.8", lastmod });
      })
      .join("\n");

    const stateEntries = stateRoutes
      .map((s) => urlEntry(`/cities/${s}`, { changefreq: "weekly", priority: "0.7" }))
      .join("\n");

    const cityEntries = cityRoutes
      .map(([state, city]) => urlEntry(`/cities/${state}/${city}`, { changefreq: "monthly", priority: "0.6" }))
      .join("\n");

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
      '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
      staticEntries,
      blogEntries,
      carEntries,
      stateEntries,
      cityEntries,
      "</urlset>",
    ].join("\n");

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    req.log.error({ err }, "Failed to generate sitemap");
    res.status(500).send("Failed to generate sitemap");
  }
});

router.get("/robots.txt", (_req, res) => {
  const SITEMAP_URL = `${SITE}/sitemap.xml`;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(
    [
      "User-agent: *",
      "Allow: /",
      "",
      `Sitemap: ${SITEMAP_URL}`,
      "",
      "Disallow: /api/",
    ].join("\n")
  );
});

export default router;
