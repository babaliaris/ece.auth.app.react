import { type EceApiI, type EceApiResultI } from "./api.types";
import * as models from "./api.models.ts";
import { eceRequest } from "./request.service";


export const ece_api: EceApiI =
{
  userPost: (data: models.ApiUserPostReqType)
  : Promise< EceApiResultI<models.ApiUserPostResType> > =>
  {
    return eceRequest<models.ApiUserPostResType>(
    {
      path  : "/users",
      method: "POST",
      body  : data
    });
  },


  userLogin: (data: models.ApiUserLoginReqType)
  : Promise< EceApiResultI<models.ApiUserLoginResType> > =>
  {
    return eceRequest<models.ApiUserLoginResType>(
    {
      path  : "/users/login",
      method: "POST",
      body  : data,
      silent: true //Skip 401 redirection.
    });
  },

  userMe: (): Promise< EceApiResultI<models.ApiUserMeResType> > =>
  {
    return eceRequest<models.ApiUserMeResType>(
    {
      path    : "/users/me",
      method  : "GET",
      silent  : true // Skip 401 redirection.
    })
  }
} as const;

