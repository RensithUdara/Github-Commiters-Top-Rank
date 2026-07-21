import { useState, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { BarChart3, GitCommit, RefreshCw, Trophy } from "lucide-react";
import { Toast } from "@/components/common";
import type { Mode, SortOption } from "@/types";
import { useSearchParams } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface FilterBarProps {
  mode: Mode;
  sortBy: SortOption;
  isFetching: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: () => Promise<any>;
}

export const FilterBar = ({
  mode,
  refetch,
  sortBy,
  isFetching,
}: FilterBarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const [inputValue, setInputValue] = useState(urlSearch);
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (inputValue.trim()) {
        newParams.set("search", inputValue.trim());
      } else {
        newParams.delete("search");
      }
      setSearchParams(newParams, { replace: true });
    }, 400);

    return () => clearTimeout(handler);
  }, [inputValue, setSearchParams, searchParams]);

  useEffect(() => {
    setInputValue(urlSearch);
  }, [urlSearch]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "commits" && key === "mode") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleRefetch = async () => {
    setInternalLoading(true);
    try {
      const result = await refetch();
      if (result.error) {
        Toast("error", "Failed to refresh data");
      } else {
        Toast("success", "Ranking updated");
      }
    } catch {
      Toast("error", "Update failed");
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className="surface sticky top-[76px] z-30 mb-8 rounded-lg p-3 sm:top-[64px]">
      <div className="flex flex-row items-center justify-between gap-3 md:flex-col">
        <div className="flex w-full items-center gap-3 sm:gap-2">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(val) => val && updateParam("mode", val)}
            className="flex w-full gap-1 rounded-md bg-gray-100 p-1 dark:bg-white/10"
          >
            {[
              { value: "commits", icon: GitCommit },
              { value: "contributions", icon: Trophy },
              { value: "all", icon: BarChart3 },
            ].map((item) => (
              <ToggleGroupItem
                key={item.value}
                value={item.value}
                className="h-10 flex-1 rounded-md px-4 text-sm font-black capitalize transition-all hover:bg-white/80 hover:text-teal-700 data-[state=on]:bg-white data-[state=on]:text-gray-950 data-[state=on]:shadow-sm dark:hover:bg-white/10 dark:hover:text-teal-200 dark:data-[state=on]:bg-gray-950/80 dark:data-[state=on]:text-white sm:px-2 sm:text-xs"
              >
                <item.icon className="mr-2 h-4 w-4 sm:mr-1" />
                {item.value}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <Tippy content="Refresh database" placement="top">
            <button
              onClick={handleRefetch}
              disabled={isFetching || internalLoading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-all hover:border-teal-300 hover:text-teal-700 disabled:opacity-50 dark:border-white/10 dark:bg-gray-950/50 dark:hover:text-teal-300"
            >
              <RefreshCw
                className={`w-5 h-5 ${isFetching || internalLoading ? "animate-spin" : ""}`}
              />
            </button>
          </Tippy>
        </div>

        <div className="flex w-[220px] items-center gap-3 md:w-full">
          <Select
            value={sortBy}
            onValueChange={(val) => updateParam("sort", val)}
          >
            <SelectTrigger className="h-11 w-full rounded-md border border-gray-200 bg-white text-gray-800 focus:ring-4 focus:ring-teal-500/10 dark:border-white/10 dark:bg-gray-950/50 dark:text-gray-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="border-gray-200 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-gray-950/95">
              <SelectItem value="commits-desc">Most Commits</SelectItem>
              <SelectItem value="commits-asc">Least Commits</SelectItem>
              <SelectItem value="alphabetical-asc">Name (A-Z)</SelectItem>
              <SelectItem value="alphabetical-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
