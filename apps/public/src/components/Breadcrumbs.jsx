import React, { forwardRef } from "react";

import {
  Typography,
  Breadcrumbs as BreadcrumbsBase,
  Link,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { useTopBanner } from "../contexts/TopBannerContext";

export const Breadcrumbs = React.forwardRef(
  ({ variant = "h2", className }, ref) => {
    const { breadcrumbs } = useTopBanner();

    if (!breadcrumbs || breadcrumbs.length === 0) return <div ref={ref} />;
    return (
      <BreadcrumbsBase ref={ref}>
        {breadcrumbs.slice(0, breadcrumbs.length - 1).map((b) => (
          <Link
            key={b.to}
            variant={variant}
            className={className}
            color="primary"
            component={RouterLink}
            to={b.to}
          >
            {b.name}
          </Link>
        ))}
        <Typography variant={variant} className={className}>
          {breadcrumbs[breadcrumbs.length - 1].name}
        </Typography>
      </BreadcrumbsBase>
    );
  }
);

export default Breadcrumbs;
