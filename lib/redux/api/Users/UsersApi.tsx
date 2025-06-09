import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IDeleteUser, IUser, IUserResponse, IUsersRequest } from './types'


const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export const UsersApi = createApi({
	reducerPath: "users",
	baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
	endpoints: builder => ({
		getUsers: builder.query<IUsersRequest,string>({
			query: (token) => ({
				url: 'https://109.73.198.81:9093/api/admin/client-profiles',
				headers: {
					Authorization: `Bearer ${token}`,
				}
			})
		}),
		getUser: builder.query<IUser,IUserResponse>({
			query: ({id, token}) => ({
				url: 'https://109.73.198.81:9093/api/admin/client-profiles/'+id,
				headers: {
					Authorization: `Bearer ${token}`,
				}
			})
		}),
		deleteUsers: builder.mutation<void,IDeleteUser>({
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

export const {useGetUsersQuery, useDeleteUsersMutation, useLazyGetUserQuery} = UsersApi;