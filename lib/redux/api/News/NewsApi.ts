import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ICreateNews, IGetNews, IHiddenNews } from './types'

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
		createNews: builder.mutation<void, ICreateNews>({
			query: ({ city, token }) => ({
				url: '/news',
				method: 'POST',
				body: city,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
		deleteNews: builder.mutation<void, { id: string; token: string }>({
			query: ({ id, token }) => ({
				url: '/news/' + id,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
		hiddenNews: builder.mutation<void, IHiddenNews>({
			query: ({ id, token }) => ({
				url: `/news/${id}/hidden`,
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
		visibleNews: builder.mutation<void, IHiddenNews>({
			query: ({ id, token }) => ({
				url: `/news/${id}/visible`,
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
	}),
})

export const { useGetNewsQuery, useCreateNewsMutation, useDeleteNewsMutation, useHiddenNewsMutation, useVisibleNewsMutation } =
	NewsApi
