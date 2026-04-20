import {
  useState, useEffect, useCallback, useMemo,
  type Dispatch, type SetStateAction
} from "react";
import { eceApiGetErrorInfo } from "@/core/services/api/api-error-handler.service";
import type { EcePaginationFuncType } from "@/core/services/api/api.types";
import type { ApiPaginateResType } from "@/core/services/api/api.models";


type UseCrudPaginationType<Tdata> =
{
  page            : ApiPaginateResType<Tdata>,
  is_loading      : boolean,
  is_loading_more : boolean,
  is_searching    : boolean,
  has_more        : boolean,
  search_value    : string,
  onLoadMore      : () => Promise<void>,
  setPage         : Dispatch<SetStateAction<ApiPaginateResType<Tdata>>>
  setIsLoading    : Dispatch<SetStateAction<boolean>>
  onSearch        : (value: string)=>void
};


/**
  * Handles the pagination math and fetches.
  *
  * This hook provides the brains for the paginatino logic
  * for fetching any "list" data from the BACKEND.
  *
  * @param fetchFn The fetch function. DO NOT PROVIDE AN ARROW FUNCTION, IT WILL CAUSE A LOOP!!!
  * @param limit The amount of items to be fetched per page. Max is 20 items / page.
  * @param options An options object for better control of th data.
  *
  * @returns An object with everything you need.
  */
export function useCrudPagination<Tdata>(
  fetchFn : EcePaginationFuncType<Tdata>,
  options?:
  {
    /** The amount of items to be fetched per page. Max is 20 items / page. */
    limit           ?: number,

    /**
     * A custom comparison function used to sort the data locally.
     * @param a The first element for comparison.
     * @param b The second element for comparison.
     * @returns A negative value if `a` should come before `b`, 
     * a positive value if `a` should come after `b`, 
     * or 0 if they are equal.
     * @example
     * (a, b) => b.m_year - a.m_year // Sort by year descending
     */
    onSortComparator?: (a: Tdata, b: Tdata) => number
  }
): UseCrudPaginationType<Tdata>
{
  const { onSortComparator } = options ?? {};

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

  const [is_loading, setIsLoading]              = useState(false);
  const [is_loading_more, setIsLoadingMore]     = useState(false);
  const [is_searching, setIsSearching]          = useState(false);
  const [search_value, setSearchValue]          = useState<string>("");
  const [debounced_search, setDebouncedSearch]  = useState<string>("");

  // Debounce Search Trigger.
  // Call the api after 0.5 seconds after a keystroke
  // so we won't brick the internet connection and API.
  useEffect(() =>
  {
    const handler = setTimeout(() =>
    {
      setDebouncedSearch(search_value);
    }, 500);

    // Cleanup: stops the timer if user types again
    return () =>
    {
      clearTimeout(handler);
    };
  }, [search_value]);

  // Initial Hydration
  useEffect(() =>
  {
    let is_active = true;

    const hydrate = async () =>
    {
      setIsLoading(true);

      const search = debounced_search || undefined;

      const res = await fetchFn(0, options?.limit, search); // Fetch the first page (zero page).

      // Return if this USE EFFECT call has been disabled
      // do to another call. Only the latest call should Update the UI
      // to avoid race conditions.
      if (!is_active) return;

      // TODO: Use assertion to check res.data.m_data if its an array. ACTUALLY this belongs to the API fetch service.
      if ( res.success && res.data && Array.isArray(res.data.m_data) ) setPage(res.data);

      // TODO: Use a better pop-up UI.
      else if (res.status !== 404) alert(eceApiGetErrorInfo(res).dialog_body);

      setIsLoading(false);
      setIsSearching(false);
    };

    hydrate();

    // Cleanup function runs when debounced_search changes again
    return () =>
    {
      is_active = false
    };

  }, [fetchFn, options?.limit, debounced_search]);


  /*
    * Set searching value.
  */
  const onSearch = useCallback((value: string) =>
  {
    setSearchValue(value);
    setIsSearching(true);
  }, []);

  // Load More Data
  const onLoadMore = useCallback(async () =>
  {
    if (is_loading_more) return;
    setIsLoadingMore(true);

    const nextPage  = page.m_meta.m_current_page + 1;
    const res       = await fetchFn(nextPage, options?.limit, debounced_search || undefined);

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
  }, [fetchFn, page.m_meta.m_current_page, is_loading_more, options?.limit, debounced_search]);

  /**
   * We calculate the sorted data ONLY when the page changes
   * or the user changes the sorting function.
   */
  const sortedPage = useMemo(() =>
  {
    if (!onSortComparator || page.m_data.length === 0)
    {
      return page;
    }

    return {
      ...page,
      // We MUST spread [...page.m_data] because .sort() mutates the original array!
      m_data: [...page.m_data].sort(onSortComparator)
    };
  }, [page, onSortComparator]);

  return {
    page: sortedPage,
    is_loading,
    is_loading_more,
    is_searching,
    has_more: page.m_meta.m_current_page < page.m_meta.m_total_pages - 1,
    search_value,
    onLoadMore,
    setPage,
    setIsLoading,
    onSearch
  };
}

