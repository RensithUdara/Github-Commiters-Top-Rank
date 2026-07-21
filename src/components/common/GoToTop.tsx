import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface GoToTopProps {
  children?: React.ReactNode;
}

const GoToTop = ({ children }: GoToTopProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3 animate-fade-in-up">
      {children}

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Go to top"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl transition-all active:scale-90"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default GoToTop;
