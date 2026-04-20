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


export type EcePaginationFuncType<T> =
  (page: number, limit?: number, search?: string) =>
  Promise< EceApiResultI< models.ApiPaginateResType<T> > >;


export interface EceApiI
{
  // USERS.
  userPost  : (data: models.ApiUserPostReqType) => Promise< EceApiResultI<models.ApiUserPostResType> >;
  userLogin : (data: models.ApiUserLoginReqType) => Promise< EceApiResultI<models.ApiUserLoginResType> >;
  userLogout: ()=> Promise< EceApiResultI<null> >;
  userMe    : () => Promise< EceApiResultI<models.ApiUserMeResType> >;

  // SUBJECTS.
  subjectPost     : (data: models.ApiSubjectPostReqType[]) => Promise< EceApiResultI<models.ApiSubjectPostResType[]> >;
  subjectsPaginate: EcePaginationFuncType<models.ApiSubjectDataType>;
  subjectUpdate   : (data: models.ApiSubjectPatchReqType, subject_uuid: string) => Promise< EceApiResultI<null> >;
  subjectDelete   : (subject_uuid: string) => Promise< EceApiResultI<null> >;

  // EXAMS.
  examPost     : (data: models.ApiExamPostReqType[]) => Promise< EceApiResultI<models.ApiExamPostResType[]> >;
  examPaginate : EcePaginationFuncType<models.ApiExamDataType>;
  examUpdate   : (data: models.ApiExamPatchReqType, uuid: string) => Promise< EceApiResultI<null> >;
  examDelete   : (uuid: string) => Promise< EceApiResultI<null> >;
};

