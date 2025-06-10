import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IStaticRequest } from './types'


const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export const StaticApi = createApi({
	reducerPath: "static",
	baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
	endpoints: builder => ({
		getStatic: builder.query<IStaticRequest,string>({
			query: (token) => ({
				url: '/admin/report',
				headers: {
					Authorization: `Bearer ${token}`,
				}
			})
		}),
	})
})

export const {useGetStaticQuery} = StaticApi;