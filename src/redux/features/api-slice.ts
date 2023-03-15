import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
import {apiService} from '../../services/api.service';

export const ApiSlice = createApi({
  reducerPath: 'baanListApi',
  tagTypes: ['Baan'],
  baseQuery: fetchBaseQuery({
    baseUrl: apiService.baseURL,
    prepareHeaders: headers => {
      headers.set(
        'authorization',
        apiService.getHeaders().headers.authorization,
      );

      return headers;
    },
  }),
  endpoints: () => ({}),
});
