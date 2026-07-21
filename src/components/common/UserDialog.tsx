import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import type { Committer } from "@/types";
import { useGetGitHubUserByUsernameQuery } from "@/api";

interface UserDialogProps {
  user: Committer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserDialog = ({ user, open, onOpenChange }: UserDialogProps) => {
  const {
    data: userInfo,
    error,
    isLoading,
  } = useGetGitHubUserByUsernameQuery(user.username, {
    skip: !open,
    refetchOnMountOrArgChange: false,
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md sm:max-w-[360px] surface rounded-lg">
          <DialogHeader className="pb-2 border-b border-gray-200 dark:border-white/10">
            <DialogTitle className="text-xl font-black text-gray-950 dark:text-white">
              User info: {user.username}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 min-h-[200px]">
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
                <div className="flex items-center space-x-5">
                  <img
                    src={userInfo.avatar_url}
                    alt={userInfo.login}
                    className="w-20 h-20 rounded-full border-2 border-white shadow-sm dark:border-gray-800"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
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
