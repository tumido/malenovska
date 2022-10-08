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
import { ThemeProvider } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

import { darkTheme } from "../utilities/theme";

import AdapterLink from "./AdapterLink";
import { useEvent } from "../contexts/EventContext";

const iconStyle = ({theme}) => ({
  display: "flex",
  alignItems: "center",
  padding: [0, 1],
  // ...theme.mixins.toolbar,
  justifyContent: "flex-end",
})

const Div = styled('div')(iconStyle)

const MenuDrawer = ({ navigation, pathname, onClick }) => {
  const [event] = useEvent();

  return (
    <ThemeProvider theme={darkTheme}>
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
      <List component="nav" aria-label="vyber udalosti">
        <ListItem button to="/choose" component={AdapterLink}>
          <ListItemIcon>
            <Icon fontSize="large" sx={iconStyle}>
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
    </ThemeProvider>
  );
};

export default MenuDrawer;
