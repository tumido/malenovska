"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, DocumentReference } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { Article } from "@/components/Article";
import { ArticleCardHeader } from "@/components/ArticleCardHeader";
import { Markdown } from "@/components/Markdown";
import { ShareDialog } from "@/components/ShareDialog";
import { Share2 } from "lucide-react";
import { timestampToDateStr } from "@/lib/date";
import type { Legend } from "@/lib/types";

const LegendDetailPage = () => {
  const event = useEvent();
  const { id } = useParams<{ id: string }>();
  const [shareOpen, setShareOpen] = useState(false);

  const [legend, loading] = useDocumentData<Legend>(
    doc(db, "legends", id) as DocumentReference<Legend>
  );

  if (loading || !legend) return <Article />;

  if (legend.event !== event.id) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-grey-400 text-lg">Legenda nenalezena.</p>
      </div>
    );
  }

  return (
    <Article>
      <ArticleCardHeader title={legend.title} image={legend.image?.src} />
      <div className="p-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex flex-wrap gap-2">
            <Link
              href={`/${event.id}`}
              className="rounded-full border border-white/20 px-3 py-1 text-sm text-primary-light hover:bg-white/10"
            >
              {event.name}
            </Link>
            {legend.publishedAt && (
              <span className="rounded-full border border-white/20 px-3 py-1 text-sm text-primary-light">
                {timestampToDateStr(legend.publishedAt)}
              </span>
            )}
          </div>
          <div className="mt-6">
            <Markdown content={legend.content} />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-3">
        <button
          onClick={() => setShareOpen(true)}
          className="flex items-center gap-2 text-sm text-grey-400 hover:text-white"
        >
          <Share2 size={16} />
          Sdílet
        </button>
      </div>
      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={legend.title}
        eventName={event.name}
      />
    </Article>
  );
};

export default LegendDetailPage;
