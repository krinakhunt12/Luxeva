import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Toaster } from 'sonner';
// import { showError } from './utils/toastService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Toaster 
          position="top-right" 
          richColors 
          expand 
          closeButton 
          toastOptions={{
            style: {
              background: '#FAFAF8',
              border: '1px solid #E8E4DF',
              color: '#111111',
              fontFamily: '"DM Sans", sans-serif',
              borderRadius: '0px',
              fontSize: '11px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as any,
              fontWeight: 600,
              padding: '16px',
            },
            className: 'luxeva-toast',
          } as any}
          // Sonner uses class-based styling for close buttons, 
          // but we can also inject global CSS to handle the close icon specifically
        />
        <BrowserRouter>
          <ShopProvider>
            <App />
          </ShopProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
