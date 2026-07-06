---
name: Blog category additions
description: What must be updated when adding a new blog category (e.g. Insurance) to CarsInMyCity's blog
---

Adding a new article `category` value to `blog-data.ts` requires updating category metadata in two separate files that each keep their own copy:

- `artifacts/cars-in-my-city/src/pages/blog.tsx` — `categories` array (drives filter pills) and `categoryColors` map (badge styling on cards).
- `artifacts/cars-in-my-city/src/pages/blog-article.tsx` — has its own **duplicate** `categoryColors` map used for the article detail page badge. It does NOT import the one from blog.tsx.

**Why:** the two files don't share the color map, so if you only update blog.tsx, new-category articles will render with the badge fallback style on the individual article page even though the listing page looks correct.

**How to apply:** whenever adding a new blog category, grep both files for `categoryColors` and update both, plus the `categories` array in blog.tsx for the filter pill.
