type ToastFn = (message: string) => void;

let _showSuccess: ToastFn = (m) => console.info('Toast not initialized:', m);
let _showError: ToastFn = (m) => console.error('Toast not initialized:', m);

export const setToastHandlers = (handlers: { showSuccess: ToastFn; showError: ToastFn }) => {
  _showSuccess = handlers.showSuccess;
  _showError = handlers.showError;
};

export const showSuccess = (message: string) => _showSuccess(message);
export const showError = (message: string) => _showError(message);
