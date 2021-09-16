import React, { useState, createContext, useContext, useEffect } from "react";

export const EventContext = createContext();

export const useEvent = () => {
  const x = useContext(EventContext);
  console.log(x);
  return x;
};

export const EventProvider = ({ children, event: propsEvent }) => {
  const [event, setEvent] = useState({});

  useEffect(() => {
    setEvent(propsEvent);
  }, []);

  return (
    <EventContext.Provider value={[event, setEvent]}>
      {children}
    </EventContext.Provider>
  );
};
