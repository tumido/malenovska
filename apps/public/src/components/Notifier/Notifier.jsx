import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';

import { IconButton, Icon, CircularProgress } from '@material-ui/core';

import { closeNotification, removeNotification } from 'common/redux/actions/notify-actions';

const useStyles = makeStyles(theme => ({
  action: {
    padding: theme.spacing(1)
  }
}));

const Notifier = ({
  toOpen, toClose,
  enqueueSnackbar, closeSnackbar,
  closeNotification, removeNotification
}) => {
  const [ displayed, setDisplayed ] = React.useState([]);
  const classes = useStyles();

  useEffect(() => {
    toOpen.forEach(({ id, message, options }) => {
      if (displayed.includes(id)) { return; }

      if (options.action === 'close') {
        // eslint-disable-next-line react/display-name
        options.action = () => (
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            className={ classes.action }
            onClick={ () => closeNotification(id) }
          >
            <Icon>close</Icon>
          </IconButton>
        );
      }
      else if (options.action === 'spinner') {
        // eslint-disable-next-line react/display-name
        options.action = () => (
          <CircularProgress
            color='secondary'
            className={ classes.action }
          />
        );
      }

      enqueueSnackbar(message, {
        ...options,
        key: id,
        onClose: (event, reason, key) => {
          options.onClose && options.onClose(event, reason, key);
          closeNotification(id);
        }
      });
      setDisplayed([ ...displayed, id ]);
    });
  }, [ toOpen ]);

  useEffect(() => {
    toClose.forEach(({ id }) => {
      setDisplayed(displayed.filter(displayedId => displayedId !== id));
      closeSnackbar(id);
      removeNotification(id);
    });
  }, [ toClose ]);

  return null;
};

export default compose(
  connect(
    ({ notify: { open, close }}) => (
      { toOpen: open, toClose: close }
    ),
    {
      closeNotification, removeNotification
    }
  ),
  withSnackbar
)(Notifier);
