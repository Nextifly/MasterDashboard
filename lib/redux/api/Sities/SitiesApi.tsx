import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ISityResponse, IGetSity, IHiddenSity, ISityRequest } from './types'


const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export const SitiesApi = createApi({
	reducerPath: "sites",
	baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
	endpoints: builder => ({
		getSities: builder.query<IGetSity[],void>({
			query: () => '/cities'
		}),
		createSities: builder.mutation<ISityRequest,ISityResponse>({
			query: ({name, token}) => ({
				url: '/cities',
				method: 'POST',
				body: {name},
				headers: {
					Authorization: `Bearer ${token}`,
				}
			})
		}),
		hiddenSities: builder.mutation<void,IHiddenSity>({
			query: ({id, token}) => ({
				url: `/cities/${id}/hidden`,
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
				}
			})
		}),
		visibleSities: builder.mutation<void,IHiddenSity>({
			query: ({id, token}) => ({
				url: `/cities/${id}/visible`,
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
				}
			})
		}),
	})
})

export const {useGetSitiesQuery, useCreateSitiesMutation, useHiddenSitiesMutation, useVisibleSitiesMutation} = SitiesApi;