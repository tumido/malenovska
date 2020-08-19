import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, ButtonBase, Avatar } from '@material-ui/core';
import {
  FacebookShareButton, FacebookIcon,
  RedditShareButton, RedditIcon,
  TwitterShareButton, TwitterIcon,
  WhatsappShareButton, WhatsappIcon } from 'react-share';

import { FileCopy } from '@material-ui/icons';
import copy from 'clipboard-copy';

const CopyToClipboardButton = React.forwardRef(({ url, children, resetButtonStyle, component, ...props }, ref) => (
  <ButtonBase ref={ ref } { ...props } onClick={ () => copy(url) }>
    {children}
  </ButtonBase>
));

CopyToClipboardButton.propTypes = {
  url: PropTypes.string.isRequired,
  children: PropTypes.node,
  resetButtonStyle: PropTypes.bool,
  component: PropTypes.node
};
CopyToClipboardButton.displayName = 'CopyToClipboardButton';

const shareTo = [
  {
    component: FacebookShareButton,
    icon: <FacebookIcon />,
    text: 'Sdílet na Facebooku'
  },
  {
    component: CopyToClipboardButton,
    icon: <FileCopy />,
    text: 'Kopírovat odkaz do schránky'
  },
  {
    component: WhatsappShareButton,
    icon: <WhatsappIcon />,
    text: 'Poslat přes WhatsApp'
  },
  {
    component: TwitterShareButton,
    icon: <TwitterIcon />,
    text: 'Sdílet na Twitter'
  },
  {
    component: RedditShareButton,
    icon: <RedditIcon/>,
    text: 'Sdílet na Reddit'
  }

];

const ShareDialog = ({ title: shareTitle, eventName, open, onClose }) => {
  const title = `${eventName}: ${shareTitle}`;

  if (navigator.share) {
    if (open) {
      navigator.share({
        title,
        url: window.location.href
      });
      onClose();
    }

    return '';
  }

  return (
    <Dialog open={ open } onClose={ onClose }>
      <DialogTitle>Sdílet {`"${title}"`}</DialogTitle>
      <List>
        { shareTo.map((s, idx) => (
          <ListItem
            button
            key={ `shareItem-${idx}` }
            component={ s.component }
            resetButtonStyle={ false }
            url={ window.location.href }
            title={ title }>
            <ListItemAvatar>
              <Avatar>
                {s.icon}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={ s.text } />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

ShareDialog.propTypes = {
  title: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func
};

export default ShareDialog;
