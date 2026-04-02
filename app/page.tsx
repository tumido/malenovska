"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, DocumentReference } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import type { Config } from "@/lib/types";
import { Loading } from "@/components/Loading";

export default function HomePage() {
  const router = useRouter();
  const [config, loading] = useDocumentData<Config>(
    doc(db, "config", "config") as DocumentReference<Config>
  );

  useEffect(() => {
    if (config?.event) {
      router.replace(`/${config.event}`);
    }
  }, [config, router]);

  if (loading || config) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-grey-400 text-lg">Nepodařilo se načíst konfiguraci.</p>
    </div>
  );
}
