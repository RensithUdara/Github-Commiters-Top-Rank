import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { useGetCountriesQuery } from "@/api/countriesApi";
import { useGetFlagsQuery } from "@/api/flagsApi";
import type { Committer } from "@/types";
import { UserDialog } from "@/components/common";
import { Header } from "../components/common/Header";
import { CountryCard } from "@/components/common/CountryCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import {
  Search,
  Globe,
  ArrowDownAZ,
  ArrowUpAZ,
  Loader2,
  Users,
  MapPinned,
  Sparkles,
} from "lucide-react";
import { ContinentNav } from "@/components/common/ContinentNav";
import GoToTop from "@/components/common/GoToTop";
import {
  absoluteUrl,
  defaultOgImage,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OWNER,
  SITE_URL,
  toTitle,
} from "@/lib/seo";

const COUNTRIES_PER_PAGE = 20;
type SortDirection = "asc" | "desc";

const HomeLoading = () => (
  <div className="w-full">
    <div className="surface flex flex-col items-center justify-center rounded-lg py-12 animate-pulse">
      <Loader2 className="w-10 h-10 mb-4 text-teal-500 animate-spin" />
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        Fetching global data...
      </h2>
      <p className="mt-2 text-sm ink-muted">Preparing the leaderboard</p>
    </div>

    <div className="grid grid-cols-3 gap-4 mt-5 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-[330px] surface rounded-lg animate-pulse"
        />
      ))}
    </div>
  </div>
);

const EmptyState = ({ searchQuery }: { searchQuery: string }) => (
  <div className="flex flex-col items-center justify-center col-span-3 py-16 text-center animate-fade-in">
    <div className="p-4 mb-4 text-gray-400 rounded-md bg-white dark:bg-gray-800/50 dark:text-gray-500">
      <Search className="w-8 h-8" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
      Nothing found
    </h3>
    <p className="max-w-xs mt-2 text-sm text-gray-400">
      No countries found matching{" "}
      <span className="font-semibold text-blue-500">"{searchQuery}"</span>.
      Please check your spelling or try another search.
    </p>
  </div>
);

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: allCountries = [], isLoading: isLoadingCountries } =
    useGetCountriesQuery();
  const { data: flagsData = [] } = useGetFlagsQuery();

  const [selectedUser, setSelectedUser] = useState<Committer | null>(null);
  const [visibleCount, setVisibleCount] = useState(COUNTRIES_PER_PAGE);
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [isContinentSort, setIsContinentSort] = useState(false);
  const [activeContinent, setActiveContinent] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortDirection>("asc");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearch(urlSearch);
  }, [searchParams]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setVisibleCount(COUNTRIES_PER_PAGE);

    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) nextParams.set("search", value.trim());
    else nextParams.delete("search");
    setSearchParams(nextParams, { replace: true });
  };

  const countryToContinent = useMemo(() => {
    const map: Record<string, string> = {};

    if (Array.isArray(flagsData)) {
      flagsData.forEach((item) => {
        if (item.name && item.continent) {
          map[item.name.toLowerCase()] = item.continent;
        }
      });
    }
    return map;
  }, [flagsData]);

  const filteredCountries = useMemo(() => {
    let filtered = [...allCountries];
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.slug.toLowerCase().includes(query),
      );
    }
    filtered.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
    return filtered;
  }, [allCountries, search, sortOrder]);

  const grouped = useMemo(() => {
    if (!isContinentSort) return null;
    const groups: Record<string, typeof allCountries> = {};
    filteredCountries.forEach((c) => {
      const cont = countryToContinent[c.name.toLowerCase()] || "Other";
      if (!groups[cont]) groups[cont] = [];
      groups[cont].push(c);
    });
    return Object.keys(groups)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = groups[key];
          return acc;
        },
        {} as Record<string, typeof allCountries>,
      );
  }, [filteredCountries, isContinentSort, countryToContinent]);

  const visibleCountries = useMemo(
    () => filteredCountries.slice(0, visibleCount),
    [filteredCountries, visibleCount],
  );
  const hasMoreCountries = visibleCount < filteredCountries.length;

  const totalDisplayedCommitters = useMemo(
    () =>
      visibleCountries.reduce((sum, country) => {
        return sum + (country.slug ? 1 : 0);
      }, 0),
    [visibleCountries],
  );

  useInfiniteScroll({
    isLoading: isLoadingCountries,
    hasMore: hasMoreCountries && !isContinentSort,
    onLoadMore: () => setVisibleCount((prev) => prev + COUNTRIES_PER_PAGE),
    threshold: 200,
  });

  useEffect(() => {
    if (!isContinentSort || !grouped) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveContinent(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    Object.keys(grouped).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isContinentSort, grouped, search]);

  const scrollToContinent = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setVisibleCount(COUNTRIES_PER_PAGE);
  };

  const homeTitle = toTitle("Global GitHub Committers Leaderboard");
  const homeDescription = SITE_DESCRIPTION;
  const homeUrl = absoluteUrl("/");
  const homeStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: homeDescription,
      publisher: {
        "@type": "Person",
        name: SITE_OWNER,
        url: "https://rensithudara.com/",
        sameAs: [
          "https://github.com/RensithUdara",
          "https://www.linkedin.com/in/rensith-udara-gonalagoda/",
        ],
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${homeUrl}?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "GitHub Committers Rankings by Country",
      description: homeDescription,
      url: homeUrl,
      creator: {
        "@type": "Person",
        name: SITE_OWNER,
      },
      license: "https://opensource.org/license/mit",
      keywords: SITE_KEYWORDS,
      temporalCoverage: `${new Date().getFullYear()}`,
      spatialCoverage: "Worldwide",
    },
  ];

  return (
    <div className="app-shell relative min-h-screen px-5 pb-16 pt-20 mx-auto max-w-7xl sm:px-4 sm:pt-16">
      <Helmet>
        <title>{homeTitle}</title>
        <meta name="description" content={homeDescription} />
        <meta name="keywords" content={SITE_KEYWORDS.join(", ")} />
        <meta name="author" content={SITE_OWNER} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={homeUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={homeTitle} />
        <meta property="og:description" content={homeDescription} />
        <meta property="og:url" content={homeUrl} />
        <meta property="og:image" content={defaultOgImage} />
        <meta property="og:image:alt" content={`${SITE_NAME} preview`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={homeTitle} />
        <meta name="twitter:description" content={homeDescription} />
        <meta name="twitter:image" content={defaultOgImage} />
        <script type="application/ld+json">
          {JSON.stringify(homeStructuredData)}
        </script>
      </Helmet>

      <h1 className="sr-only">
        Top GitHub Committers Worldwide - Global Ranking by Country
      </h1>

      <Header />

      <section className="relative py-10 sm:py-7">
        <div className="accent-line mb-7 h-1 w-28 rounded-full" />
        <div className="grid grid-cols-[1.25fr_0.75fr] items-end gap-6 lg:grid-cols-1">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-700 dark:border-teal-400/20 dark:bg-teal-400/10 dark:text-teal-200">
              <Sparkles className="h-3.5 w-3.5" />
              Global index
            </div>
            <h2 className="max-w-4xl text-6xl font-black leading-[0.95] tracking-normal text-gray-950 dark:text-white lg:text-5xl md:text-4xl">
              Find the most active GitHub contributors by country.
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
            {[
              {
                label: "Countries",
                value: isLoadingCountries ? "--" : allCountries.length,
                icon: MapPinned,
              },
              {
                label: "Visible",
                value: isLoadingCountries ? "--" : filteredCountries.length,
                icon: Globe,
              },
              {
                label: "Cards",
                value: isLoadingCountries ? "--" : totalDisplayedCommitters,
                icon: Users,
              },
            ].map((metric) => (
              <div key={metric.label} className="surface rounded-lg p-4">
                <metric.icon className="mb-3 h-5 w-5 text-teal-600 dark:text-teal-300" />
                <p className="text-2xl font-black text-gray-950 dark:text-white">
                  {metric.value}
                </p>
                <p className="text-xs font-bold uppercase tracking-[0.16em] ink-muted">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="surface sticky top-[76px] z-30 mb-7 flex items-center gap-3 rounded-lg p-3 sm:top-[64px] md:flex-wrap">
        <div className="relative min-w-[260px] flex-1 md:min-w-0 md:basis-full">
          <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              handleSearchChange(e.target.value);
            }}
            placeholder="Search countries..."
            className="h-11 w-full rounded-md border border-gray-200 bg-white pl-10 pr-4 text-sm font-medium text-gray-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-white/10 dark:bg-gray-950/50 dark:text-gray-100"
          />
        </div>

        <button
          onClick={toggleSort}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-amber-300 hover:text-amber-600 dark:border-white/10 dark:bg-gray-950/50 dark:text-gray-300 dark:hover:border-amber-400/40 dark:hover:text-amber-300"
        >
          {sortOrder === "asc" ? (
            <ArrowDownAZ className="w-5 h-5 text-teal-600 dark:text-teal-300" />
          ) : (
            <ArrowUpAZ className="w-5 h-5 text-teal-600 dark:text-teal-300" />
          )}
        </button>

        {!isLoadingCountries && (
          <ContinentNav
            isContinentSort={isContinentSort}
            setIsContinentSort={setIsContinentSort}
            grouped={grouped}
            activeContinent={activeContinent}
            scrollToContinent={scrollToContinent}
            isFloating={false}
          />
        )}
      </div>

      {isLoadingCountries ? (
        <HomeLoading />
      ) : filteredCountries.length === 0 ? (
        <div className="grid grid-cols-3 gap-4 md:grid-cols-1 lg:grid-cols-2 sm:grid-cols-1">
          <EmptyState searchQuery={search} />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 md:grid-cols-1 lg:grid-cols-2 sm:grid-cols-1">
          {isContinentSort && grouped ? (
            Object.entries(grouped).map(([continent, countries]) => (
              <div
                key={continent}
                id={continent}
                className="col-span-3 scroll-mt-[130px] animate-fade-in-up"
              >
                <div className="flex items-center gap-4 mt-4 mb-5">
                  <div
                    className={`p-2.5 rounded-md ${activeContinent === continent ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950" : "surface text-teal-600 dark:text-teal-300"}`}
                  >
                    <Globe className="w-4 h-4" />
                  </div>
                  <h2 className="text-2xl font-black tracking-normal uppercase text-gray-950 dark:text-white sm:text-lg">
                    {continent}
                  </h2>
                  <div className="h-[1px] flex-1 bg-gray-200 dark:bg-white/10"></div>
                  <span className="rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-bold ink-muted dark:border-white/10 dark:bg-white/10 whitespace-nowrap">
                    {countries.length}{" "}
                    <span className="sm:hidden">countries</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
                  {countries.map((c) => (
                    <CountryCard
                      key={c.slug}
                      country={c}
                      onUserClick={setSelectedUser}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-3 col-span-3 gap-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
              {visibleCountries.map((c) => (
                <CountryCard
                  key={c.slug}
                  country={c}
                  onUserClick={setSelectedUser}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {isScrolled && (
        <div className="hidden sm:flex fixed bottom-[85px] right-6 z-50 flex-col gap-3 animate-fade-in-up">
          <ContinentNav
            isContinentSort={isContinentSort}
            setIsContinentSort={setIsContinentSort}
            grouped={grouped}
            activeContinent={activeContinent}
            scrollToContinent={scrollToContinent}
            isFloating={true}
          />
        </div>
      )}

      <GoToTop />
      {selectedUser && (
        <UserDialog
          user={selectedUser}
          open={true}
          onOpenChange={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default Home;
