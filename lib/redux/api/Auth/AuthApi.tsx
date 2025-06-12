import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ISignUpResponse, ISignUpRequest, ISignInResponse, ISignInRequest, IForgot, ILogout } from './types'
import https from 'https'


const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export const AuthApi = createApi({
	reducerPath: "auth",
	baseQuery: fetchBaseQuery({
   	baseUrl: BASE_URL,
	prepareHeaders: (headers) => {
	      headers.set("Content-Type", "application/json");
	      headers.set('Access-Control-Allow-Origin', '*');
	      headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	      headers.set("Access-Control-Allow-Headers", "Content-Type")
              return headers;
        },
	fetchFn: (input, init) => {
    return fetch(input, {
      ...init,
      agent: new https.Agent({ rejectUnauthorized: false })
    })
  }
  }),
	endpoints: builder => ({
		signUp: builder.mutation<ISignUpRequest,ISignUpResponse>({
			query: user => ({
				url: '/admin/register',
				method: 'POST',
				body: user
			}),
		}),
		signIn: builder.mutation<ISignInRequest,ISignInResponse>({
			query: user => ({
				url: '/admin/login',
				method: 'POST',
				body: user
			}),
		}),
		forgot: builder.mutation<void,IForgot>({
			query: user => ({
				url: '/admin/password/reset-confirm',
				method: 'PATCH',
				body: user
			}),
		}),
		logout: builder.mutation<void,ILogout>({
			query: user => ({
				url: '/admin/logout',
				method: 'POST',
				body: user
			})
		}),
		updateToken: builder.mutation<ISignInRequest,string>({
			query: token => ({
				url: '/admin/refresh',
				method: 'POST',
				body: token
			})
		})
	})
})

export const {useForgotMutation, useSignInMutation, useSignUpMutation, useLogoutMutation, useUpdateTokenMutation} = AuthApi;
