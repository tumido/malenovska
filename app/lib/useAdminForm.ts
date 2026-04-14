import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { doc, type DocumentReference, type DocumentData } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm, type DefaultValues, type FieldValues, type Resolver } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { db } from "@/lib/firebase";
import {
  createDocument,
  updateDocument,
  removeDocument,
  processPendingUploads,
  DocumentExistsError,
} from "@/lib/admin-firestore";
import { useCloneData } from "@/lib/useCloneData";

const slugify = (value: string): string =>
  value.replace(/ /g, "_").toLowerCase().replace(/\W/g, "");

interface UseAdminFormOptions<T extends FieldValues> {
  resolver: Resolver<T>;
  collection: string;
  defaultValues: DefaultValues<T>;
  slugField?: keyof T;
  basePath: string;
  id?: string;
  /** Extra data merged into the payload on create (e.g. publishedAt timestamp) */
  extraCreateData?: () => Record<string, unknown>;
}

export const useAdminForm = <T extends FieldValues>(options: UseAdminFormOptions<T>) => {
  const {
    resolver,
    collection: collectionName,
    defaultValues,
    slugField,
    basePath,
    id,
    extraCreateData,
  } = options;

  const isEdit = !!id;
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  // --- Form setup ---
  const form = useForm<T>({
    resolver,
    shouldUnregister: false,
    ...(isEdit ? {} : { defaultValues }),
  });

  const { handleSubmit, reset } = form;

  // --- Edit mode: fetch document + populate form ---
  const [docData, loading] = useDocumentData<DocumentData>(
    isEdit ? (doc(db, collectionName, id) as DocumentReference<DocumentData>) : null,
  );

  useEffect(() => {
    if (isEdit && docData) reset(docData as T);
  }, [isEdit, docData, reset]);

  // --- New mode: clone support ---
  const resetStable = useCallback(
    (data: Partial<Record<string, unknown>>) => reset(data as T),
    [reset],
  );
  const { isClone } = useCloneData<{ id: string }>(
    collectionName,
    isEdit ? () => {} : resetStable,
  );

  // --- Submit handler ---
  const onSubmit = handleSubmit(async (data: T) => {
    setSaving(true);
    try {
      if (isEdit) {
        const processed = await processPendingUploads(data);
        await updateDocument(collectionName, id, processed);
      } else {
        const docId = slugField ? slugify(String(data[slugField])) : "";
        const payload = extraCreateData ? { ...data, ...extraCreateData() } : data;
        const processed = await processPendingUploads(payload);
        await createDocument(collectionName, docId, processed);
      }
      navigate(basePath);
    } catch (err) {
      if (!isEdit && err instanceof DocumentExistsError) {
        enqueueSnackbar(`Záznam s ID "${err.documentId}" již existuje.`, { variant: "error" });
      } else {
        enqueueSnackbar(isEdit ? "Chyba při ukládání" : "Chyba při vytváření", { variant: "error" });
        console.error(err);
      }
    } finally {
      setSaving(false);
    }
  });

  // --- Delete handler (edit mode only) ---
  const onDelete = isEdit
    ? async (displayName?: string) => {
        if (!confirm(`Opravdu smazat „${displayName ?? id}"?`)) return;
        try {
          await removeDocument(collectionName, id);
          navigate(basePath);
        } catch (err) {
          enqueueSnackbar("Chyba při mazání", { variant: "error" });
          console.error(err);
        }
      }
    : undefined;

  // --- Not-found state (edit mode, after loading finished) ---
  const notFound = isEdit && !loading && !docData;

  return {
    ...form,
    onSubmit,
    onDelete,
    onCancel: () => navigate(basePath),
    isEdit,
    isClone,
    loading: isEdit ? loading : false,
    notFound,
    saving,
    id,
  };
};
