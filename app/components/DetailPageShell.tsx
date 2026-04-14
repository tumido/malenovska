import { lazy, Suspense, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { useEvent } from "@/contexts/EventContext";
import { PageHero } from "@/components/PageHero";
import { Loading } from "@/components/Loading";
import { Share2, ArrowLeft } from "lucide-react";

const ShareDialog = lazy(() => import("@/components/ShareDialog"));

interface DetailPageShellProps {
  title: string;
  image?: string;
  entityEvent: string;
  notFoundMessage: string;
  shareTitle: string;
  loading: boolean;
  found: boolean;
  children: () => ReactNode;
}

export const DetailPageShell = ({
  title,
  image,
  entityEvent,
  notFoundMessage,
  shareTitle,
  loading,
  found,
  children,
}: DetailPageShellProps) => {
  const event = useEvent();
  const [shareOpen, setShareOpen] = useState(false);

  if (loading) {
    return (
      <>
        <PageHero title="..." />
        <section className="-mx-4 bg-primary-light text-primary">
          <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
            <Loading />
          </div>
        </section>
      </>
    );
  }

  if (!found || entityEvent !== event.id) {
    return (
      <>
        <PageHero title="Nenalezeno" compact />
        <div className="-mx-4 min-h-screen bg-linear-to-b from-black/80 to-black px-4 pt-16 text-center">
          <p className="mb-6 text-lg text-grey-400">{notFoundMessage}</p>
          <Link
            to={`/${event.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-white transition-colors hover:bg-secondary-dark"
          >
            <ArrowLeft size={18} />
            Zpět na hlavní stránku
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero title={title} image={image} />

      <section className="-mx-4 bg-primary-light text-primary">
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-3xl">
            {children()}
            <div className="mt-8 border-t border-primary/20 pt-4">
              <button
                onClick={() => setShareOpen(true)}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/60"
              >
                <Share2 size={16} />
                Sdílet
              </button>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <ShareDialog
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          title={shareTitle}
          eventName={event.name}
        />
      </Suspense>
    </>
  );
};
