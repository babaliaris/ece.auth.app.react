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
  userLogout: ()=> Promise< EceApiResultI<null> >;
  userMe    : () => Promise< EceApiResultI<models.ApiUserMeResType> >;

  subjectPost     : (data: models.ApiSubjectPostReqType[]) => Promise< EceApiResultI<models.ApiSubjectPostResType[]> >;
  subjectsPaginate: (page: number, limit?: number) => Promise< EceApiResultI<models.ApiSubjectsPaginateResType> >;
  subjectUpdate   : (data: models.ApiSubjectPatchReqType, subject_uuid: number) => Promise< EceApiResultI<null> >;
  subjectDelete   : (subject_uuid: number) => Promise< EceApiResultI<null> >;
};

