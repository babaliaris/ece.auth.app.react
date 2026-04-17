export type ApiUserRoleType = "STUDENT" | "ADMIN" | "PROFESSOR";

export type ApiUserPostReqType =
{
  m_email : string,
  m_pass  : string,
};

export type ApiUserPostResType =
{
  m_uuid  : string,
  m_email : string,
  m_role  : ApiUserRoleType
};

export type ApiUserLoginReqType =
{
  m_email : string,
  m_pass  : string
};

export type ApiUserLoginResType =
{
  token : string | null,
  body  :
  {
    m_uuid  : string,
    m_email : string,
    m_role  : ApiUserRoleType
  }
};

export type ApiUserMeResType =
{
  m_uuid  : string,
  m_email : string,
  m_role  : ApiUserRoleType
};

export type ApiSubjectPostReqType =
{
  m_name  : string,
  m_school: string
};

export type ApiSubjectPostResType =
{
  m_uuid  : string,
  m_name  : string,
  m_school: string
};

export type ApiSubjectDataType =
{
  m_uuid  : string,
  m_name  : string,
  m_school: string
};


export type ApiSubjectsPaginateResType =
{
  m_data: ApiSubjectDataType[],
  m_meta:
  {
    m_total_pages : number,
    m_current_page: number,
    m_limit       : number
  }
};

export type ApiSubjectPatchReqType =
{
  m_name  : string,
  m_school: string
};

