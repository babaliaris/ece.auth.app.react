import { useCallback } from "react";
import SubjectsUI, {type SubjectData} from "./SubjectsUI";
import { useCrudPagination } from "@/hooks/useCrudPagination";
import { ece_api } from "@/core/services/api/api.service";
import { eceApiGetErrorInfo } from "@/core/services/api/api-error-handler.service";


function SubjectsRoute()
{
  const {
    page, is_loading, is_loading_more, is_searching, search_value,
    has_more, onLoadMore,setIsLoading, setPage, onSearch
  } = useCrudPagination(ece_api.subjectsPaginate);

  const onSubjectSubmit = useCallback(async (subject: SubjectData, edit_uuid: string | null)=>
  {
    setIsLoading(true);

    // POST
    if ( !edit_uuid )
    {
      const post_result = await ece_api.subjectPost(
      [
        {
          m_name: subject.m_name, m_school: subject.m_school
        }
      ]);

      // Success.
      if (post_result.success && Array.isArray(post_result.data))
      {
        const fetched_data = post_result.data;

        // Update the UI state.
        setPage((old_state) => (
        {
          ...old_state,
          m_data:
          [
            ...fetched_data,
            ...old_state.m_data
          ]
        }));
      }

      // Failure.
      else
      {
        // TODO: Show a better UI.
        alert(eceApiGetErrorInfo(post_result).dialog_body);
      }
    }

    // Update Request.
    else
    {
      const update_result = await ece_api.subjectUpdate(
      {
        m_name: subject.m_name,
        m_school: subject.m_school
      }, edit_uuid);

      // Success.
      if (update_result.success)
      {
        // Update the UI state.
        setPage((old_state)=>(
        {
          ...old_state,
          m_data: old_state.m_data.map((subj)=>
          {
            if (subj.m_uuid !== edit_uuid) return subj;
            return {
              m_uuid  : edit_uuid,
              m_name  : subject.m_name,
              m_school: subject.m_school
            }
          })
        }));
      }

      // Failure.
      else
      {
        // TODO: Show a better UI.
        alert(eceApiGetErrorInfo(update_result).dialog_body);
      }

    }

    setIsLoading(false);
  }, [setIsLoading, setPage]);


  const onSubjectDelete = useCallback(async (uuid: string)=>
  {
    setIsLoading(true);
    const delete_result = await ece_api.subjectDelete(uuid);

    // Success.
    if (delete_result.success)
    {
      // Update the UI state.
      setPage((old_state)=>(
      {
        ...old_state,
        m_data: old_state.m_data.filter((subj)=>
        {
          return subj.m_uuid !== uuid;
        })
      }));
    }

    // Failure.
    else
    {
      // TODO: Show a better UI.
      alert(eceApiGetErrorInfo(delete_result).dialog_body);
    }

    setIsLoading(false);
  }, [setIsLoading, setPage]);


  return (
    <SubjectsUI
      items={page.m_data}
      onSubmit={onSubjectSubmit}
      onDelete={onSubjectDelete}
      onLoadMore={onLoadMore}
      has_more={has_more}
      is_loading={is_loading}
      is_loading_more={is_loading_more}
      search_filter=
      {{
        onSearch: onSearch,
        is_searching: is_searching,
        search_value: search_value
      }}
    />
  );
}

export default SubjectsRoute;

