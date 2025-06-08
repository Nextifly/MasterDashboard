import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IUsersRequest } from './types'


const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export const UsersApi = createApi({
	reducerPath: "users",
	baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
	endpoints: builder => ({
		getUsers: builder.query<IUsersRequest[],string>({
			query: (token) => ({
				url: '/client-profiles/info',
				headers: {
					Authorization: `Bearer ${token}`,
				}
			})
		}),
	})
})

export const {useGetUsersQuery} = UsersApi;