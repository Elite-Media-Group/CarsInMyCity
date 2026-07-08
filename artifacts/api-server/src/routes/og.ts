import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { carsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const BLOG_META: Record<string, { title: string; category: string; readTime: string }> = {
  "10-things-to-check-when-buying-a-used-car": { title: "10 Things to Check When Buying a Used Car", category: "Buying", readTime: "5 min read" },
  "how-to-price-your-car-for-a-fast-sale": { title: "How to Price Your Car for a Fast Sale", category: "Selling", readTime: "7 min read" },
  "understanding-car-title-types": { title: "Understanding Car Title Types", category: "Guides", readTime: "6 min read" },
  "new-vs-used-vs-certified-pre-owned": { title: "New vs Used vs Certified Pre-Owned", category: "Buying", readTime: "8 min read" },
  "tips-for-taking-great-car-photos": { title: "Tips for Taking Great Car Photos", category: "Selling", readTime: "4 min read" },
  "financing-a-used-car": { title: "Financing a Used Car: What You Need to Know", category: "Finance", readTime: "9 min read" },
  "how-to-transfer-a-car-title-safely": { title: "How to Transfer a Car Title Safely", category: "Guides", readTime: "5 min read" },
  "best-time-of-year-to-buy-a-car": { title: "The Best Time of Year to Buy a Car", category: "Buying", readTime: "4 min read" },
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Buying:  { bg: "#186070", text: "#ffffff" },
  Selling: { bg: "#D97706", text: "#ffffff" },
  Guides:  { bg: "#059669", text: "#ffffff" },
  Finance: { bg: "#7C3AED", text: "#ffffff" },
};

let fontCache: ArrayBuffer | null = null;

async function getFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;
  // Use an IE11 UA so Google Fonts returns WOFF (not WOFF2) — satori's opentype.js supports WOFF but not WOFF2
  const cssRes = await fetch(
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap",
    { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko" } }
  );
  const css = await cssRes.text();
  const match = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+\.(?:ttf|otf|woff))\)/i);
  if (!match) throw new Error(`Could not extract TTF/OTF/WOFF font URL from Google Fonts CSS. CSS: ${css.slice(0, 500)}`);
  const fontRes = await fetch(match[1]);
  fontCache = await fontRes.arrayBuffer();
  return fontCache;
}

type Child = ReturnType<typeof el> | string | number | null | undefined;
function el(type: string, props: Record<string, unknown>, ...children: Child[]) {
  const valid = children.filter((c) => c != null);
  return {
    type,
    key: null,
    props: {
      ...props,
      children: valid.length === 0 ? undefined : valid.length === 1 ? valid[0] : valid,
    },
  };
}

async function renderPng(element: unknown): Promise<Buffer> {
  const { default: satori } = await import("satori");
  const { Resvg } = await import("@resvg/resvg-js");
  const font = await getFont();
  const svg = await satori(element as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Plus Jakarta Sans", data: font, weight: 700, style: "normal" },
      { name: "Plus Jakarta Sans", data: font, weight: 800, style: "normal" },
    ],
  });
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  return Buffer.from(resvg.render().asPng());
}

router.get("/og/blog/:slug", async (req, res) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const article = BLOG_META[slug];
  if (!article) return res.status(404).send("Not found");

  const catColors = CATEGORY_COLORS[article.category] ?? { bg: "#186070", text: "#ffffff" };
  const titleSize = article.title.length > 55 ? 52 : article.title.length > 40 ? 60 : 68;

  const element = el(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "linear-gradient(145deg, #0f3d4e 0%, #186070 60%, #1d7a90 100%)",
        padding: "64px 72px",
        fontFamily: "Plus Jakarta Sans",
      },
    },
    el("div", { style: { display: "flex", width: "80px", height: "6px", background: "#F59E0B", borderRadius: "3px", marginBottom: "36px" } }),
    el(
      "div",
      { style: { display: "flex", marginBottom: "24px" } },
      el(
        "div",
        {
          style: {
            background: catColors.bg,
            color: catColors.text,
            border: "1px solid rgba(255,255,255,0.25)",
            padding: "8px 22px",
            borderRadius: "100px",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.5px",
          },
        },
        article.category
      )
    ),
    el(
      "div",
      {
        style: {
          color: "#ffffff",
          fontSize: titleSize,
          fontWeight: 800,
          lineHeight: 1.18,
          flex: 1,
          marginBottom: "40px",
          letterSpacing: "-1px",
        },
      },
      article.title
    ),
    el(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          borderTop: "1px solid rgba(255,255,255,0.15)",
          paddingTop: "28px",
        },
      },
      el("div", { style: { color: "rgba(255,255,255,0.6)", fontSize: 22, fontWeight: 700 } }, article.readTime),
      el(
        "div",
        { style: { display: "flex", alignItems: "center", gap: "10px" } },
        el("div", { style: { width: "10px", height: "10px", borderRadius: "50%", background: "#F59E0B" } }),
        el("div", { style: { color: "#ffffff", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" } }, "CarsInMyCity")
      )
    )
  );

  try {
    const png = await renderPng(element);
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
    res.send(png);
  } catch (err) {
    req.log.error({ err }, "OG image generation failed");
    res.status(500).send("Failed to generate image");
  }
});

router.get("/og/cars/:id", async (req, res) => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) return res.status(400).send("Invalid id");

  const [car] = await db.select().from(carsTable).where(eq(carsTable.id, id)).limit(1);
  if (!car) return res.status(404).send("Not found");

  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(parseFloat(String(car.price)));
  const mileage = new Intl.NumberFormat("en-US").format(car.mileage ?? 0) + " mi";
  const vehicleTitle = `${car.year} ${car.make} ${car.model}`;
  const titleSize = vehicleTitle.length > 30 ? 68 : 80;

  const element = el(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "linear-gradient(145deg, #0a2a36 0%, #103a4a 55%, #186070 100%)",
        padding: "64px 72px",
        fontFamily: "Plus Jakarta Sans",
      },
    },
    el(
      "div",
      { style: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "32px" } },
      el(
        "div",
        {
          style: {
            background: "rgba(245,158,11,0.15)",
            color: "#F59E0B",
            border: "1px solid rgba(245,158,11,0.4)",
            padding: "7px 20px",
            borderRadius: "100px",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
          },
        },
        car.condition ?? "Used"
      ),
      el(
        "div",
        { style: { color: "rgba(255,255,255,0.5)", fontSize: 20, fontWeight: 700 } },
        `${car.city ?? ""}, ${car.state ?? ""}`
      )
    ),
    el(
      "div",
      {
        style: {
          color: "#ffffff",
          fontSize: titleSize,
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-1.5px",
          marginBottom: car.trim ? "8px" : "32px",
        },
      },
      vehicleTitle
    ),
    car.trim
      ? el("div", {
          style: { color: "rgba(255,255,255,0.45)", fontSize: 26, fontWeight: 700, marginBottom: "32px", letterSpacing: "-0.5px" },
        }, car.trim)
      : null,
    el(
      "div",
      { style: { display: "flex", gap: "40px", flex: 1, alignItems: "flex-end", paddingBottom: "12px" } },
      el(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "4px" } },
        el("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 17, fontWeight: 700, letterSpacing: "1px" } }, "MILEAGE"),
        el("div", { style: { color: "#ffffff", fontSize: 28, fontWeight: 800 } }, mileage)
      ),
      car.transmission
        ? el(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "4px" } },
            el("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 17, fontWeight: 700, letterSpacing: "1px" } }, "TRANSMISSION"),
            el("div", { style: { color: "#ffffff", fontSize: 28, fontWeight: 800 } }, car.transmission)
          )
        : null,
      car.drivetrain
        ? el(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "4px" } },
            el("div", { style: { color: "rgba(255,255,255,0.5)", fontSize: 17, fontWeight: 700, letterSpacing: "1px" } }, "DRIVETRAIN"),
            el("div", { style: { color: "#ffffff", fontSize: 28, fontWeight: 800 } }, car.drivetrain)
          )
        : null
    ),
    el(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          paddingTop: "28px",
          marginTop: "20px",
        },
      },
      el("div", { style: { color: "#F59E0B", fontSize: 52, fontWeight: 800, letterSpacing: "-1px" } }, price),
      el(
        "div",
        { style: { display: "flex", alignItems: "center", gap: "10px" } },
        el("div", { style: { width: "10px", height: "10px", borderRadius: "50%", background: "#F59E0B" } }),
        el("div", { style: { color: "#ffffff", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" } }, "CarsInMyCity")
      )
    )
  );

  try {
    const png = await renderPng(element);
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=600");
    res.send(png);
  } catch (err) {
    req.log.error({ err }, "OG image generation failed");
    res.status(500).send("Failed to generate image");
  }
});

export default router;
