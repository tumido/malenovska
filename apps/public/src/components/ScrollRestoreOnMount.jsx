import React from "react";

const ScrollRestoreOnMount = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
};

export default ScrollRestoreOnMount;
