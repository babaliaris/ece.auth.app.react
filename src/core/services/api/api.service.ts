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
      silent: true // Skip 401 redirection.
    });
  },

  userLogout: (): Promise< EceApiResultI<null> > =>
  {
    return eceRequest<null>(
    {
      path  : "/users/logout",
      method: "POST",
      silent: true // Skip 401 redirection.
    });
  },

  userMe: (): Promise< EceApiResultI<models.ApiUserMeResType> > =>
  {
    return eceRequest<models.ApiUserMeResType>(
    {
      path    : "/users/me",
      method  : "GET",
      silent  : true // Skip 401 redirection.
    });
  },



  subjectPost: (data: models.ApiSubjectPostReqType[])
  : Promise< EceApiResultI<models.ApiSubjectPostResType[]> > =>
  {
    return eceRequest<models.ApiSubjectPostResType[]>(
    {
      path  : "/subjects",
      method: "POST",
      body  : data
    });
  },

  subjectsPaginate: (page: number, limit: number = 100, search?: string)
  : Promise< EceApiResultI<models.ApiPaginateResType<models.ApiSubjectDataType>> > =>
  {
    const params = new URLSearchParams(
    {
      m_page  : String(page),
      m_limit : String(limit)
    });

    if (search) params.append('m_search', search);

    return eceRequest<models.ApiPaginateResType<models.ApiSubjectDataType> >(
    {
      path  : `/subjects?${params.toString()}`,
      method: "GET"
    });
  },

  subjectUpdate: (data: models.ApiSubjectPatchReqType, subject_uuid: string)
  : Promise< EceApiResultI<null> > =>
  {
    return eceRequest<null>(
    {
      path  : `/subjects/${subject_uuid}`,
      method: "PATCH",
      body  : data
    });
  },

  subjectDelete: (subject_uuid: string)
  : Promise< EceApiResultI<null> > =>
  {
    return eceRequest<null>(
    {
      path  : `/subjects/${subject_uuid}`,
      method: "DELETE",
    });
  },



  examPost: (data: models.ApiExamPostReqType[])
  : Promise< EceApiResultI<models.ApiExamPostResType[]> > =>
  {
    return eceRequest<models.ApiExamPostResType[]>(
    {
      path  : "/exams",
      method: "POST",
      body  : data
    });
  },

  examPaginate: (page: number, limit: number = 100, search?: string)
  : Promise< EceApiResultI<models.ApiPaginateResType<models.ApiExamDataType>> > =>
  {
    const params = new URLSearchParams(
    {
      m_page  : String(page),
      m_limit : String(limit)
    });

    if (search) params.append('m_search', search);

    return eceRequest<models.ApiPaginateResType<models.ApiExamDataType> >(
    {
      path  : `/exams?${params.toString()}`,
      method: "GET"
    });
  },

  examUpdate: (data: models.ApiExamPatchReqType, uuid: string)
  : Promise< EceApiResultI<null> > =>
  {
    return eceRequest<null>(
    {
      path  : `/exams/${uuid}`,
      method: "PATCH",
      body  : data
    });
  },

  examDelete: (uuid: string)
  : Promise< EceApiResultI<null> > =>
  {
    return eceRequest<null>(
    {
      path  : `/exams/${uuid}`,
      method: "DELETE",
    });
  }
} as const;

