import React, { useState, createContext, useContext } from "react";

const TopBannerContext = createContext();

export const useTopBanner = () => useContext(TopBannerContext);

export const TopBannerProvider = ({ children }) => {
  const [banner, setTopBanner] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState();

  return (
    <TopBannerContext.Provider
      value={{ banner, setTopBanner, breadcrumbs, setBreadcrumbs }}
    >
      {children}
    </TopBannerContext.Provider>
  );
};
