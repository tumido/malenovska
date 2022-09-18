import React, { useEffect } from "react";
import { Navigate } from "react-router";
import { Loading } from "../../components";
import { useEvent } from "../../contexts/EventContext";

const Confirmation = () => {
  const [event] = useEvent();

  useEffect(() => {
    event && window.location.assign(event.declaration.src);
  }, [event]);

  if (!event) return <Loading />;

  return <Navigate to={`/${event.id}`} />;
};

export default Confirmation;
