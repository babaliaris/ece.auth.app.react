type LogLevel = 'info' | 'warn' | 'error';

const isProd = import.meta.env.PROD;


/**
  * Send a log to the server.
  *
  * This function SHOULD not have any depedencies, in order to be
  * able to be used everywhere!
  *
  * @param level The log level.
  * @param message The log message.
  * @param data Any type of data.
  */ 
const RemoteLog = async (level: LogLevel, message: string, data?: unknown) =>
{
  try
  {
    // TODO: Re-chech this code after implementing it in the backend.
    await fetch(`${import.meta.env.VITE_API_DOMAIN}/frontend/logs`,
    {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify(
      {
        level,
        message,
        data,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    });
  }

  catch (e)
  {
    console.warn("[RemoteLog()] Failed to send log to the server because: ", e);
  }
};



/**
  * The main logger object.
  *
  * Use this smartly throughout the code base 
  * to identify problems.
  */
export const ece_logger =
{
  info: (msg: string, data?: unknown) =>
  {
    if (!isProd) console.info(`[INFO] ${msg}`, data);
  },

  warn: (msg: string, data?: unknown) =>
  {
    if (!isProd) console.warn(`[WARN] ${msg}`, data);
  },

  error: (msg: string, data?: unknown) =>
  {
    if (!isProd) console.error(`[ERROR] ${msg}`, data);
    if (isProd) RemoteLog('error', msg, data);
  },
};

