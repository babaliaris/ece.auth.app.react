import { useState, useEffect, useCallback } from "react";
import SubjectsUI, {type SubjectData} from "./SubjectsUI";
import { type ApiSubjectsPaginateResType } from "@/core/services/api/api.models";
import { ece_api } from "@/core/services/api/api.service";
import { eceApiGetErrorInfo } from "@/core/services/api/api-error-handler.service";


function SubjectsRoute()
{
  const [pages, setPages] = useState<ApiSubjectsPaginateResType>(
  {
    m_data: [],
    m_meta:
    {
      m_limit: -1,
      m_current_page: -1,
      m_total_pages: -1
    }
  });

  useEffect(()=>
  {
    // Fetch the first Subjects Page.
    const hydrate = async ()=>
    {
      const original_fetch = await ece_api.subjectsPaginate(0);

      if (original_fetch.success && original_fetch.data)
      {
        setPages(original_fetch.data);
      }

      else
      {
        switch (original_fetch.status)
        {
          case 404: break;

          // TODO: Use a better UI for that.
          default: alert(eceApiGetErrorInfo(original_fetch).dialog_body);
        }
      }
    };

    hydrate();
  }, []);

  const onSubjectSubmit = useCallback(async (subject: SubjectData, edit_uuid: string | null)=>
  {
    if ( !edit_uuid )
    {
      const post_result = await ece_api.subjectPost(
      [
        {
          m_name: subject.m_name, m_school: subject.m_school
        }
      ]);

      if (post_result.success && Array.isArray(post_result.data))
      {
        const fetched_data = post_result.data;
        setPages((old_state) => (
        {
          ...old_state,
          m_data:
          [
            ...old_state.m_data,
            ...fetched_data
          ]
        }));
      }

      else
      {
        // TODO: Show a better UI.
        alert(eceApiGetErrorInfo(post_result).dialog_body);
      }
    }

    else
    {
      console.log(`onSubjectSubmit():EDIT is not implemented yet!`);
    }
  }, []);


  const onSubjectDelete = useCallback(async (uuid: string)=>
  {
    console.log(`On Subject Delete uuid = ${uuid}`);
  }, []);

  return (
    <SubjectsUI
    subjects={pages.m_data}
    onSubmit={onSubjectSubmit}
    onDelete={onSubjectDelete}
    />
  );
}

export default SubjectsRoute;

