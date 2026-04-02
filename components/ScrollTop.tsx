"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function ScrollTop({ anchor = "#top" }: { anchor?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    const el = document.querySelector(anchor);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <button
      onClick={handleClick}
      title="Na začátek stránky"
      aria-label="Na začátek stránky"
      className={`fixed bottom-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-all hover:bg-secondary-dark ${
        visible ? "scale-100 opacity-100" : "pointer-events-none scale-0 opacity-0"
      }`}
    >
      <ChevronUp size={24} />
    </button>
  );
}
