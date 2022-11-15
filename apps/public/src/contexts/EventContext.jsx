import React, { useState, createContext, useContext } from "react";

const EventContext = createContext();

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({ children, event: propsEvent }) => {
  const [event, setEvent] = useState(propsEvent || {});

  return (
    <EventContext.Provider value={[event, setEvent]}>
      {children}
    </EventContext.Provider>
  );
};
