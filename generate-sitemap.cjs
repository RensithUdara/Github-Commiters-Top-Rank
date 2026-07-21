const fs = require("fs");
const path = require("path");

const SITE_URL = process.env.SITE_URL || "https://committers.app";
const COUNTRIES_FILE = path.join(__dirname, "public", "data", "countries.json");

async function getCountries() {
  if (fs.existsSync(COUNTRIES_FILE)) {
    return JSON.parse(fs.readFileSync(COUNTRIES_FILE, "utf8"));
  }

  const response = await fetch("https://committers.top", {
    headers: { "User-Agent": "committersapp-sitemap/1.0" },
  });

  if (!response.ok) {
    throw new Error(`committers.top returned ${response.status}`);
  }

  const html = await response.text();
  return [...html.matchAll(/<li>\s*<a href="([^"]+)">([^<]+)<\/a>\s*<\/li>/g)]
    .map((match) => ({
      slug: match[1].replace(/^\//, ""),
      name: match[2].trim(),
    }))
    .filter((country) => country.slug && country.name);
}

async function generate() {
  try {
    const countries = await getCountries();

    if (!Array.isArray(countries)) {
      console.error("error:", typeof countries);
      process.exit(1);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${countries
    .map(
      (c) => `
  <url>
    <loc>${SITE_URL}/${c.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join("")}
</urlset>`;

    if (!fs.existsSync("./public")) fs.mkdirSync("./public");
    fs.writeFileSync("./public/sitemap.xml", sitemap);

    console.log(`Generated sitemap.xml for ${countries.length} countries.`);
  } catch (error) {
    console.error("error while generating", error.message);
    process.exit(1);
  }
}

generate();
