import { useEvent } from "@/contexts/EventContext";
import { Logo } from "@/components/Logo";

interface PageHeroProps {
  title: string;
  image?: string;
  compact?: boolean;
  children?: React.ReactNode;
}

export const PageHero = ({ title, image, compact, children }: PageHeroProps) => {
  const event = useEvent();
  const splitAt = event.name.indexOf("o");
  const resolvedImage = image ?? event.heroImage?.src;

  return (
    <>
      {/* Fixed full-page background — compact pages use the hero image as page background */}
      {compact && resolvedImage && (
        <div
          className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${resolvedImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        </div>
      )}

      <section
        className={`relative -mx-4 -mt-2 flex items-center justify-center sm:-mt-5 ${
          compact
            ? "pb-6 pt-[10vh]"
            : "min-h-[40vh] lg:min-h-[50vh] xl:min-h-[60vh]"
        } ${!compact && resolvedImage ? "bg-primary bg-cover bg-center" : ""}`}
        style={{
          backgroundImage: !compact && resolvedImage ? `url(${resolvedImage})` : undefined,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="relative flex w-full flex-col items-center px-6">
          <div>
            <p className="-mb-2 font-display text-3xl font-semibold text-white/80 md:text-6xl">
              {title}
            </p>
            <h1 className="font-display text-5xl font-semibold text-white md:text-8xl">
              {event.name.slice(0, splitAt)}
              <Logo size="0.55em" />
              {event.name.slice(splitAt + 1)}
            </h1>
          </div>
          {children && (
            <div className="mt-4 max-w-3xl text-center text-white/80">
              {children}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
