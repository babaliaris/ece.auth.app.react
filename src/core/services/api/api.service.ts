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

  subjectsPaginate: (page: number, limit?: number)
  : Promise< EceApiResultI<models.ApiPaginateResType<models.ApiSubjectDataType>> > =>
  {
    return eceRequest<models.ApiPaginateResType<models.ApiSubjectDataType> >(
    {
      path  : `/subjects?m_page=${page}&m_limit=${limit ? limit: 20}`,
      method: "GET"
    });
  },

  subjectUpdate: (data: models.ApiSubjectPatchReqType, subject_uuid: number)
  : Promise< EceApiResultI<null> > =>
  {
    return eceRequest<null>(
    {
      path  : `/subjects/${subject_uuid}`,
      method: "PATCH",
      body  : data
    });
  },

  subjectDelete: (subject_uuid: number)
  : Promise< EceApiResultI<null> > =>
  {
    return eceRequest<null>(
    {
      path  : `/subjects/${subject_uuid}`,
      method: "DELETE",
    });
  }
} as const;

