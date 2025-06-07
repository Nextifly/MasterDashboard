import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IGetNews } from './types'

const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string

export const NewsApi = createApi({
	reducerPath: 'newsApi',
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
	}),
	endpoints: builder => ({
		getNews: builder.query<IGetNews[], void>({
			query: () => '/news',
		}),
		createNews: builder.mutation<void, FormData>({
			query: city => ({
				url: '/news',
				method: 'post',
				body: city,
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}),
		}),
	}),
})

export const { useGetNewsQuery, useCreateNewsMutation } = NewsApi
