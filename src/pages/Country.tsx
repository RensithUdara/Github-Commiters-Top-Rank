import { useState, useEffect, useMemo } from "react";
import type { Committer, Mode, SortOption } from "@/types";
import { Helmet } from "react-helmet-async";
import {
  ErrorMessage,
  LoadingSpinner,
  UserTable,
  FilterBar,
  Header,
} from "@/components/common";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useGetCountryUsersQuery } from "@/api";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import {
  ArrowLeft,
  GitCommit,
  Search,
  SearchX,
  Trophy,
  Users,
  X,
} from "lucide-react";
import GoToTop from "@/components/common/GoToTop";
import { getDynamicDescription, SEO_KEYWORDS } from "./constants";
import {
  absoluteUrl,
  defaultOgImage,
  SITE_NAME,
  SITE_OWNER,
  SITE_URL,
  toTitle,
} from "@/lib/seo";

const PAGE_SIZE = 20;

const Country = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const mode = (searchParams.get("mode") as Mode) || "commits";
  const sortBy = (searchParams.get("sort") as SortOption) || "commits-desc";
  const searchQuery = searchParams.get("search") || "";

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [localData, setLocalData] = useState<Committer[]>([]);

  const { data, error, isFetching, refetch } = useGetCountryUsersQuery(
    slug ? { country: slug, mode } : skipToken,
    { refetchOnMountOrArgChange: true, refetchOnFocus: false },
  );

  useEffect(() => {
    if (data?.users) setLocalData(data.users);
    else if (!isFetching) setLocalData([]);
  }, [data, isFetching]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [mode, searchQuery, sortBy]);

  const sortedAndFilteredUsers = useMemo(() => {
    let users = [...localData];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      users = users.filter((u) => u.username.toLowerCase().includes(q));
    }
    users.sort((a, b) => {
      switch (sortBy) {
        case "alphabetical-asc":
          return a.username.localeCompare(b.username);
        case "alphabetical-desc":
          return b.username.localeCompare(a.username);
        case "commits-asc":
          return a.commits - b.commits;
        case "commits-desc":
        default:
          return b.commits - a.commits;
      }
    });
    return users;
  }, [localData, searchQuery, sortBy]);

  const visibleUsers = useMemo(
    () => sortedAndFilteredUsers.slice(0, visibleCount),
    [sortedAndFilteredUsers, visibleCount],
  );
  const hasMoreUsers = visibleCount < sortedAndFilteredUsers.length;

  useInfiniteScroll({
    isLoading: isFetching,
    hasMore: hasMoreUsers,
    onLoadMore: () => setVisibleCount((prev) => prev + PAGE_SIZE),
    threshold: 400,
  });

  const handleSearchChange = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set("search", val);
    else newParams.delete("search");
    setSearchParams(newParams);
  };

  const formattedCountryName =
    slug
      ?.split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || "";

  if (!slug)
    return (
      <ErrorMessage
        title="Invalid country"
        message="Country slug is missing."
      />
    );

  const currentYear = new Date().getFullYear();
  const totalCommits = sortedAndFilteredUsers.reduce(
    (sum, user) => sum + user.commits,
    0,
  );
  const topCommitter = sortedAndFilteredUsers[0];
  const titleText = toTitle(
    `Top GitHub Committers in ${formattedCountryName} (${currentYear})`,
  );
  const descriptionText = getDynamicDescription(
    formattedCountryName,
    sortedAndFilteredUsers.length,
    currentYear,
  );

  const keywordsText = [
    ...SEO_KEYWORDS.map((k) => `${k} in ${formattedCountryName}`),
    `best developers in ${formattedCountryName}`,
    `${formattedCountryName} github ranking`,
    `top programmers ${formattedCountryName}`,
  ].join(", ");

  const pageUrl = absoluteUrl(`/${slug}`);
  const topTenUsers = sortedAndFilteredUsers.slice(0, 10);
  const countryStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: titleText,
      description: descriptionText,
      url: pageUrl,
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
      },
      author: {
        "@type": "Person",
        name: SITE_OWNER,
        url: "https://rensithudara.com/",
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: formattedCountryName,
            item: pageUrl,
          },
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Top GitHub Users in ${formattedCountryName}`,
      description: descriptionText,
      numberOfItems: sortedAndFilteredUsers.length,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      itemListElement: topTenUsers.map((user, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: user.profile,
        name: user.realname || user.username,
        item: {
          "@type": "Person",
          name: user.realname || user.username,
          alternateName: user.username,
          url: user.profile,
          image: user.avatar,
        },
      })),
    },
  ];

  return (
    <div className="app-shell soft-grid relative min-h-screen px-5 pb-16 pt-20 mx-auto max-w-7xl sm:px-4 sm:pt-16">
      <Helmet>
        <title>{titleText}</title>
        <meta name="keywords" content={keywordsText} />
        <meta name="description" content={descriptionText} />
        <meta name="author" content={SITE_OWNER} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={titleText} />
        <meta property="og:description" content={descriptionText} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={defaultOgImage} />
        <meta
          property="og:image:alt"
          content={`Top GitHub committers in ${formattedCountryName}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={titleText} />
        <meta name="twitter:description" content={descriptionText} />
        <meta name="twitter:image" content={defaultOgImage} />
        <script type="application/ld+json">
          {JSON.stringify(countryStructuredData)}
        </script>
      </Helmet>

      <h1 className="sr-only">
        Top GitHub Users and Committers in {formattedCountryName}
      </h1>

      <Header countryName={formattedCountryName} />

      <section className="py-9 sm:py-6">
        <Link
          to="/"
          className="mb-6 inline-flex h-10 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-black text-gray-700 shadow-sm transition hover:border-teal-300 hover:text-teal-700 dark:border-white/10 dark:bg-white/10 dark:text-gray-200 dark:hover:text-teal-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Countries
        </Link>

        <div className="grid grid-cols-[1.1fr_0.9fr] items-end gap-6 lg:grid-cols-1">
          <div>
            <div className="accent-line mb-6 h-1 w-24 rounded-full" />
            <h2 className="hero-wordmark text-6xl font-black leading-[0.95] tracking-normal lg:text-5xl md:text-4xl">
              {formattedCountryName}
            </h2>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 ink-muted">
              Top public GitHub activity ranked by commits, contribution mode,
              and profile visibility.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
            {[
              {
                label: "Developers",
                value: sortedAndFilteredUsers.length,
                icon: Users,
                className:
                  "border-teal-200 bg-gradient-to-br from-white to-teal-50 text-teal-700 dark:border-teal-300/20 dark:from-teal-400/10 dark:to-gray-950 dark:text-teal-200",
              },
              {
                label: "Commits",
                value: totalCommits.toLocaleString(),
                icon: GitCommit,
                className:
                  "border-rose-200 bg-gradient-to-br from-white to-rose-50 text-rose-700 dark:border-rose-300/20 dark:from-rose-400/10 dark:to-gray-950 dark:text-rose-200",
              },
              {
                label: "Leader",
                value: topCommitter?.username || "--",
                icon: Trophy,
                className:
                  "border-amber-200 bg-gradient-to-br from-white to-amber-50 text-amber-700 dark:border-amber-300/20 dark:from-amber-400/10 dark:to-gray-950 dark:text-amber-200",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className={`surface color-surface rounded-lg p-4 ${metric.className}`}
              >
                <metric.icon className="mb-3 h-5 w-5 text-current" />
                <p className="truncate text-2xl font-black text-gray-950 dark:text-white sm:text-xl">
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

      <div className="surface mx-auto mb-10 flex w-full flex-col gap-3 rounded-lg p-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-all hover:border-teal-300 hover:text-teal-700 dark:border-white/10 dark:bg-gray-950/50 dark:hover:text-teal-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="relative flex-1">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={`Search in ${formattedCountryName}...`}
              className="h-11 w-full rounded-md border border-gray-200 bg-white pl-10 pr-12 text-sm font-medium text-gray-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-white/10 dark:bg-gray-950/50 dark:text-gray-100"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-4 top-1/2 hover:text-teal-700 dark:hover:text-teal-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <FilterBar
          mode={mode}
          sortBy={sortBy}
          isFetching={isFetching}
          refetch={refetch}
          embedded
        />
      </div>

      <div className="w-full">
        {isFetching && localData.length === 0 ? (
          <div className="flex flex-col items-center py-32">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorMessage title="Update Failed" message="Could not reach API." />
        ) : sortedAndFilteredUsers.length === 0 ? (
          <div className="surface rounded-lg border-2 border-dashed py-24 text-center">
            <SearchX className="w-20 h-20 mx-auto mb-6 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              No results found
            </h3>
          </div>
        ) : (
          <>
            <div className="pt-2 scroll-mt-36 duration-700 animate-in fade-in slide-in-from-bottom-4">
              <UserTable
                users={visibleUsers}
                countryName={formattedCountryName}
                countrySlug={slug}
              />
            </div>
            <section className="mx-auto mt-10 mb-12 max-w-2xl text-center duration-1000 animate-in fade-in">
              <h2 className="mb-4 text-3xl font-black text-gray-950 dark:text-white">
                Most Active GitHub Users in {formattedCountryName}
              </h2>
              <p className="leading-relaxed ink-muted">
                Looking for the <strong>top github contributors</strong> in{" "}
                <strong>{formattedCountryName}</strong>? Our real-time
                leaderboard analytics showcase the{" "}
                <strong>best software engineers</strong> and{" "}
                <strong>tech talent</strong> in the region for {currentYear}.
              </p>
              <p className="mt-4 leading-relaxed ink-muted">
                This ranking includes the top {sortedAndFilteredUsers.length}{" "}
                <strong>open source contributors</strong> and{" "}
                <strong>software development leaders</strong>, ranked by their
                public <strong>coding activity</strong> and{" "}
                <strong>commit history</strong>.
              </p>
            </section>
          </>
        )}
      </div>
      <GoToTop />
    </div>
  );
};

export default Country;
