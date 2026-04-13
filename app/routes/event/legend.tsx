import { lazy, Suspense, useState } from "react";
import { Link, useParams } from "react-router";
import { doc, DocumentReference } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { PageHero } from "@/components/PageHero";
import { Loading } from "@/components/Loading";
import { Markdown } from "@/components/Markdown";
import { Share2 } from "lucide-react";

const ShareDialog = lazy(() => import("@/components/ShareDialog"));
import { timestampToDateStr } from "@/lib/date";
import type { Legend } from "@/lib/types";

const LegendDetailPage = () => {
  const event = useEvent();
  const { id } = useParams();
  const [shareOpen, setShareOpen] = useState(false);

  const [legend, loading] = useDocumentData<Legend>(
    doc(db, "legends", id!) as DocumentReference<Legend>,
  );

  if (loading || !legend) {
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

  if (legend.event !== event.id) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-grey-400 text-lg">Legenda nenalezena.</p>
      </div>
    );
  }

  return (
    <>
      <PageHero title={legend.title} image={legend.image?.src} />

      <section className="-mx-4 bg-primary-light text-primary">
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex flex-wrap gap-2">
              <Link
                to={`/${event.id}`}
                className="rounded-full border border-primary px-3 py-1 text-sm text-primary hover:bg-primary/5"
              >
                {event.name}
              </Link>
              {legend.publishedAt && (
                <span className="rounded-full border border-primary px-3 py-1 text-sm text-primary">
                  {timestampToDateStr(legend.publishedAt)}
                </span>
              )}
            </div>
            <div className="mt-6">
              <Markdown content={legend.content} />
            </div>
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
          title={legend.title}
          eventName={event.name}
        />
      </Suspense>
    </>
  );
};

export default LegendDetailPage;
