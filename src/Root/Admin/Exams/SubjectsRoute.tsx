import { useCallback } from "react";
import SubjectsUI, {type SubjectData} from "./SubjectsUI";
import { useCrudPagination } from "@/hooks/useCrudPagination";
import { ece_api } from "@/core/services/api/api.service";
import { eceApiGetErrorInfo } from "@/core/services/api/api-error-handler.service";


function SubjectsRoute()
{
  const {
    page, is_loading, is_loading_more, has_more,
    onLoadMore,setIsLoading, setPage
  } = useCrudPagination(ece_api.subjectsPaginate);

  const onSubjectSubmit = useCallback(async (subject: SubjectData, edit_uuid: string | null)=>
  {
    setIsLoading(true);

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
        setPage((old_state) => (
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

    setIsLoading(false);
  }, [setIsLoading, setPage]);


  const onSubjectDelete = useCallback(async (uuid: string)=>
  {
    setIsLoading(true);
    console.log(`On Subject Delete uuid = ${uuid}`);
    setIsLoading(false);
  }, [setIsLoading]);


  return (
    <SubjectsUI
    subjects={page.m_data}
    onSubmit={onSubjectSubmit}
    onDelete={onSubjectDelete}
    has_more={has_more}
    onLoadMore={onLoadMore}
    is_loading_more={is_loading_more}
    is_loading={is_loading}
    />
  );
}

export default SubjectsRoute;

