import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { doc, type DocumentReference } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "@/lib/firebase";
import { updateDocument, removeDocument, processPendingUploads } from "@/lib/admin-firestore";
import FormLayout from "@/components/admin/FormLayout";
import { RHFInput, RHFEventSelect, RHFImage } from "@/components/admin/RHFFields";
import { useEventFilter } from "@/components/admin/EventFilter";
import { gallerySchema, type GalleryFormValues } from "@/lib/schemas";
import type { Gallery } from "@/lib/types";

const GalleryEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gallery, loading] = useDocumentData<Gallery>(
    doc(db, "galleries", id!) as DocumentReference<Gallery>,
  );
  const [saving, setSaving] = useState(false);
  const { events } = useEventFilter([]);

  const { control, handleSubmit, reset, watch } = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    shouldUnregister: false,
  });

  useEffect(() => {
    if (gallery) reset(gallery as GalleryFormValues);
  }, [gallery, reset]);

  const name = watch("name");

  const onValid = async (data: GalleryFormValues) => {
    setSaving(true);
    try {
      const processed = await processPendingUploads(data);
      await updateDocument("galleries", id!, processed);
      navigate("/admin/galleries");
    } catch (err) {
      alert("Chyba při ukládání");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Opravdu smazat galerii „${name ?? id}"?`)) return;
    try {
      await removeDocument("galleries", id!);
      navigate("/admin/galleries");
    } catch (err) {
      alert("Chyba při mazání");
      console.error(err);
    }
  };

  if (loading) return <div className="text-gray-500">Načítání…</div>;
  if (!gallery) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-gray-500">
        <p>Galerie nenalezena</p>
        <Link to="/admin/galleries" className="text-sm text-secondary hover:text-secondary-dark transition-colors">
          Zpět na seznam galerií
        </Link>
      </div>
    );
  }

  const tabs = [
    {
      key: "main",
      label: "Galerie",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RHFInput control={control} name="name" label="Název" required />
            <RHFEventSelect control={control} name="event" label="Událost" events={events} required />
          </div>
          <RHFInput control={control} name="author" label="Autor" required />
          <RHFInput control={control} name="url" label="URL galerie" type="url" required />
          <RHFImage control={control} name="cover" label="Náhledový obrázek" required />
        </div>
      ),
    },
  ];

  return (
    <FormLayout
      title={`Upravit: ${name ?? id}`}
      tabs={tabs}
      onSubmit={handleSubmit(onValid)}
      onCancel={() => navigate("/admin/galleries")}
      onDelete={handleDelete}
      saving={saving}
    />
  );
};

export default GalleryEditPage;
