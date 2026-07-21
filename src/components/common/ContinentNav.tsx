import { useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { LayoutGrid, Check } from "lucide-react";

interface ContinentNavProps {
  isContinentSort: boolean;
  setIsContinentSort: (val: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grouped: Record<string, any> | null;
  activeContinent: string;
  scrollToContinent: (id: string) => void;
  isFloating?: boolean;
}

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onChange(!checked);
    }}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
      checked ? "bg-teal-600" : "bg-gray-200 dark:bg-white/15"
    }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`}
    />
  </button>
);

export const ContinentNav = ({
  isContinentSort,
  setIsContinentSort,
  grouped,
  activeContinent,
  scrollToContinent,
  isFloating = false,
}: ContinentNavProps) => {
  const [visible, setVisible] = useState(false);

  const handleToggle = (val: boolean) => {
    setIsContinentSort(val);
    setVisible(false);
  };

  return (
    <>
      <div className="block">
        <Tippy
          interactive={true}
          visible={visible}
          onClickOutside={() => setVisible(false)}
          offset={[0, 15]}
          placement={isFloating ? "left" : "bottom"}
          theme="custom"
          content={
            <div className="surface w-60 rounded-lg p-2">
              <div className="mb-1 flex items-center justify-between rounded-md bg-gray-100 p-3 dark:bg-white/10">
                <div className="flex flex-col text-left">
                  <span className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Group by Region
                  </span>
                  <span className="text-[9px] font-medium text-gray-500 dark:text-gray-400">
                    Sort by continent
                  </span>
                </div>
                <Toggle checked={isContinentSort} onChange={handleToggle} />
              </div>
              {isContinentSort && grouped ? (
                <div className="flex flex-col gap-0.5 max-h-[40vh] overflow-y-auto p-1 custom-scrollbar">
                  {Object.keys(grouped).map((cont) => (
                    <button
                      key={cont}
                      onClick={() => {
                        scrollToContinent(cont);
                        setVisible(false);
                      }}
                      className={`flex items-center justify-between rounded-md p-3 text-left text-[11px] font-black uppercase ${
                        activeContinent === cont
                          ? "bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-200"
                          : "text-gray-500 active:bg-gray-100 dark:active:bg-white/10"
                      }`}
                    >
                      {cont}
                      {activeContinent === cont && (
                        <Check className="w-3 h-3 text-teal-600 dark:text-teal-200" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-6 px-4 text-center">
                  <LayoutGrid className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                    Grouping Disabled
                  </p>
                </div>
              )}
            </div>
          }
        >
          <button
            onClick={() => setVisible(!visible)}
            className={`flex items-center justify-center transition-all shadow-lg border ${
              isFloating
                ? "w-12 h-12 rounded-md"
                : "p-[10px] w-[46px] h-[46px] rounded-md"
            } ${
              isContinentSort
                ? "bg-gray-950 border-gray-950 text-white dark:bg-white dark:text-gray-950"
                : "bg-white dark:bg-gray-950/70 border-gray-200 dark:border-white/10 text-teal-600 dark:text-teal-300"
            }`}
          >
            <LayoutGrid className="w-5 h-5 text-current" />
          </button>
        </Tippy>
      </div>
    </>
  );
};
