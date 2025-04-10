export const setFilters = (filters) => ({
    type: 'SET_FILTERS',
    payload: filters,
});

export const clearFilters = () => ({
    type: 'CLEAR_FILTERS',
});

export const setSearchResults = (searchResults) => ({
    type: 'SET_SEARCH_RESULTS',
    payload: searchResults,
  });
