"use client";

import { useEvent } from "@/contexts/EventContext";
import { Logo } from "@/components/Logo";

interface BannerProps {
  title?: string;
  children?: React.ReactNode;
}

export const Banner = ({ title, children }: BannerProps) => {
  const event = useEvent();
  const splitAt = event.name.indexOf("o");

  return (
    <div className="mb-8 flex min-h-[25vh] flex-col items-center pt-[10vh] text-white max-w-7xl mx-auto">
      <div>
        {title && (
          <p className="-mb-2 font-display text-3xl font-semibold text-black md:text-6xl">
            {title}
          </p>
        )}
        <h1 className="font-display text-5xl font-semibold md:text-8xl">
          {event.name.slice(0, splitAt)}
          <Logo size="0.55em" />
          {event.name.slice(splitAt + 1)}
        </h1>
      </div>
      {children && <div className="mt-4 text-center">{children}</div>}
    </div>
  );
};
