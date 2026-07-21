import type { Committer, Mode } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DATA_BASE_URL } from "./config";

export const committersApi = createApi({
  reducerPath: "committersApi",
  baseQuery: fetchBaseQuery({ baseUrl: DATA_BASE_URL }),
  endpoints: (builder) => ({
    getCountryUsers: builder.query<
      { users: Committer[]; generatedAt: string },
      { country: string; mode: Mode }
    >({
      query: ({ country }) => `committers/${country}.json`,
    }),
  }),
});

export const { useGetCountryUsersQuery } = committersApi;
