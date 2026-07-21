# 🚀 GitHub Commiters Top Rank

**GitHub Commiters Top Rank** is a modern React + Vite web app that displays the most active GitHub committers by country. It uses static JSON data generated from [`committers.top`](https://committers.top), updates automatically every day with GitHub Actions, and is hosted on Vercel.

🌐 **Live Site:** https://github-commiters-top-rank.vercel.app  
👨‍💻 **Developer / Branding:** [Rensith Udara Gonalagoda](https://rensithudara.com/)  
🐙 **GitHub:** [RensithUdara](https://github.com/RensithUdara)  
💼 **LinkedIn:** [Rensith Udara Gonalagoda](https://www.linkedin.com/in/rensith-udara-gonalagoda/)

---

## ✨ Features

- 🌍 Browse GitHub committers by country
- 🏆 View ranked contributor leaderboards
- 🔎 Search countries and users
- 📊 Sort by commits, name, and activity modes
- 🎨 Modern responsive UI with light/dark mode
- 🧭 Country-specific SEO pages
- ⚡ Static JSON data for fast loading
- 🤖 Daily GitHub Action data updates
- 🗺️ Auto-generated sitemap
- 🔍 Full SEO metadata with Open Graph, Twitter cards, and JSON-LD
- 🚀 Vercel-ready deployment

---

## 🖼️ Tech Stack

| Area | Technology |
|---|---|
| Frontend | React 18, TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| State/Data | Redux Toolkit Query |
| Routing | React Router |
| Icons | Lucide React |
| SEO | React Helmet Async, sitemap, robots.txt, JSON-LD |
| Hosting | Vercel |
| Automation | GitHub Actions |

---

## 📦 Project Structure

```txt
.
├── .github/workflows/update-data.yml   # Daily GitHub Action
├── public/
│   ├── data/
│   │   ├── countries.json              # Country list
│   │   ├── flags.json                  # Flag and continent metadata
│   │   └── committers/                 # One JSON file per country
│   ├── favicon.svg
│   ├── og-image.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── site.webmanifest
├── scripts/
│   └── generate-data.mjs               # Static data generator
├── src/
│   ├── api/                            # RTK Query API slices
│   ├── components/                     # UI and common components
│   ├── lib/seo.ts                      # Shared SEO constants
│   ├── pages/                          # Home and Country pages
│   ├── routes/
│   └── store/
├── generate-sitemap.cjs                # Sitemap generator
├── vercel.json                         # SPA rewrite config
└── package.json
```

---

## 🧠 How The Data Works

This project does **not** calculate rankings from followers, stars, or popularity.

The ranking data comes from:

```txt
https://committers.top/{country}
```

Example:

```txt
https://committers.top/sri_lanka
```

The script scrapes the public table from `committers.top`, parses each contributor row, and saves the result as static JSON.

Example output:

```txt
public/data/committers/sri_lanka.json
```

Each committers file contains:

```json
{
  "country": {
    "slug": "sri_lanka",
    "name": "Sri Lanka"
  },
  "generatedAt": "2026-07-21T15:46:38.743Z",
  "users": [
    {
      "rank": 1,
      "username": "example",
      "realname": "Example User",
      "profile": "https://github.com/example",
      "commits": 12345,
      "avatar": "https://avatars.githubusercontent.com/..."
    }
  ]
}
```

---

## ✅ How Users Appear In Rankings

The ranking is based on public GitHub activity data collected by `committers.top`.

Likely requirements:

- 👤 GitHub profile must be public
- 📍 GitHub location should include the correct country/region
- 🟢 Contributions and commits should be publicly visible
- 📈 User should have enough public commit activity
- 🌍 Country grouping depends on GitHub profile location

Followers are **not** the main ranking factor.

---

## 🤖 Daily Update System

The project includes a GitHub Action:

```txt
.github/workflows/update-data.yml
```

It runs every day at:

```txt
02:00 UTC
```

The workflow does this:

```txt
GitHub Action daily
        ↓
Run data generator
        ↓
Fetch committers.top data
        ↓
Write static JSON into public/data
        ↓
Generate sitemap.xml
        ↓
Commit changes to GitHub
        ↓
Vercel redeploys automatically
```

The workflow can also be run manually from the GitHub Actions tab because it supports:

```yaml
workflow_dispatch:
```

---

## 🛠️ Local Development

### 1. Clone The Repository

```bash
git clone https://github.com/RensithUdara/Github-Commiters-Top-Rank.git
cd Github-Commiters-Top-Rank
```

### 2. Install Dependencies

Recommended:

```bash
pnpm install
```

Alternative:

```bash
npm install
```

### 3. Generate Static Data

```bash
pnpm data:update
```

or:

```bash
node scripts/generate-data.mjs
```

### 4. Generate Sitemap

```bash
pnpm sitemap
```

or:

```bash
node generate-sitemap.cjs
```

### 5. Start Development Server

```bash
pnpm dev
```

Then open:

```txt
http://localhost:5173/
```

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start local Vite development server |
| `pnpm data:update` | Generate static country and committers JSON |
| `pnpm sitemap` | Generate `public/sitemap.xml` |
| `pnpm build` | Generate sitemap, type-check, and build production assets |
| `pnpm lint` | Run ESLint |
| `pnpm preview` | Preview production build locally |

---

## 🌐 Static Data Routes

After generation, the frontend reads static JSON from:

```txt
/data/countries.json
/data/flags.json
/data/committers/{country}.json
```

Examples:

```txt
/data/committers/sri_lanka.json
/data/committers/afghanistan.json
/data/committers/united_states.json
```

This makes the site fast and easy to host on Vercel because no backend server is required.

---

## 🚀 Deploy To Vercel

This project is already configured for Vercel.

### Vercel Settings

| Setting | Value |
|---|---|
| Framework | Vite |
| Build Command | `pnpm build` |
| Output Directory | `dist` |
| Install Command | `pnpm install` |

The app uses `vercel.json` for SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Production URL

```txt
https://github-commiters-top-rank.vercel.app
```

---

## 🔍 SEO Features

The site includes a complete SEO setup:

- ✅ Dynamic page titles
- ✅ Meta descriptions
- ✅ Canonical URLs
- ✅ Open Graph tags
- ✅ Twitter card tags
- ✅ `robots.txt`
- ✅ `sitemap.xml`
- ✅ `site.webmanifest`
- ✅ `og-image.svg`
- ✅ JSON-LD structured data
- ✅ Country-specific SEO pages
- ✅ Search-friendly URLs

Structured data includes:

- `WebSite`
- `Dataset`
- `WebPage`
- `BreadcrumbList`
- `ItemList`
- `Person`

---

## 🗺️ Sitemap

The sitemap is generated from:

```txt
public/data/countries.json
```

It includes:

- Home page
- 151 country leaderboard pages
- `lastmod`
- `changefreq`
- `priority`

Live sitemap:

```txt
https://github-commiters-top-rank.vercel.app/sitemap.xml
```

---

## 🎨 UI Design

The UI includes:

- 🌈 Colorful modern dashboard design
- 🧊 Glass-style surfaces
- 📱 Responsive layout
- 🌙 Dark mode
- 🏅 Rank badges
- 📊 Metric cards
- 🔎 Search and filter controls
- 🧭 Country cards with top contributors
- 🧑‍💻 GitHub profile dialog

---

## 🔐 Environment Variables

Optional:

```txt
VITE_GITHUB_TOKEN=
VITE_SITE_URL=
```

`VITE_GITHUB_TOKEN` can increase GitHub API rate limits for profile modal requests.

`VITE_SITE_URL` can override the production canonical URL.

Default site URL:

```txt
https://github-commiters-top-rank.vercel.app
```

---

## ⚠️ Notes

- This project depends on the public structure of `committers.top`.
- If `committers.top` changes its HTML table markup, `scripts/generate-data.mjs` may need parser updates.
- Rankings are based on `committers.top` data, not calculated directly by this app.
- Vercel deploys static files from `public/data`, so the site works without a backend.

---

## 👨‍💻 Author

**Rensith Udara Gonalagoda**

- 🌐 Website: https://rensithudara.com/
- 🐙 GitHub: https://github.com/RensithUdara
- 💼 LinkedIn: https://www.linkedin.com/in/rensith-udara-gonalagoda/

---

## 📄 License

This project is released under the MIT License.

---

## ⭐ Support

If this project helps you, consider starring the repository:

```txt
https://github.com/RensithUdara/Github-Commiters-Top-Rank
```

Made with ❤️ by **Rensith Udara Gonalagoda**.
