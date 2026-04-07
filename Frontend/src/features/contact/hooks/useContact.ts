import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../../../utils/apiClient';
import { showError, showSuccess } from '../../../utils/toastService';

const sendMessage = async (payload: any) => {
  return apiFetch('/api/contact', { method: 'POST', body: JSON.stringify(payload) });
};

export const useContact = () => {
  return useMutation({ mutationFn: sendMessage, onSuccess: () => showSuccess('Message sent'), onError: (err: any) => showError(err?.message || 'Send failed') });
};

export default useContact;
