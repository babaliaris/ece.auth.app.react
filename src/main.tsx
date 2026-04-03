import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { eceGetRouter } from '@/core/routes';
import { ece_logger } from '@/core/logger.core';
import '@/core/i18next.setup';

// MUI Default FONTS
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Global error capture for NON-REACT errors.
window.addEventListener('unhandledrejection', (event) =>
{
  ece_logger.error('Unhandled Promise Rejection', event);
});

// Capture errors that escape React (rare but happens)
window.onerror = (message, source, lineno, colno, error) =>
{
  ece_logger.error('Global Window Error',
  {
    message, source, lineno, colno, error
  });
};


// Bootstrap the React App.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={eceGetRouter()}/>
  </StrictMode>,
);

