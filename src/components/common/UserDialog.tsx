import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BadgeCheck, Check, Copy } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import type { Committer } from "@/types";
import { useGetGitHubUserByUsernameQuery } from "@/api";
import { useMemo, useState } from "react";
import { Toast } from "./Toast";

interface UserDialogProps {
  user: Committer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countrySlug?: string;
  countryName?: string;
}

export const UserDialog = ({
  user,
  open,
  onOpenChange,
  countrySlug,
  countryName,
}: UserDialogProps) => {
  const [badgeType, setBadgeType] = useState<"user" | "org">("user");
  const [copied, setCopied] = useState(false);
  const {
    data: userInfo,
    error,
    isLoading,
  } = useGetGitHubUserByUsernameQuery(user.username, {
    skip: !open,
    refetchOnMountOrArgChange: false,
  });
  const badgeSubject = badgeType === "user" ? user.username : user.username;
  const badgeBaseUrl = badgeType === "user" ? "user-badge" : "org-badge";
  const badgeUrl = countrySlug
    ? `https://${badgeBaseUrl}.committers.top/${countrySlug}/${badgeSubject}.svg`
    : "";
  const badgeLink = countrySlug
    ? `https://${badgeBaseUrl}.committers.top/${countrySlug}/${badgeSubject}`
    : "";
  const badgeMarkdown = useMemo(
    () =>
      badgeUrl && badgeLink
        ? `[![Committers Top Rank Badge](${badgeUrl})](${badgeLink})`
        : "",
    [badgeLink, badgeUrl],
  );

  const copyBadge = async () => {
    if (!badgeMarkdown) return;
    await navigator.clipboard.writeText(badgeMarkdown);
    setCopied(true);
    Toast("success", "Badge markdown copied");
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[min(92vw,680px)] max-w-none surface rounded-lg">
          <DialogHeader className="pb-2 border-b border-gray-200 dark:border-white/10">
            <DialogTitle className="text-xl font-black text-gray-950 dark:text-white">
              User info: {user.username}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 max-h-[72vh] min-h-[200px] overflow-y-auto pr-1">
            {isLoading && <LoadingSpinner />}
            {!isLoading && error && (
              <ErrorMessage
                title="Error loading data"
                message="Try refreshing the page."
                className="mt-10"
              />
            )}

            {userInfo && (
              <div className="space-y-4">
                <div className="flex items-center gap-5 sm:flex-col sm:items-start">
                  <img
                    src={userInfo.avatar_url}
                    alt={userInfo.login}
                    className="w-20 h-20 rounded-full border-2 border-white shadow-sm dark:border-gray-800"
                  />
                  <div className="flex min-w-0 flex-col">
                    <h3 className="break-words text-2xl font-bold leading-tight text-gray-900 dark:text-white">
                      {userInfo.name || userInfo.login}
                    </h3>
                    <a
                      href={userInfo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 flex items-center gap-1 dark:text-teal-300 hover:underline mt-1 text-sm font-bold"
                    >
                      View GitHub Profile <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>

                {userInfo.bio && (
                  <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                    {userInfo.bio}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-6 text-center text-sm">
                  <div>
                    <span className="block text-2xl font-semibold text-gray-900 dark:text-white">
                      {userInfo.followers}
                    </span>
                    <p className="text-gray-500 dark:text-gray-400">
                      Followers
                    </p>
                  </div>
                  <div>
                    <span className="block text-2xl font-semibold text-gray-900 dark:text-white">
                      {userInfo.following}
                    </span>
                    <p className="text-gray-500 dark:text-gray-400">
                      Following
                    </p>
                  </div>
                  <div>
                    <span className="block text-2xl font-semibold text-gray-900 dark:text-white">
                      {userInfo.public_repos}
                    </span>
                    <p className="text-gray-500 dark:text-gray-400">
                      Repositories
                    </p>
                  </div>
                </div>

                {userInfo.location && (
                  <p className="text-center text-gray-600 dark:text-gray-400 italic">
                    Location: {userInfo.location}
                  </p>
                )}

                {countrySlug && (
                  <div className="rounded-lg border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-indigo-50 p-3 dark:border-teal-300/20 dark:from-teal-400/10 dark:via-white/5 dark:to-indigo-400/10">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-teal-700 dark:text-teal-200" />
                        <div>
                          <p className="text-sm font-black text-gray-950 dark:text-white">
                            Committers Top Rank Badge
                          </p>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            {countryName || countrySlug}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 rounded-md bg-white p-1 shadow-sm dark:bg-gray-950/50">
                        {(["user", "org"] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setBadgeType(type)}
                            className={`rounded px-2 py-1 text-xs font-black uppercase ${
                              badgeType === type
                                ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950"
                                : "text-gray-500 hover:text-teal-700 dark:text-gray-400 dark:hover:text-teal-200"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3 overflow-x-auto rounded-md border border-gray-200 bg-gray-950 p-3 dark:border-white/10">
                      <img
                        src={badgeUrl}
                        alt={`${user.username} Committers Top Rank Badge`}
                        className="h-5 max-w-none"
                        loading="lazy"
                      />
                    </div>

                    <div className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-1">
                      <code className="block max-h-28 min-w-0 overflow-auto whitespace-pre-wrap break-all rounded-md border border-gray-200 bg-white px-3 py-2 text-xs leading-5 text-gray-700 dark:border-white/10 dark:bg-gray-950/50 dark:text-gray-300">
                        {badgeMarkdown}
                      </code>
                      <button
                        type="button"
                        onClick={copyBadge}
                        className="flex h-full min-h-10 w-12 shrink-0 items-center justify-center rounded-md bg-gray-950 text-white transition hover:bg-teal-700 dark:bg-white dark:text-gray-950 dark:hover:bg-teal-100 sm:w-full"
                        aria-label="Copy badge markdown"
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="grid border-t border-gray-200 pt-4 w-full dark:border-white/10">
            <Button className="w-full" onClick={() => onOpenChange(false)}>
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
