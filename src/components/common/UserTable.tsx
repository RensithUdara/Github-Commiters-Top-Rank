import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Committer } from "@/types";
import { UserDialog } from "./UserDialog";
import { ArrowUpRight, GitCommit, Medal, Trophy, Users } from "lucide-react";

interface UserTableProps {
  users: Committer[];
  countryName: string;
  countrySlug?: string;
}

export const UserTable = ({ users, countryName, countrySlug }: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<Committer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const deepLinkedUser = searchParams.get("user");

  const openDialog = (user: Committer) => {
    setSelectedUser(user);
    setDialogOpen(true);
    if (countrySlug) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("user", user.username);
      setSearchParams(nextParams, { replace: true });
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open && deepLinkedUser) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("user");
      setSearchParams(nextParams, { replace: true });
    }
  };

  useEffect(() => {
    if (!deepLinkedUser || users.length === 0) return;

    const user = users.find(
      (item) => item.username.toLowerCase() === deepLinkedUser.toLowerCase(),
    );

    if (user) {
      setSelectedUser(user);
      setDialogOpen(true);
    }
  }, [deepLinkedUser, users]);

  const rankStyle = (rank: number) => {
    if (rank === 1)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-300/15 dark:text-yellow-200";
    if (rank === 2)
      return "bg-slate-200 text-slate-700 dark:bg-slate-300/15 dark:text-slate-200";
    if (rank === 3)
      return "bg-orange-100 text-orange-800 dark:bg-orange-300/15 dark:text-orange-200";
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-300/15 dark:text-emerald-200";
  };

  const medalStyle = (rank: number) => {
    if (rank === 1) return "text-yellow-500";
    if (rank === 2) return "text-slate-400";
    if (rank === 3) return "text-orange-600";
    return "text-emerald-600 dark:text-emerald-300";
  };

  return (
    <>
      <div className="surface color-surface relative overflow-hidden rounded-lg">
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 via-indigo-50 to-amber-50 px-5 py-4 dark:border-white/10 dark:from-teal-400/10 dark:via-indigo-400/10 dark:to-amber-400/10 sm:flex-col sm:items-start">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-300" />
              <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700 dark:text-teal-200">
                Leaderboard
              </p>
            </div>
            <h3 className="text-xl font-black text-gray-950 dark:text-white">
              Top GitHub Committers in {countryName}
            </h3>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-indigo-200 bg-white px-3 py-2 text-sm font-black text-indigo-700 shadow-sm dark:border-indigo-300/20 dark:bg-gray-950/50 dark:text-indigo-200">
            <Users className="h-4 w-4" />
            {users.length.toLocaleString()} shown
          </div>
        </div>
        <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gradient-to-r from-teal-50 via-indigo-50 to-amber-50 dark:border-white/10 dark:from-teal-400/10 dark:via-indigo-400/10 dark:to-amber-400/10">
              <TableHead className="sticky left-0 min-w-[72px] bg-teal-50/95 text-center text-xs font-black uppercase tracking-[0.14em] text-teal-700 backdrop-blur dark:bg-gray-900/95 dark:text-teal-200">
                Rank
              </TableHead>
              <TableHead className="min-w-[260px] text-xs font-black uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-200">
                User
              </TableHead>
              <TableHead className="text-center min-w-[140px] text-xs font-black uppercase tracking-[0.14em] text-rose-700 dark:text-rose-200">
                Commits
              </TableHead>
              <TableHead className="text-center min-w-[120px] text-xs font-black uppercase tracking-[0.14em] text-amber-700 dark:text-amber-200">
                Profile
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              return (
                <TableRow
                  key={user.username}
                  className="border-b border-gray-100 duration-200 odd:bg-white/45 hover:bg-gradient-to-r hover:from-teal-50/90 hover:via-indigo-50/60 hover:to-amber-50/60 dark:border-white/10 dark:odd:bg-white/[0.02] dark:hover:from-teal-400/10 dark:hover:via-indigo-400/10 dark:hover:to-amber-400/10"
                >
                  <TableCell className="sticky left-0 bg-white/90 text-center font-black backdrop-blur dark:bg-gray-900/90">
                    <span className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 ${rankStyle(user.rank)}`}>
                      {user.rank}
                    </span>
                  </TableCell>

                  <TableCell>
                    <button
                      className="flex min-w-0 cursor-pointer items-center gap-3 bg-transparent text-left"
                      onClick={() => openDialog(user)}
                    >
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={`${user.username} GitHub profile - Top Committer in ${countryName}`}
                        className="h-11 w-11 shrink-0 rounded-full border-2 border-white shadow-sm dark:border-gray-800"
                        loading="lazy"
                      />
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 font-black text-gray-950 hover:text-teal-700 dark:text-white dark:hover:text-teal-300">
                          {user.username}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                        <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                          {user.realname || "GitHub contributor"}
                        </span>
                      </span>
                    </button>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 font-black text-gray-900 dark:bg-white/10 dark:text-gray-100">
                      <GitCommit className="h-4 w-4 text-rose-500" />
                      {user.commits.toLocaleString()}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <Medal className={`mx-auto h-5 w-5 ${medalStyle(user.rank)}`} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </div>
      </div>

      {selectedUser && (
        <UserDialog
          user={selectedUser}
          open={dialogOpen}
          key={selectedUser.username}
          onOpenChange={handleDialogOpenChange}
          countrySlug={countrySlug}
          countryName={countryName}
        />
      )}
    </>
  );
};
