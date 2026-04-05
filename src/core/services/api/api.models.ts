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

