import { Github, Globe, Linkedin, Sparkles } from "lucide-react";

const brandLinks = [
  {
    label: "Website",
    href: "https://rensithudara.com/",
    icon: Globe,
  },
  {
    label: "GitHub",
    href: "https://github.com/RensithUdara",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rensith-udara-gonalagoda/",
    icon: Linkedin,
  },
];

export const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-gradient-to-r from-teal-50/70 via-white/65 to-amber-50/70 py-8 backdrop-blur-xl dark:border-white/10 dark:from-teal-950/35 dark:via-gray-950/55 dark:to-indigo-950/35">
      <div className="mx-auto max-w-7xl px-5 sm:px-4">
        <div className="surface color-surface grid grid-cols-[1fr_auto] items-center gap-6 rounded-lg p-5 md:grid-cols-1">
          <div className="flex items-center gap-4">
            <img
              src="https://github.com/RensithUdara.png?size=128"
              alt="Rensith Udara Gonalagoda"
              className="h-14 w-14 rounded-md border-2 border-white shadow-lg shadow-teal-900/15 dark:border-white/10"
            />
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-300" />
                <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700 dark:text-teal-200">
                  Developed by
                </p>
              </div>
              <h2 className="text-xl font-black text-gray-950 dark:text-white">
                Rensith Udara Gonalagoda
              </h2>
              <p className="mt-1 max-w-2xl text-sm font-medium leading-6 ink-muted">
                Committers is a global open-source activity explorer, curated
                with a clean analytics experience for developers and teams.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {brandLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-black text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 dark:border-white/10 dark:bg-gray-950/50 dark:text-gray-200 dark:hover:bg-teal-400/10 dark:hover:text-teal-300"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <p className="mt-5 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Committers Top Rank. Rensith Udara Gonalagoda
          developed project.
        </p>
      </div>
    </footer>
  );
};
