"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { doc, DocumentReference } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { useEvent } from "@/contexts/EventContext";
import { Article } from "@/components/Article";
import { ArticleCardHeader } from "@/components/ArticleCardHeader";
import { Markdown } from "@/components/Markdown";
import { ColorBadge } from "@/components/ColorBadge";
import { ShareDialog } from "@/components/ShareDialog";
import { Share2 } from "lucide-react";
import type { Race } from "@/lib/types";

const RaceDetailPage = () => {
  const event = useEvent();
  const { id } = useParams<{ id: string }>();
  const [shareOpen, setShareOpen] = useState(false);

  const [race, loading] = useDocumentData<Race>(
    doc(db, "races", id) as DocumentReference<Race>
  );

  if (loading || !race) return <Article />;

  if (race.event !== event.id) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-grey-400 text-lg">Strana nenalezena.</p>
      </div>
    );
  }

  return (
    <Article>
      <ArticleCardHeader image={race.image?.src} title={race.name} />
      <div className="p-6">
        <div className="mx-auto max-w-3xl my-4">
          <h3 className="mb-4 text-xl font-bold">Charakteristika strany</h3>
          <Markdown content={race.requirements} />
          <p className="mb-2">
            Kostým pro každou stranu je laděn do jiných barevných odstínů pro
            snadnější orientaci v boji.
          </p>
          <p className="mb-4">
            Barva této strany je:
            <ColorBadge color={race.color} colorName={race.colorName} />
          </p>
        </div>
        <hr className="border-white/10" />
        <div className="mx-auto max-w-3xl my-4">
          <h3 className="mb-4 text-xl font-bold">Příběh</h3>
          <Markdown content={race.legend} />
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
        title={race.name}
        eventName={event.name}
      />
    </Article>
  );
};

export default RaceDetailPage;
