import { useState } from "react";
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
import { ArrowUpRight, GitCommit, Medal } from "lucide-react";

interface UserTableProps {
  users: Committer[];
  countryName: string;
}

export const UserTable = ({ users, countryName }: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<Committer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = (user: Committer) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="surface relative overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50/80 dark:border-white/10 dark:bg-white/5">
              <TableHead className="sticky left-0 min-w-[72px] bg-gray-50/95 text-center text-xs font-black uppercase tracking-[0.14em] text-gray-500 backdrop-blur dark:bg-gray-900/95">
                Rank
              </TableHead>
              <TableHead className="min-w-[260px] text-xs font-black uppercase tracking-[0.14em] text-gray-500">
                User
              </TableHead>
              <TableHead className="text-center min-w-[140px] text-xs font-black uppercase tracking-[0.14em] text-gray-500">
                Commits
              </TableHead>
              <TableHead className="text-center min-w-[120px] text-xs font-black uppercase tracking-[0.14em] text-gray-500">
                Profile
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              return (
                <TableRow
                  key={user.username}
                  className="border-b border-gray-100 duration-200 hover:bg-teal-50/70 dark:border-white/10 dark:hover:bg-white/10"
                >
                  <TableCell className="sticky left-0 bg-white/90 text-center font-black backdrop-blur dark:bg-gray-900/90">
                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-gray-100 px-2 text-gray-800 dark:bg-white/10 dark:text-gray-100">
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
                    <Medal className="mx-auto h-5 w-5 text-amber-500" />
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
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
};
