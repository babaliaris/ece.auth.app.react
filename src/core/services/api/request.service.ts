import { type EceApiResultI, type ApiError } from "./api.types";
import { ece_logger } from "@/core/logger.core";
import { ECE_ROUTE_PATHS } from "@/core/routes";
import { useEceAuthStore } from "@/core/zustand-state";

type RequestOptions =
{
  method   : 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path     : string;
  body    ?: unknown;
  headers ?: Record<string, string>;
  silent  ?: boolean;
};

/**
  * Executes a network Request.
  *
  * This is a "fetch" wrapper that handles
  * network fairules and error throws so we can
  * use it in "clean" way throughout the React application
  * without having to use NOT EVEN A SINGLE try{} - catch {}
  * block!!! It also returns a promise with a standarized EceApiResultI object.
  *
  * @param opts The request options.
  *
  * @returns A standarized api result object.
  */
export async function eceRequest<Tdata>(opts: RequestOptions): Promise<EceApiResultI<Tdata>>
{
  const { method, path, body, headers } = opts;
  const url = `${import.meta.env.VITE_API_DOMAIN}${path}`;

  // Headers Record.
  const defaultHeaders: Record<string, string> = {};
  
  // If body is provided, we send it as a json format.
  if (body)
  {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  // Log some info.
  ece_logger.info(
    `[request.service.ts:eceRequest()] Ecexuting request: ${opts.path}`,
    opts
  );

  try
  {
    const response = await fetch(url,
    {
      method,
      credentials : 'include',
      headers     : { ...defaultHeaders, ...headers },
      body        : body ? JSON.stringify(body) : undefined,
    });

    let data  : Tdata | null    = null;
    let error : ApiError | null = null;

    // If a body is returned, convert it to a javscript object.
    if (response.status !== 204 && response.status !== 205)
    {
      const contentType = response.headers.get('content-type');
      
      // Try to convert the JSON body data to a javascript object.
      if (contentType && contentType.includes('application/json'))
      {
        const json = await response.json();

        // The data are success data.
        if (response.ok)
        {
          data = json;
        }

        // The data is an error object.
        else
        {
          ece_logger.warn(
            `[request.service.ts:eceRequest()] Standard Error for request: ${opts.path}`,
            {
              opts  : opts,
              error : json
            }
          );
          error = json;
        }
      }
    }

    // Redirect if to login if Unauthorized.
    // We use a silence flag, in case we want to skip this.
    // Provide with silence = true to SKIP this redirection.
    if (response.status === 401 && !opts.silent)
    {
      // Calculate the base path.
      const base_name = import.meta.env.VITE_ROUTER_BASE || '';
      const base_path = `/${base_name}/`.replace(/\/+/g, '/');

      // ----------|Calculate The RETURN path to the current window location----------|
      const current_path = window.location.pathname; // e.g., "/ece-auth-app-react/admin/dashboard"

      // Strip the base from the beginning of the string
      // We use a Regex to ensure we only catch the base at the start (^)
      const base_pattern = new RegExp(`^${base_path}`, 'i');
      let relative_path  = current_path.replace(base_pattern, '');

      // Ensure it starts with a single / (slash)
      if (!relative_path.startsWith('/'))
      {
        relative_path = '/' + relative_path;
      }

      // Add query params if they exist
      const search      = window.location.search;
      const return_path = encodeURIComponent(relative_path + search);
      // ----------|Calculate The RETURN path to the current window location----------|

      // Clear the authenitcation state.
      useEceAuthStore.getState().clearAuth();

      // Remove any double slashes in the middle of the path.
      const target          = ECE_ROUTE_PATHS.LOGIN;
      const redirect_path   = `${base_path}/${target}/`.replace(/\/+/g, '/');
      const safeRedirect    = `${redirect_path}?unauthorized=true&return_path=${return_path}`;
      window.location.href  = safeRedirect;

      ece_logger.warn(`[request.service.ts:eceRequest()] Unauthorized. Redirecting to: ${safeRedirect}`);

      // Return early to prevent the UI from trying to process bad data
      return {
        success : false,
        status  : response.status,
        data    : null,
        error   : error
      };
    }

    // Handle Network -> Create a custom Error object.
    // The request reached the destination, but the server
    // had a problem. This is NOT a user WIFI connection problem.
    if (!response.ok && !error)
    {
      error =
      {
        statusCode: response.status,
        error     : 'Server Side Network Error',
        message   : response.statusText || `HTTP Error ${response.status}`,
        reqId     : response.headers.get('x-request-id') || 'unknown',
      };

      ece_logger.error(
        `[request.service.ts:eceRequest()] Server Side Network Error for request: ${opts.path}`,
        {
          opts  : opts,
          error : error
        }
      );
    }

    return {
      success : response.ok,
      status  : response.status,
      data    : data,
      error   : error
    };

  }


  // Network - Connection error, client side
  // OR another error was thrown, like failing
  // to convert the JSON body to a javascript Object.
  // The later, could be a backend bug as well.
  catch (e)
  {
    ece_logger.error(
      `[request.service.ts:eceRequest()] Client Side Network Error for request: ${opts.path}`,
      {
        opts  : opts,
        error : e instanceof Error ? e.message : 'Check your internet connection'
      }
    );

    return {
      success : false,
      status  : 0,
      data    : null,
      error   :
      {
        statusCode: 0,
        error     : 'Network Error',
        message   : e instanceof Error ? e.message : 'Check your internet connection',
        reqId     : 'client-side',
      },
    };
  }
}
