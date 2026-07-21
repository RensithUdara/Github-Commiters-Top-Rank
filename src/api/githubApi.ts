import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { GitHubUser } from "@/types";
import { GITHUB_API_BASE_URL } from "./config";

export const githubApi = createApi({
  reducerPath: "githubApi",
  baseQuery: fetchBaseQuery({
    baseUrl: GITHUB_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getGitHubUserByUsername: builder.query<GitHubUser, string>({
      query: (username) => `users/${username}`,
    }),
  }),
});
export const { useGetGitHubUserByUsernameQuery } = githubApi;
