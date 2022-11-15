import React from "react";

import {
  Hidden,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Icon,
  styled,
} from "@mui/material";
import { grey } from "@mui/material/colors";


import AdapterLink from "./AdapterLink";
import { useEvent } from "../contexts/EventContext";
import ColorBadge from "./ColorBadge";

const iconStyle = {
  height: '1em',
  width: '1em',
}

const Div = styled('div')(({theme}) => theme.mixins.toolbar)

const MenuDrawer = ({ navigation, pathname, onClick }) => {
  const [event] = useEvent();

  return (
    <>
      <Div>
        <Hidden mdUp>
          <IconButton onClick={onClick}>
            <Icon>chevron_left</Icon>
          </IconButton>
        </Hidden>
      </Div>
      <div onClick={onClick}>
        <List>
          {navigation.map((item, idx) => {
            if (item.type === "visible") {
              return (
                <ListItem
                  key={item.path || `item_${idx}`}
                  button
                  selected={
                    pathname.startsWith(item.path) ||
                    item.owns?.some((i) => pathname.startsWith(i))
                  }
                  disabled={!item.path || item.disabled}
                  to={item.path || "/"}
                  component={AdapterLink}
                  sx={theme => theme.mixins.toolbar}
                >
                  <ListItemIcon>
                    <Icon
                      sx={iconStyle}
                    >
                      {item.icon}
                    </Icon>
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItem>
              );
            }
            if (item.type === "divider")
              return (
                <Divider key={`divider_${idx}`}  sx={{ mt: "20px", mb: "20px" }} />
              );
          })}
        </List>
      </div>
      <List component="div" aria-label="vyber udalosti">
        <ListItem button to="/choose" component={AdapterLink}>
          <ListItemIcon>
            <Icon sx={iconStyle}>
              dashboard
            </Icon>
          </ListItemIcon>
          <ListItemText
            secondaryTypographyProps={{ sx: { color: grey[500] } }}
            primary="Další ročníky"
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  sx={{ display: 'block' }}
                  variant="body2"
                >
                  Právě prohlížíte:
                </Typography>
                {event.name} {event.year}
              </React.Fragment>
            }
          />
        </ListItem>
      </List>
    </>
  );
};

export default MenuDrawer;
