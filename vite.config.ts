import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({mode})=>
{
  const env       = loadEnv(mode, process.cwd());
  const base_name = env.VITE_ROUTER_BASE || '';

  // Replace double slashes // if they exist in the middle.
  const base_path = `/${base_name}/`.replace(/\/+/g, '/');

  return {
    base: base_path,

    plugins:
    [
      react()
    ],

    resolve:
    {
      alias:
      {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
});

