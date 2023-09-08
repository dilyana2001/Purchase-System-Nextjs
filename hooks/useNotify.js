import { useCallback } from 'react';
import { useAppContext } from "context/AppContext";

const useNotify = () => {
  const { addNotification } = useAppContext();

  return useCallback((message, options = {}) => {
    const {
      type: messageType = 'info',
      ...notificationOptions
    } = options;

    addNotification({
      message,
      type: messageType,
      notificationOptions,
    });
  }, [addNotification]);
};

export default useNotify;
