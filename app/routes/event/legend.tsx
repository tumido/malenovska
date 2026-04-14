import { Link, useParams } from "react-router";
import { doc, DocumentReference } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { DetailPageShell } from "@/components/DetailPageShell";
import { Markdown } from "@/components/Markdown";
import { timestampToDateStr } from "@/lib/date";
import type { Legend } from "@/lib/types";

const LegendDetailPage = () => {
  const event = useEvent();
  const { id } = useParams();

  const [legend, loading] = useDocumentData<Legend>(
    doc(db, "legends", id!) as DocumentReference<Legend>,
  );

  return (
    <DetailPageShell
      title={legend?.title ?? "..."}
      image={legend?.image?.src}
      entityEvent={legend?.event ?? ""}
      notFoundMessage="Legenda nenalezena."
      shareTitle={legend?.title ?? ""}
      loading={loading}
      found={!!legend}
    >
      {() => (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            <Link
              to={`/${event.id}`}
              className="rounded-full border border-primary px-3 py-1 text-sm text-primary hover:bg-primary/5"
            >
              {event.name}
            </Link>
            {legend!.publishedAt && (
              <span className="rounded-full border border-primary px-3 py-1 text-sm text-primary">
                {timestampToDateStr(legend!.publishedAt)}
              </span>
            )}
          </div>
          <div className="mt-6">
            <Markdown content={legend!.content} />
          </div>
        </>
      )}
    </DetailPageShell>
  );
};

export default LegendDetailPage;
