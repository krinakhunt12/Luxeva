import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ToastProvider from './components/toast/ToastProvider';
import { showError } from './utils/toastService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (err: any) => {
        try {
          const msg = err?.message || 'Failed to fetch';
          showError(msg);
        } catch (e) {
          // ignore
        }
      },
    },
    mutations: {
      onError: (err: any) => {
        try {
          const msg = err?.message || 'Request failed';
          showError(msg);
        } catch (e) {}
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <BrowserRouter>
            <ShopProvider>
              <App />
            </ShopProvider>
          </BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
