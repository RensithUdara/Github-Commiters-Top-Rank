import { Link } from "react-router-dom";
import { useGetCountryUsersQuery } from "@/api";
import { useGetFlagsQuery } from "@/api/flagsApi";
import type { Committer } from "@/types";
import {
  ChevronRight,
  GitCommit,
  Medal,
  TrendingUp,
  Users,
} from "lucide-react";
import Tippy from "@tippyjs/react";
import { useMemo } from "react";

export const CountryCard = ({
  country,
  onUserClick,
}: {
  country: { slug: string; name: string };
  onUserClick: (user: Committer) => void;
}) => {
  const { data, isLoading } = useGetCountryUsersQuery({
    country: country.slug,
    mode: "all",
  });

  const { data: flags } = useGetFlagsQuery();
  const flagUrl = useMemo(() => {
    if (!flags || !Array.isArray(flags)) return undefined;

    return flags.find(
      (f) => f.name && f.name.toLowerCase() === country.name.toLowerCase(),
    )?.flagUrl;
  }, [flags, country.name]);

  const topUsers = data?.users?.slice(0, 3) || [];
  const totalUsers = data?.users?.length || 0;
  const totalCommits =
    data?.users?.reduce((sum, user) => sum + user.commits, 0) || 0;
  const avgCommits = totalUsers ? Math.round(totalCommits / totalUsers) : 0;
  const accent =
    country.slug.length % 4 === 0
      ? "from-teal-500 to-cyan-500"
      : country.slug.length % 4 === 1
        ? "from-indigo-500 to-violet-500"
        : country.slug.length % 4 === 2
          ? "from-amber-500 to-orange-500"
          : "from-rose-500 to-pink-500";

  return (
    <Link to={`/${country.slug}`} className="block h-full group">
      <div className="surface color-surface flex h-full flex-col rounded-lg p-4 transition duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-900/10 dark:hover:shadow-black/30">
        <div className={`-mx-4 -mt-4 mb-4 h-1.5 rounded-t-lg bg-gradient-to-r ${accent}`} />
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative shrink-0">
              {isLoading ? (
                <div className="h-8 w-11 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
              ) : flagUrl ? (
                <img
                  src={flagUrl}
                  className="h-8 w-11 rounded-md border object-cover shadow-sm dark:border-white/10"
                  alt={`${country.name} flag`}
                  loading="lazy"
                />
              ) : (
                <div className="flex h-8 w-11 items-center justify-center rounded-md border bg-gray-100 text-xs font-bold text-gray-500 dark:border-white/10 dark:bg-white/10">
                  --
                </div>
              )}
              {!isLoading && (
                <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-gradient-to-br ${accent} dark:border-gray-900`} />
              )}
            </div>

            <div className="min-w-0">
              {isLoading ? (
                <>
                  <div className="mb-1 h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </>
              ) : (
                <>
                  <h3 className="truncate text-lg font-black text-gray-950 group-hover:text-teal-700 dark:text-gray-100 dark:group-hover:text-teal-300">
                    {country.name}
                  </h3>
                  <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                    {country.slug}
                  </p>
                </>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="h-8 w-16 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
          ) : totalUsers > 0 ? (
            <Tippy content="Average commits per developer" placement="top">
              <div className="flex shrink-0 cursor-help items-center gap-1.5 rounded-md border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1 text-amber-800 dark:border-amber-300/20 dark:from-amber-300/10 dark:to-orange-300/10 dark:text-amber-200">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-sm font-black">
                  {avgCommits.toLocaleString()}
                </span>
              </div>
            </Tippy>
          ) : (
            <div className="rounded-md bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500 dark:bg-white/10">
              --
            </div>
          )}
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2">
          <span className="rounded-md border border-teal-100 bg-teal-50 px-3 py-2 text-sm font-bold text-teal-800 dark:border-teal-300/20 dark:bg-teal-400/10 dark:text-teal-200">
            <Users className="mr-1.5 inline h-4 w-4 text-teal-600 dark:text-teal-300" />
            {isLoading ? "--" : `${totalUsers} devs`}
          </span>
          <span className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-800 dark:border-rose-300/20 dark:bg-rose-400/10 dark:text-rose-200">
            <GitCommit className="mr-1.5 inline h-4 w-4 text-rose-500" />
            {isLoading ? "--" : totalCommits.toLocaleString()}
          </span>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="h-px w-full bg-gray-200 dark:bg-white/10" />
          <span className="whitespace-nowrap text-[11px] font-black uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
            Top contributors
          </span>
          <div className="h-px w-full bg-gray-200 dark:bg-white/10" />
        </div>

        <div className="flex-1 space-y-2">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div>
                    <div className="mb-1 h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            ))
          ) : topUsers.length > 0 ? (
            topUsers.map((user, index) => (
              <div
                key={user.username}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUserClick(user);
                }}
              className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 dark:hover:from-teal-400/10 dark:hover:to-cyan-400/10"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={user.avatar}
                    className="h-8 w-8 shrink-0 rounded-full border-2 border-white shadow-sm dark:border-gray-800"
                    alt={user.username}
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                      {user.username}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-gray-500">
                      <GitCommit className="h-3 w-3" />
                      {user.commits.toLocaleString()} commits
                    </p>
                  </div>
                </div>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-300/10 dark:text-yellow-200"
                      : index === 1
                        ? "bg-slate-200 text-slate-600 dark:bg-slate-300/10 dark:text-slate-200"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-300/10 dark:text-orange-200"
                  }`}
                >
                  <Medal className="h-4 w-4" />
                </span>
              </div>
            ))
          ) : (
            <div className="rounded-md border border-dashed border-gray-200 p-4 text-center text-sm font-semibold text-gray-500 dark:border-white/10">
              No ranking data
            </div>
          )}
        </div>

        {totalUsers > 0 && !isLoading && (
          <div className="mt-5 border-t border-gray-100 pt-4 dark:border-white/10">
            <div className="flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-gray-950 to-teal-800 px-3 py-2 text-sm font-black text-white transition group-hover:from-teal-700 group-hover:to-indigo-700 dark:from-white dark:to-teal-100 dark:text-gray-950">
              <span>View leaderboard</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};
