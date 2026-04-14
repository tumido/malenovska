import { useState, useEffect, useRef } from "react";
import {
  onSnapshot,
  queryEqual,
  refEqual,
  type DocumentReference,
  type FirestoreError,
  type Query,
} from "firebase/firestore";

const useStableRef = <T>(ref: DocumentReference<T> | null | undefined) => {
  const prev = useRef(ref);
  if (ref === prev.current) return prev.current;
  if (ref && prev.current && refEqual(ref, prev.current)) return prev.current;
  prev.current = ref;
  return ref;
};

const useStableQuery = <T>(q: Query<T> | null | undefined) => {
  const prev = useRef(q);
  if (q === prev.current) return prev.current;
  if (q && prev.current && queryEqual(q, prev.current)) return prev.current;
  prev.current = q;
  return q;
};

export const useDocumentData = <T>(ref: DocumentReference<T> | null | undefined) => {
  const stableRef = useStableRef(ref);
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState(!!stableRef);
  const [error, setError] = useState<FirestoreError | undefined>();

  useEffect(() => {
    if (!stableRef) {
      setData(undefined);
      setLoading(false);
      return;
    }
    setLoading(true);
    return onSnapshot(
      stableRef,
      (snap) => { setData(snap.data()); setLoading(false); },
      (err) => { setError(err); setLoading(false); },
    );
  }, [stableRef]);

  return [data, loading, error] as const;
};

export const useCollectionData = <T>(q: Query<T> | null | undefined) => {
  const stableQuery = useStableQuery(q);
  const [data, setData] = useState<T[] | undefined>();
  const [loading, setLoading] = useState(!!stableQuery);
  const [error, setError] = useState<FirestoreError | undefined>();

  useEffect(() => {
    if (!stableQuery) {
      setData(undefined);
      setLoading(false);
      return;
    }
    setLoading(true);
    return onSnapshot(
      stableQuery,
      (snap) => { setData(snap.docs.map((d) => d.data())); setLoading(false); },
      (err) => { setError(err); setLoading(false); },
    );
  }, [stableQuery]);

  return [data, loading, error] as const;
};
