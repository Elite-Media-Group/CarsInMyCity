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

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
      '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
      staticEntries,
      blogEntries,
      carEntries,
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
