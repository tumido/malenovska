import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { doc, type DocumentReference } from "firebase/firestore";
import { useDocumentData } from "@/lib/firestore-hooks";
import { db } from "@/lib/firebase";

const METADATA_KEYS = new Set(["id", "createdate", "lastupdate", "createdby"]);

export const useCloneData = <T extends { id: string }>(
  collectionName: string,
  setForm: (data: Partial<T>) => void,
) => {
  const [searchParams] = useSearchParams();
  const cloneId = searchParams.get("clone");

  const [cloneSource] = useDocumentData<T>(
    cloneId ? (doc(db, collectionName, cloneId) as DocumentReference<T>) : null,
  );

  useEffect(() => {
    if (cloneSource) {
      const cleaned = Object.fromEntries(
        Object.entries(cloneSource).filter(([k]) => !METADATA_KEYS.has(k)),
      ) as Partial<T>;
      setForm(cleaned);
    }
  }, [cloneSource, setForm]);

  return { isClone: !!cloneId };
};
