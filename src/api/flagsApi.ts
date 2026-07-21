import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DATA_BASE_URL } from "./config";

export interface FlagData {
  name: string;
  flagUrl: string;
  continent: string;
}

export const flagsApi = createApi({
  reducerPath: "flagsApi",
  baseQuery: fetchBaseQuery({ baseUrl: DATA_BASE_URL }),
  endpoints: (builder) => ({
    getFlags: builder.query<FlagData[], void>({
      query: () => "flags.json",
    }),
  }),
});

export const { useGetFlagsQuery } = flagsApi;
