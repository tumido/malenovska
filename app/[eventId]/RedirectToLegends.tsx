"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export function RedirectToLegends() {
  const { eventId } = useParams<{ eventId: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${eventId}/legends`);
  }, [eventId, router]);

  return null;
}
