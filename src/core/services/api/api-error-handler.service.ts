import { type EceApiResultI, type EceApiErrorInfoType } from "./api.types";
import { ece_logger } from "@/core/logger.core";
import i18n from "@/core/i18next.setup";

/**
  * MAKE SURE YOU CALL THIS FUNCTION AFTER CHECKING if (result.success)
  *
  * This function returns an information object that contains more than
  * enough informations to use for displaying feedback to the user. The
  * dialog properties (like title and body) are i18n internalized based messages
  * that you can use to display error messages. They are general for most
  * api error use cases, but you can Ignore them if you want and display
  * your own errors based on the status code, that you already
  * have access through the api result object.
  *
  * @param result The api result object.
  *
  * @returns An object, containing the api error object + dialog stuff for user feedback.
  */
export function eceApiGetErrorInfo (result: EceApiResultI<unknown>): EceApiErrorInfoType
{
  // The user should NOT call this function while the request was successfull!!!
  if (result.success)
  {
    const err_msg = 
    `[api.ts:errorHandler()] Error handler was called with a success flag! This is a bug!`;

    ece_logger.error(
      err_msg,
      result
    );

    return {
      api_error:
      {
        statusCode: 0,
        error     : "eceApiGetErrorInfo called with the success flag on!",
        message   : `[api.ts:errorHandler()] Error handler was called with a success flag! This is a bug!`,
        reqId     : "Client-Side"
      },
      dialog_title: i18n.t('api_error.success_bug.title'),
      dialog_body : i18n.t('api_error.success_bug.body')
    }
  }

  if ( !result.error )
  {
    const err_msg =
    `[api.ts:errorHandler()] Error handler was called with a NULL error object. This is a bug!`;

    ece_logger.error(
      err_msg,
      result
    );

    return {
      api_error:
      {
        statusCode: 0,
        error     : "eceApiGetErrorInfo() called with a NULL error object!",
        message   : `[api.ts:errorHandler()] Error handler was called with a success flag! This is a bug!`,
        reqId     : "Client-Side"
      },
      dialog_title: i18n.t('api_error.no_error.title'),
      dialog_body : i18n.t('api_error.no_error.body')
    }
  }


  switch (result.status)
  {
    // It's a good idea to log bad request errors.
    // Because they should NEVER happen in production.
    case 400:
      ece_logger.error(
        '[api.ts:errorHandler()] Api Validation Errors',
        {
          api_error: result.error,
          validation_errors: result.error.details
        }
      );
      return {
      api_error   : result.error,
      dialog_title: i18n.t('api_error.bad_request.title'),
      dialog_body : i18n.t('api_error.bad_request.body')
    }


    case 401:
      return {
      api_error   : result.error,
      dialog_title: i18n.t('api_error.unauthorized.title'),
      dialog_body : i18n.t('api_error.unauthorized.body')
    }

    case 403:
      return {
      api_error   : result.error,
      dialog_title: i18n.t('api_error.forbidden.title'),
      dialog_body : i18n.t('api_error.forbidden.body')
    }

    case 404:
      return {
      api_error   : result.error,
      dialog_title: i18n.t('api_error.not_found.title'),
      dialog_body : i18n.t('api_error.not_found.body')
    }

    case 409:
      return {
      api_error   : result.error,
      dialog_title: i18n.t('api_error.conflict.title'),
      dialog_body : i18n.t('api_error.conflict.body')
    }
  }

  if (result.status >= 500)
  {
    ece_logger.error(
      '[api.ts:errorHandler()] Api Internal Server Error',
      result.error
    );

    return {
      api_error   : result.error,
      dialog_title: i18n.t('api_error.internal_server.title'),
      dialog_body : i18n.t('api_error.internal_server.body')
    }
  }

  if (result.status === 0)
  {
    ece_logger.error(
      '[api.ts:errorHandler()] Network Error',
      result.error
    );

    return {
      api_error   : result.error,
      dialog_title: i18n.t('api_error.connection.title'),
      dialog_body : i18n.t('api_error.connection.body')
    }
  }


  ece_logger.error(
    '[api.ts:errorHandler()] Api Uknown Server Error',
    result.error
  );

  return {
    api_error   : result.error,
    dialog_title: i18n.t('api_error.uknown.title'),
    dialog_body : i18n.t('api_error.uknown.body')
  }
}
