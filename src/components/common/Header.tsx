import { Switcher } from "@/components/common";
import {
  Activity,
  CircleQuestionMark,
  Github,
  Globe,
  Linkedin,
} from "lucide-react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface HeaderProps {
  countryName?: string;
}

export const Header = ({ countryName }: HeaderProps) => {
  const isHomePage = !countryName;

  return (
    <div
      id="header-section"
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/50 bg-white/80 backdrop-blur-2xl dark:border-white/10 dark:bg-gray-950/75"
    >
      <div className="accent-line h-1 w-full" />
      <div className="w-full px-5 mx-auto max-w-7xl sm:px-4">
        <div className="flex h-16 items-center justify-between gap-3 sm:h-14">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-gray-950 via-teal-700 to-indigo-700 text-white shadow-lg shadow-teal-900/15 dark:from-white dark:via-teal-100 dark:to-amber-100 dark:text-gray-950 sm:h-9 sm:w-9">
              <Github className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-[15px] font-black uppercase tracking-[0.18em] text-gray-950 dark:text-white sm:text-[11px] sm:tracking-[0.08em]">
                  Committers
                </p>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-black text-teal-700 dark:bg-teal-400/10 dark:text-teal-200 sm:hidden">
                  {isHomePage ? "Worldwide" : countryName}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-amber-500" />
                <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400 sm:max-w-[190px]">
                  {isHomePage
                    ? "Open-source activity by country"
                    : `Leaderboard for ${countryName}`}
                </p>
              </div>
            </div>
            <Tippy
              interactive={true}
              content={
                <span className="max-w-xs text-sm text-gray-200">
                  Rankings are read from committers.top and enriched with GitHub
                  profile data.
                </span>
              }
              placement="bottom"
            >
              <button className="shrink-0 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white">
                <CircleQuestionMark className="h-4 w-4" />
              </button>
            </Tippy>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1.5 shadow-sm dark:border-white/10 dark:bg-white/10 md:flex">
              <img
                src="https://github.com/RensithUdara.png?size=64"
                alt="Rensith Udara Gonalagoda"
                className="h-6 w-6 rounded-full"
              />
              <span className="max-w-[130px] truncate text-xs font-black text-gray-800 dark:text-gray-100">
                Rensith Udara
              </span>
            </div>
            <a
              href="https://rensithudara.com/"
              target="_blank"
              rel="noreferrer"
              className="hidden h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-teal-300 hover:text-teal-700 dark:border-white/10 dark:bg-white/10 dark:text-gray-200 dark:hover:text-teal-300 md:flex"
              aria-label="Rensith Udara website"
            >
              <Globe className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/RensithUdara"
              target="_blank"
              rel="noreferrer"
              className="hidden h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-teal-300 hover:text-teal-700 dark:border-white/10 dark:bg-white/10 dark:text-gray-200 dark:hover:text-teal-300 md:flex"
              aria-label="Rensith Udara GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/rensith-udara-gonalagoda/"
              target="_blank"
              rel="noreferrer"
              className="hidden h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-teal-300 hover:text-teal-700 dark:border-white/10 dark:bg-white/10 dark:text-gray-200 dark:hover:text-teal-300 md:flex"
              aria-label="Rensith Udara LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <Switcher />
          </div>
        </div>
      </div>
    </div>
  );
};
