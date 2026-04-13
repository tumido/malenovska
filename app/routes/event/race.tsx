import { lazy, Suspense, useState } from "react";
import { useParams } from "react-router";
import { doc, DocumentReference } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { PageHero } from "@/components/PageHero";
import { Loading } from "@/components/Loading";
import { Markdown } from "@/components/Markdown";
import { ColorBadge } from "@/components/ColorBadge";
import { Share2 } from "lucide-react";

const ShareDialog = lazy(() => import("@/components/ShareDialog"));
import type { Race } from "@/lib/types";

const RaceDetailPage = () => {
  const event = useEvent();
  const { id } = useParams();
  const [shareOpen, setShareOpen] = useState(false);

  const [race, loading] = useDocumentData<Race>(
    doc(db, "races", id!) as DocumentReference<Race>,
  );

  if (loading || !race) {
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

  if (race.event !== event.id) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-grey-400 text-lg">Strana nenalezena.</p>
      </div>
    );
  }

  return (
    <>
      <PageHero title={race.name} image={race.image?.src} />

      <section className="-mx-4 bg-primary-light text-primary">
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-3xl">
            <h3 className="mb-4 text-xl font-bold">Charakteristika strany</h3>
            <Markdown content={race.requirements} />
            <p className="mb-2">
              Kostým pro každou stranu je laděn do jiných barevných odstínů pro
              snadnější orientaci v boji.
            </p>
            <p className="mb-4">
              Barva této strany je:{" "}
              <ColorBadge color={race.color} colorName={race.colorName} />
            </p>
            <hr className="my-8 border-primary/20" />
            <h3 className="mb-4 text-xl font-bold">Příběh</h3>
            <Markdown content={race.legend} />
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
          title={race.name}
          eventName={event.name}
        />
      </Suspense>
    </>
  );
};

export default RaceDetailPage;
