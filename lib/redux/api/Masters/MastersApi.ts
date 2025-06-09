import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IDeleteMaster, IMastersRequest } from './types'


const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export const MastersApi = createApi({
	reducerPath: "masters",
	baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
	endpoints: builder => ({
		getMasters: builder.query<IMastersRequest,string>({
			query: (token) => ({
				url: 'https://109.73.198.81:9093/api/admin/client-profiles',
				headers: {
					Authorization: `Bearer ${token}`,
				}
			})
		}),
		deleteMasters: builder.mutation<void,IDeleteMaster>({
			query: ({id, token}) => ({
				url: "/admin/client-profiles/" + id,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				}
			})
		})
	})
})

export const {useGetMastersQuery, useDeleteMastersMutation} = MastersApi;