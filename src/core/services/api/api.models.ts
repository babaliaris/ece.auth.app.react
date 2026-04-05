export type ApiUserPostReqType =
{
  m_email : string,
  m_pass  : string
};

export type ApiUserPostResType =
{
  m_uuid  : string,
  m_email : string
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
    m_email : string
  }
};

