import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from "react";
import { eceApiGetErrorInfo } from "@/core/services/api/api-error-handler.service";
import type { EcePaginationFuncType } from "@/core/services/api/api.types";
import type { ApiPaginateResType } from "@/core/services/api/api.models";


type UseCrudPaginationType<Tdata> =
{
  page            : ApiPaginateResType<Tdata>,
  is_loading      : boolean,
  is_loading_more : boolean,
  has_more        : boolean,
  onLoadMore      : () => Promise<void>,
  setPage         : Dispatch<SetStateAction<ApiPaginateResType<Tdata>>>
  setIsLoading    : Dispatch<SetStateAction<boolean>>
};


/**
  * Handles the pagination math and fetches.
  *
  * This hook provides the brains for the paginatino logic
  * for fetching any "list" data from the BACKEND.
  *
  * @param fetchFn The fetch function. DO NOT PROVIDE AN ARROW FUNCTION, IT WILL CAUSE A LOOP!!!
  * @param limit The amount of items to be fetched per page. Max is 20 items / page.
  *
  * @returns An object with everything you need.
  */
export function useCrudPagination<Tdata>(
  fetchFn: EcePaginationFuncType<Tdata>,
  limit ?: number
): UseCrudPaginationType<Tdata>
{
  const [page, setPage] = useState<ApiPaginateResType<Tdata>>(
  {
    m_data: [],
    m_meta:
    {
      m_limit       : -1,
      m_current_page: -1,
      m_total_pages : -1
    }
  });

  const [is_loading, setIsLoading] = useState(false);
  const [is_loading_more, setIsLoadingMore] = useState(false)

  // Initial Hydration
  useEffect(() =>
  {
    const hydrate = async () =>
    {
      setIsLoading(true);

      const res = await fetchFn(0, limit); // Fetch the first page (zero page).

      // TODO: Use assertion to check res.data.m_data if its an array. ACTUALLY this belongs to the API fetch service.
      if ( res.success && res.data && Array.isArray(res.data.m_data) ) setPage(res.data);

      // TODO: Use a better pop-up UI.
      else if (res.status !== 404) alert(eceApiGetErrorInfo(res).dialog_body);

      setIsLoading(false);
    };

    hydrate();
  }, [fetchFn, limit]);



  // Load More Data
  const onLoadMore = useCallback(async () =>
  {
    if (is_loading_more) return;
    setIsLoadingMore(true);

    const nextPage  = page.m_meta.m_current_page + 1;
    const res       = await fetchFn(nextPage, limit);

    if (res.success && res.data)
    {
      setPage((prev) => (
      {
        m_meta: res.data!.m_meta,
        m_data: [...prev.m_data, ...res.data!.m_data]
      }));
    }

    else if (res.status !== 404)
    {
      // TODO: Show a better pop-up UI.
      alert(eceApiGetErrorInfo(res).dialog_body);
    }

    setIsLoadingMore(false);
  }, [fetchFn, page.m_meta.m_current_page, is_loading_more, limit]);

  return {
    page,
    is_loading,
    is_loading_more,
    has_more: page.m_meta.m_current_page < page.m_meta.m_total_pages - 1,
    onLoadMore,
    setPage,
    setIsLoading
  };
}

