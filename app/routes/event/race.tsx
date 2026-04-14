import { useParams } from "react-router";
import { doc, DocumentReference } from "firebase/firestore";
import { useDocumentData } from "@/lib/firestore-hooks";
import { db } from "@/lib/firebase";
import { DetailPageShell } from "@/components/DetailPageShell";
import { Markdown } from "@/components/Markdown";
import { ColorBadge } from "@/components/ColorBadge";
import type { Race } from "@/lib/types";

const RaceDetailPage = () => {
  const { id } = useParams();

  const [race, loading] = useDocumentData<Race>(
    doc(db, "races", id!) as DocumentReference<Race>,
  );

  return (
    <DetailPageShell
      title={race?.name ?? "..."}
      image={race?.image?.src}
      entityEvent={race?.event ?? ""}
      notFoundMessage="Strana nenalezena."
      shareTitle={race?.name ?? ""}
      loading={loading}
      found={!!race}
    >
      {() => (
        <>
          <h3 className="mb-4 text-xl font-bold">Charakteristika strany</h3>
          <Markdown content={race!.requirements} />
          <p className="mb-2">
            Kostým pro každou stranu je laděn do jiných barevných odstínů pro
            snadnější orientaci v boji.
          </p>
          <p className="mb-4">
            Barva této strany je:{" "}
            <ColorBadge color={race!.color} colorName={race!.colorName} />
          </p>
          <hr className="my-8 border-primary/20" />
          <h3 className="mb-4 text-xl font-bold">Příběh</h3>
          <Markdown content={race!.legend} />
        </>
      )}
    </DetailPageShell>
  );
};

export default RaceDetailPage;
