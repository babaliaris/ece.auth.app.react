import { useCallback } from "react";
import ExamsUI, { type ExamData } from "./ExamsUI";
import { useCrudPagination } from "@/hooks/useCrudPagination";
import { ece_api } from "@/core/services/api/api.service";
import { eceApiGetErrorInfo } from "@/core/services/api/api-error-handler.service";


function ExamsRoute()
{
  const {
    page, is_loading, is_loading_more, has_more,
    onLoadMore,setIsLoading, setPage
  } = useCrudPagination(ece_api.examPaginate);

  const onSubmit = useCallback(async (exam: ExamData, edit_uuid: string | null)=>
  {
    setIsLoading(true);

    // POST
    if ( !edit_uuid )
    {
      const post_result = await ece_api.examPost(
      [
        {
          m_semester: exam.m_semester,
          m_year    : exam.m_year
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
            ...old_state.m_data,
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
      const update_result = await ece_api.examUpdate(
      {
        m_semester: exam.m_semester,
        m_year    : exam.m_year
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
              m_uuid    : edit_uuid,
              m_semester: exam.m_semester,
              m_year    : exam.m_year
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


  const onDelete = useCallback(async (uuid: string)=>
  {
    setIsLoading(true);
    const delete_result = await ece_api.examDelete(uuid);

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
    <ExamsUI
    items={page.m_data}
    onSubmit={onSubmit}
    onDelete={onDelete}
    has_more={has_more}
    onLoadMore={onLoadMore}
    is_loading_more={is_loading_more}
    is_loading={is_loading}
    />
  );
}

export default ExamsRoute;

