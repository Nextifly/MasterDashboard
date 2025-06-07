import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ICreateSity, IGetSity } from './types'


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
		createSities: builder.mutation<void,ICreateSity>({
			query: (city) => ({
				url: '/cities',
				method: 'post',
				body: city
			})
		}),
	})
})

export const {useGetSitiesQuery, useCreateSitiesMutation} = SitiesApi;