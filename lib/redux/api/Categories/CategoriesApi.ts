import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
	ICategoriesRequest,
	IHiddenCategory,
	ISubServiceResponse,
} from './types'

const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string

export const CategoriesApi = createApi({
	reducerPath: 'categories',
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
	}),
	endpoints: builder => ({
		getCategories: builder.query<ICategoriesRequest[], string>({
			query: token => ({
				url: '/admin/service-categories/with-subservices',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
		createSubCategories: builder.mutation<void, ISubServiceResponse>({
			query: ({ serviceId, token, name }) => ({
				url: `/service-categories/${serviceId}/add-subservice`,
				method: 'POST',
				body: { name },
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
		hiddenCategory: builder.mutation<void, IHiddenCategory>({
			query: ({id, serviceId, token }) => ({
				url: `/service-categories/${serviceId}/hidden`,
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
		visibleCategory: builder.mutation<void, IHiddenCategory>({
			query: ({id, serviceId, token }) => ({
				url: `/service-categories/${serviceId}/visible`,
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
	}),
})

export const { useGetCategoriesQuery, useCreateSubCategoriesMutation, useHiddenCategoryMutation, useVisibleCategoryMutation } =
	CategoriesApi
