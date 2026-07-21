export const SITE_URL =
  import.meta.env.VITE_SITE_URL || "https://github-commiters-top-rank.vercel.app";

export const SITE_NAME = "GitHub Commiters Top Rank";
export const SITE_OWNER = "Rensith Udara Gonalagoda";
export const SITE_DESCRIPTION =
  "Explore ranked GitHub committers by country with daily updated open-source activity data, contributor profiles, and regional leaderboards.";
export const SITE_KEYWORDS = [
  "GitHub committers ranking",
  "top GitHub contributors",
  "GitHub contributors by country",
  "open source leaderboard",
  "developer rankings",
  "most active GitHub users",
  "GitHub profile analytics",
  "software engineer rankings",
  "country developer leaderboard",
  "open source contributors",
];

export const defaultOgImage = `${SITE_URL}/og-image.svg`;

export const absoluteUrl = (path = "/") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
};

export const toTitle = (title?: string) =>
  title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Global GitHub Committers Leaderboard`;
