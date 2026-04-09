import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useEvent } from "@/contexts/EventContext";
import { Loading } from "@/components/Loading";

const ConfirmationPage = () => {
  const event = useEvent();
  const navigate = useNavigate();

  useEffect(() => {
    if (event?.declaration?.src) {
      window.location.assign(event.declaration.src);
    }
  }, [event]);

  useEffect(() => {
    if (event && !event.declaration?.src) {
      navigate(`/${event.id}`, { replace: true });
    }
  }, [event, navigate]);

  return <Loading />;
};

export default ConfirmationPage;
