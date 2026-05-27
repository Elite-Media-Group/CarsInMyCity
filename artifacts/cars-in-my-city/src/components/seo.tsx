import { useEffect } from "react";

interface JsonLdBlock {
  [key: string]: unknown;
}

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  canonical?: string;
  jsonLd?: JsonLdBlock | JsonLdBlock[];
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

function setMeta(selector: string, attr: string, value: string) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const parts = selector.match(/\[([^\]]+)="([^\]]+)"\]/);
    if (parts) el.setAttribute(parts[1], parts[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function injectJsonLd(id: string, data: JsonLdBlock | JsonLdBlock[]) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.setAttribute("type", "application/ld+json");
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

export function SEO({
  title,
  description,
  image,
  type = "website",
  canonical,
  jsonLd,
  keywords,
  publishedTime,
  modifiedTime,
  author,
}: SEOProps) {
  useEffect(() => {
    const siteTitle = "CarsInMyCity";
    const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;

    document.title = fullTitle;

    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
      setMeta('meta[name="twitter:description"]', "content", description);
    }

    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[property="og:site_name"]', "content", siteTitle);

    if (image) {
      setMeta('meta[property="og:image"]', "content", image);
      setMeta('meta[name="twitter:image"]', "content", image);
    }

    if (canonical) {
      setLink("canonical", canonical);
      setMeta('meta[property="og:url"]', "content", canonical);
    }

    if (keywords && keywords.length) {
      setMeta('meta[name="keywords"]', "content", keywords.join(", "));
    }

    if (publishedTime) {
      setMeta('meta[property="article:published_time"]', "content", publishedTime);
    }

    if (modifiedTime) {
      setMeta('meta[property="article:modified_time"]', "content", modifiedTime);
    }

    if (author) {
      setMeta('meta[name="author"]', "content", author);
      setMeta('meta[property="article:author"]', "content", author);
    }

    if (jsonLd) {
      injectJsonLd("page-json-ld", jsonLd);
    } else {
      removeJsonLd("page-json-ld");
    }

    return () => {
      removeJsonLd("page-json-ld");
    };
  }, [title, description, image, type, canonical, jsonLd, keywords, publishedTime, modifiedTime, author]);

  return null;
}
