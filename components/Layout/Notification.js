import { useState, useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { Snackbar } from '@mui/material';
import clsx from 'clsx';
import { useAppContext } from 'context/AppContext';

const defaultAnchorOrigin = {
  vertical: 'bottom',
  horizontal: 'center',
};

const NotificationClasses = {
  success: 'notification-success',
  error: 'notification-error',
  warning: 'notification-warning',
  undo: 'notification-undo',
  multiLine: 'notification-multiLine',
};

const StyledSnackbar = styled(Snackbar, {
  name: 'notification',
  overridesResolver: (_, styles) => styles.root,
})(({ theme, type }) => ({
  [`& .${NotificationClasses.success}`]: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },

  [`& .${NotificationClasses.error}`]: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
  },

  [`& .${NotificationClasses.warning}`]: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
  },

  [`& .${NotificationClasses.undo}`]: {
    color:
      type === 'success'
        ? theme.palette.success.contrastText
        : theme.palette.primary.light,
  },
  [`& .${NotificationClasses.multiLine}`]: {
    whiteSpace: 'pre-wrap',
  },
}));

const Notification = ({
  className,
  type = 'info',
  autoHideDuration = 4000,
  multiLine = false,
  anchorOrigin = defaultAnchorOrigin,
  ...rest
}) => {
  const { notifications, takeNotification } = useAppContext();
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);

  useEffect(() => {
    if (notifications.length && !messageInfo) {
      setMessageInfo(takeNotification());
      setOpen(true);
    } else if (notifications.length && messageInfo && open) {
      setOpen(false);
    }
  }, [notifications, messageInfo, open, takeNotification]);

  const handleRequestClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleExited = useCallback(() => {
    setMessageInfo(undefined);
  }, []);

  if (!messageInfo) return null;

  return (
    <StyledSnackbar
      className={className}
      open={open}
      message={
        messageInfo.message
        // messageInfo.notificationOptions.messageArgs
      }
      autoHideDuration={
        messageInfo.notificationOptions.autoHideDuration
        || autoHideDuration
      }
      TransitionProps={{ onExited: handleExited }}
      onClose={handleRequestClose}
      ContentProps={{
        className: clsx(NotificationClasses[messageInfo.type || type], {
          [NotificationClasses.multiLine]: messageInfo.multiLine || multiLine,
        }),
      }}
      anchorOrigin={anchorOrigin}
      {...rest}
      data-cy="notification"
    />
  );
};

export default Notification;
