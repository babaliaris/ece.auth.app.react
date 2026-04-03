import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { eceGetRouter } from '@/core/routes';
import '@/core/i18next.setup';

// MUI Default FONTS
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={eceGetRouter()}/>
  </StrictMode>,
);

