import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DATA_BASE_URL } from "./config";

export interface Country {
  slug: string;
  name: string;
  flagUrl: string;
}

export const countriesApi = createApi({
  reducerPath: "countriesApi",
  baseQuery: fetchBaseQuery({ baseUrl: DATA_BASE_URL }),
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], void>({
      query: () => "countries.json",
    }),
  }),
});

export const { useGetCountriesQuery } = countriesApi;
