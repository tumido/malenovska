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
    <div className="mb-8 flex min-h-[25vh] flex-col items-center justify-center pt-[10vh] text-white">
      {title && (
        <p className="mb-0 font-display text-3xl font-bold text-black md:text-5xl">
          {title}
        </p>
      )}
      <h1 className="font-display text-5xl font-bold md:text-7xl">
        {event.name.slice(0, splitAt)}
        <Logo size="0.65em" />
        {event.name.slice(splitAt + 1)}
      </h1>
      {children && <div className="mt-4 max-w-2xl text-center">{children}</div>}
    </div>
  );
};
