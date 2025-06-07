import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ISignUpResponse, ISignUpRequest, ISignInResponse, ISignInRequest, IForgot, ILogout } from './types'


const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export const AuthApi = createApi({
	reducerPath: "auth",
	baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
	endpoints: builder => ({
		signUp: builder.mutation<ISignInRequest,ISignUpResponse>({
			query: user => ({
				url: '/admin/register',
				method: 'post',
				body: user
			}),
		}),
		signIn: builder.mutation<ISignInRequest,ISignInResponse>({
			query: user => ({
				url: '/admin/login',
				method: 'post',
				body: user
			}),
		}),
		forgot: builder.mutation<void,IForgot>({
			query: user => ({
				url: '/admin/password/reset-confirm',
				method: 'patch',
				body: user
			}),
		}),
		logout: builder.mutation<void,ILogout>({
			query: user => ({
				url: '/admin/logout',
				method: 'post',
				body: user
			})
		})
	})
})

export const {useForgotMutation, useSignInMutation, useSignUpMutation, useLogoutMutation} = AuthApi;