const fs = require('fs');
const axios = require('axios');

const API_BASE_URL = "https://committerstop-backend.vercel.app";
const SITE_URL = "https://committers.app";

async function generate() {
  try {
    const response = await axios.get(`${API_BASE_URL}/countries`);
    const countries = response.data;

    if (!Array.isArray(countries)) {
      console.error('error:', typeof countries);
      process.exit(1);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${countries.map(c => `
  <url>
    <loc>${SITE_URL}/${c.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

    if (!fs.existsSync('./public')) fs.mkdirSync('./public');
    fs.writeFileSync('./public/sitemap.xml', sitemap);

    console.log(`correct sitemap.xml fur ${countries.length}`);
  } catch (error) {
    console.error('error while generating', error.message);
    process.exit(1);
  }
}

generate();