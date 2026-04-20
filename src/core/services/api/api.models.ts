// ----------|General Purpose Types|---------- //
export type ApiUserRoleType = "STUDENT" | "ADMIN" | "PROFESSOR";

export type ApiPaginateResType<Tdata> =
{
  m_data: Tdata[],
  m_meta:
  {
    m_total_pages : number,
    m_current_page: number,
    m_limit       : number
  }
};
// ----------|General Purpose Types|---------- //


// ---------------|User Types|---------------- //
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
// ---------------|User Types|---------------- //



// -------------|Subject Types|-------------- //
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

export type ApiSubjectPatchReqType =
{
  m_name  : string,
  m_school: string
};
// -------------|Subject Types|-------------- //



// --------------|Exam Types|--------------- //
export type ApiExamPostReqType =
{
  m_semester: "FALL" | "SPRING",
  m_year    : number
};

export type ApiExamPostResType =
{
  m_uuid    : string,
  m_semester: "FALL" | "SPRING",
  m_year    : number
};

export type ApiExamDataType =
{
  m_uuid    : string,
  m_semester: "FALL" | "SPRING",
  m_year    : number
};

export type ApiExamPatchReqType =
{
  m_semester: "FALL" | "SPRING",
  m_year    : number
}
// --------------|Exam Types|--------------- //

