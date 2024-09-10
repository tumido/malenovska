import React from "react";

import {
  Hidden,
  Typography,
  IconButton,
  Divider,
  List,
  ListItemText,
  ListItemIcon,
  Icon,
  styled,
  ListItemButton,
} from "@mui/material";
import { grey } from "@mui/material/colors";

import { useEvent } from "../contexts/EventContext";
import { Link } from "react-router-dom";

const iconStyle = {
  height: '1em',
  width: '1em',
}

const Div = styled('div')(({theme}) => theme.mixins.toolbar)

const StyledListItemButton = styled(ListItemButton)(({theme}) => ({
  borderLeft: '3px solid transparent',
  '&.Mui-selected, &:hover': {
    backgroundColor: 'unset',
    borderColor: theme.palette.secondary.main
  },
}))

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
      <List>
        {navigation.map((item, idx) => {
          if (item.type === "visible") {
            return (
              <StyledListItemButton
                key={item.path || `item_${idx}`}
                selected={
                  pathname.startsWith(`/${event.id}/${item.path}`) ||
                  item.owns?.some((i) => pathname.startsWith(i))
                }
                disabled={!item.path || item.disabled}
                onClick={onClick}
                to={item.path || "/"}
                component={Link}
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
              </StyledListItemButton>
            );
          }
          if (item.type === "divider")
            return (
              <Divider key={`divider_${idx}`}  sx={{ mt: "20px", mb: "20px" }} />
            );
        })}
      </List>
      <List component="div" aria-label="vyber udalosti">
        <ListItemButton to="/choose" component={Link}>
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
        </ListItemButton>
      </List>
    </>
  );
};

export default MenuDrawer;
