import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../utils/apiClient';
import { showError, showSuccess } from '../../../utils/toastService';

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

const sendMessage = async (payload: any) => {
  return apiFetch('/api/contact', { method: 'POST', body: JSON.stringify(payload) });
};

const fetchContacts = async (): Promise<ContactSubmission[]> => {
  return apiFetch('/api/contact');
};

const deleteContact = async (id: string) => {
  return apiFetch(`/api/contact/${id}`, { method: 'DELETE' });
};

const resolveContact = async (id: string) => {
  return apiFetch(`/api/contact/${id}/resolve`, { method: 'PATCH' });
};

export const useContact = () => {
  return useMutation({ 
    mutationFn: sendMessage, 
    onSuccess: () => showSuccess('Message sent successfully'), 
    onError: (err: any) => showError(err?.message || 'Failed to send message') 
  });
};

export const useContacts = () => {
  return useQuery({ 
    queryKey: ['contacts'], 
    queryFn: fetchContacts 
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      showSuccess('Contact deleted');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (err: any) => showError(err?.message || 'Failed to delete contact')
  });
};

export const useResolveContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resolveContact,
    onSuccess: () => {
      showSuccess('Contact marked as resolved');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (err: any) => showError(err?.message || 'Failed to update contact')
  });
};

export default useContact;
