import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage: React.FC<{ message?: string; details?: string }> = ({ message = 'Something went wrong.', details }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <div className="max-w-2xl w-full bg-white border border-accent p-10 rounded-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Oops</h1>
        <p className="text-lg text-muted mb-6">{message}</p>
        {details && (
          <pre className="text-xs text-left overflow-auto bg-gray-50 p-3 rounded mb-4 max-h-40">{details}</pre>
        )}
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="px-4 py-2 bg-primary text-white rounded">Go home</Link>
          <button onClick={() => window.location.reload()} className="px-4 py-2 border rounded">Reload</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
