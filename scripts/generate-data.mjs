import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const COMMITTERS_ORIGIN = "https://committers.top";
const COUNTRY_DATA_URL =
  "https://cdn.jsdelivr.net/npm/world-countries@5.1.0/countries.json";
const DATA_DIR = path.join(process.cwd(), "public", "data");
const COMMITTERS_DIR = path.join(DATA_DIR, "committers");
const CONCURRENCY = Number(process.env.DATA_CONCURRENCY || 6);

const fetchText = async (url, options) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "User-Agent": "committersapp-data-generator/1.0",
      Accept: "text/html,application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  return response.text();
};

const decodeHtml = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const parseCountries = (html) =>
  [...html.matchAll(/<li>\s*<a href="([^"]+)">([^<]+)<\/a>\s*<\/li>/g)]
    .map((match) => ({
      slug: decodeHtml(match[1]).replace(/^\//, ""),
      name: decodeHtml(match[2]).trim(),
    }))
    .filter(
      (country) =>
        country.slug &&
        country.name &&
        !country.slug.includes(".") &&
        !country.slug.startsWith("http"),
    );

const parseCommitters = (html) => {
  const rows = [...html.matchAll(/<tr id="[^"]+">([\s\S]*?)<\/tr>/g)];

  return rows
    .map((row) => {
      const cells = [...row[1].matchAll(/<td(?:\s+class="[^"]+")?>([\s\S]*?)<\/td>/g)].map(
        (cell) => cell[1],
      );
      if (cells.length < 4) return null;

      const rank = Number(cells[0].replace(/[^\d]/g, ""));
      const userMatch = cells[1].match(
        /<a href="https:\/\/github\.com\/([^"]+)">([^<]+)<\/a>(?:<br>\(([^)]*)\))?/,
      );
      if (!rank || !userMatch) return null;

      const username = decodeHtml(userMatch[2]).trim();
      const avatarMatch = cells[3].match(/(?:data-src|src)="([^"]+)"/);

      return {
        rank,
        username,
        realname: userMatch[3] ? decodeHtml(userMatch[3]).trim() : undefined,
        profile: `https://github.com/${decodeURIComponent(userMatch[1])}`,
        commits: Number(cells[2].replace(/[^\d]/g, "")) || 0,
        avatar: avatarMatch
          ? decodeHtml(avatarMatch[1])
          : `https://github.com/${username}.png?size=40`,
      };
    })
    .filter(Boolean);
};

const toCommittersFile = (country, users, generatedAt) => ({
  country,
  generatedAt,
  users,
});

const writeJson = (filePath, data) =>
  writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);

const runPool = async (items, worker) => {
  const queue = [...items];
  const workers = Array.from(
    { length: Math.min(CONCURRENCY, queue.length) },
    async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        await worker(item);
      }
    },
  );

  await Promise.all(workers);
};

const loadFlags = async () => {
  const countries = JSON.parse(
    await fetchText(COUNTRY_DATA_URL, {
      headers: { Accept: "application/json" },
    }),
  );

  return countries.map((country) => ({
    name: country.name?.common || "Unknown",
    flagUrl: country.cca2
      ? `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`
      : "",
    continent: country.region || "Unknown",
  }));
};

const main = async () => {
  const generatedAt = new Date().toISOString();

  await mkdir(DATA_DIR, { recursive: true });
  await rm(COMMITTERS_DIR, { recursive: true, force: true });
  await mkdir(COMMITTERS_DIR, { recursive: true });

  console.log("Fetching country list...");
  const countryHtml = await fetchText(COMMITTERS_ORIGIN);
  const countries = parseCountries(countryHtml);
  const flags = await loadFlags();
  const flagByName = new Map(
    flags.map((flag) => [flag.name.toLowerCase(), flag.flagUrl]),
  );
  const countriesWithFlags = countries.map((country) => ({
    ...country,
    flagUrl: flagByName.get(country.name.toLowerCase()) || "",
  }));

  await writeJson(path.join(DATA_DIR, "countries.json"), countriesWithFlags);
  await writeJson(path.join(DATA_DIR, "flags.json"), flags);
  await writeJson(path.join(DATA_DIR, "metadata.json"), {
    generatedAt,
    countries: countries.length,
  });

  let completed = 0;
  const failures = [];

  await runPool(countries, async (country) => {
    try {
      const html = await fetchText(`${COMMITTERS_ORIGIN}/${country.slug}`);
      const users = parseCommitters(html);
      await writeJson(
        path.join(COMMITTERS_DIR, `${country.slug}.json`),
        toCommittersFile(country, users, generatedAt),
      );
      completed += 1;
      console.log(`${completed}/${countries.length} ${country.slug}`);
    } catch (error) {
      failures.push({
        country,
        error: error instanceof Error ? error.message : String(error),
      });
      await writeJson(
        path.join(COMMITTERS_DIR, `${country.slug}.json`),
        toCommittersFile(country, [], generatedAt),
      );
    }
  });

  if (failures.length > 0) {
    console.warn(`Completed with ${failures.length} failures.`);
    await writeJson(path.join(DATA_DIR, "failures.json"), failures);
  } else {
    await rm(path.join(DATA_DIR, "failures.json"), { force: true });
  }

  console.log(`Generated data for ${countries.length} countries.`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
