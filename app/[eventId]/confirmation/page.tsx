"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEvent } from "@/contexts/EventContext";
import { Loading } from "@/components/Loading";

const ConfirmationPage = () => {
  const event = useEvent();
  const router = useRouter();

  useEffect(() => {
    if (event?.declaration?.src) {
      window.location.assign(event.declaration.src);
    }
  }, [event]);

  useEffect(() => {
    if (event && !event.declaration?.src) {
      router.replace(`/${event.id}`);
    }
  }, [event, router]);

  return <Loading />;
};

export default ConfirmationPage;
