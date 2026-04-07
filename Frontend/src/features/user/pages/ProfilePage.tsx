import React from 'react';
import { useCurrentUser } from '../hooks/useUser';
import Skeleton from '../../../../components/ui/Skeleton';

export const ProfilePage: React.FC = () => {
  const { data: user, isLoading, isError, error } = useCurrentUser();

  if (isLoading) return <div className="p-6"><Skeleton lines={3} count={1} /></div>;
  if (isError) return <div className="p-6 text-red-600">{(error as Error).message}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl mb-4">Profile</h1>
      <div className="bg-white border p-6">
        <div className="mb-2">Name: {user?.name}</div>
        <div className="mb-2">Email: {user?.email}</div>
        <div>Mobile: {user?.mobile}</div>
      </div>
    </div>
  );
};

// named export only
