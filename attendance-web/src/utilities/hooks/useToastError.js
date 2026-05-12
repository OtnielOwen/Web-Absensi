import { useEffect } from 'react';
import { notification } from 'antd';

const useToastError = (errMessage = null) => {
  useEffect(() => {
    if (errMessage) {
      notification.open({
        type: 'error',
        message: 'Error',
        description: errMessage,
        placement: 'bottomLeft',
      });
    }
  }, [errMessage]);
};

export default useToastError;
