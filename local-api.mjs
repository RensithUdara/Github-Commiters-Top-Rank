import { createServer } from "node:http";

const PORT = Number(process.env.PORT || 3000);
const COMMITTERS_ORIGIN = "https://committers.top";
const CACHE_TTL_MS = 1000 * 60 * 10;

const cache = new Map();

const sendJson = (res, status, data) => {
  res.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(data));
};

const getCached = async (key, loader) => {
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && now - cached.createdAt < CACHE_TTL_MS) return cached.value;

  const value = await loader();
  cache.set(key, { createdAt: now, value });
  return value;
};

const fetchText = async (url, options) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "User-Agent": "committersapp-local-dev/1.0",
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
    .filter((country) => country.slug && country.name);

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

const getCountries = () =>
  getCached("countries", async () => {
    const html = await fetchText(COMMITTERS_ORIGIN);
    return parseCountries(html);
  });

const getCommitters = (country) =>
  getCached(`committers:${country}`, async () => {
    const html = await fetchText(`${COMMITTERS_ORIGIN}/${country}`);
    return {
      users: parseCommitters(html),
      generatedAt: new Date().toISOString(),
    };
  });

const getFlags = () =>
  getCached("flags", async () => {
    const text = await fetchText(
      "https://cdn.jsdelivr.net/npm/world-countries@5.1.0/countries.json",
      { headers: { Accept: "application/json" } },
    );
    const countries = JSON.parse(text);

    return countries.map((country) => ({
      name: country.name?.common || "Unknown",
      flagUrl: country.cca2
        ? `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`
        : "",
      continent: country.region || "Unknown",
    }));
  });

const getGitHubUser = (username) =>
  getCached(`github:${username.toLowerCase()}`, async () => {
    const token = process.env.VITE_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
    const text = await fetchText(`https://api.github.com/users/${username}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return JSON.parse(text);
  });

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, null);
    return;
  }

  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const parts = url.pathname.split("/").filter(Boolean);

    if (url.pathname === "/countries") {
      sendJson(res, 200, await getCountries());
      return;
    }

    if (url.pathname === "/flags") {
      sendJson(res, 200, {
        data: {
          objects: (await getFlags()).map((country) => ({
            names: { common: country.name },
            flag: { url_png: country.flagUrl },
            continents: [country.continent],
          })),
        },
      });
      return;
    }

    if (parts[0] === "committers" && parts[1]) {
      sendJson(res, 200, await getCommitters(parts[1]));
      return;
    }

    if (parts[0] === "github-user" && parts[1]) {
      sendJson(res, 200, await getGitHubUser(parts[1]));
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

server.listen(PORT, () => {
  console.log(`Local API listening on http://localhost:${PORT}`);
});
