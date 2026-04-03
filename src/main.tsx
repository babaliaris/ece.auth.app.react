import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { eceGetRouter } from '@/core/routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={eceGetRouter()}/>
  </StrictMode>,
);

