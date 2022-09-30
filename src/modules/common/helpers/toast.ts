import { toast } from 'react-toastify';
import { ErrorMessage } from 'common/constants/error';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const handleCommonError =  (e?: any) => {
  if (e) {
    toast.error(e?.message | e?.code | e?.toString() | e)
  }
  toast.error(ErrorMessage.NETWORK_ERROR);
}

export const showSuccess = (message: string) => {
  toast.success(message);
}

export const showInfo = (message: string) => {
  toast.info(message);
}

export const showError = (message: string) => {
  toast.error(message);
}