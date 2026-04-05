import * as models from "./api.models.ts";

export type ApiError =
{
  statusCode: number,
  error     : string,
  message   : string,
  reqId     : string,
  details  ?: unknown
};


export type EceApiResultI<Tdata> =
{
  success : boolean;
  status  : number;
  data    : Tdata | null;
  error   : ApiError | null;
};

export type EceApiErrorInfoType =
{
  api_error   : ApiError,
  dialog_title: string,
  dialog_body : string
};


export interface EceApiI
{
  userPost  : (data: models.ApiUserPostReqType) => Promise< EceApiResultI<models.ApiUserPostResType> >;
  userLogin : (data: models.ApiUserLoginReqType) => Promise< EceApiResultI<models.ApiUserLoginResType> >;
  userMe    : () => Promise< EceApiResultI<models.ApiUserMeResType> >;
};

