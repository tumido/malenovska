import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";

const EventIndexPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/${eventId}/legends`, { replace: true });
  }, [eventId, navigate]);

  return null;
};

export default EventIndexPage;
