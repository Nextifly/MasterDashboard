import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ISignUpResponse, ISignUpRequest, ISignInResponse, ISignInRequest, IForgot, ILogout } from './types'
import https from 'https'

const customFetch = async (input: RequestInfo, init?: RequestInit) => {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 15000)
  
  const options: RequestInit = {
    ...init,
    signal: controller.signal,
  }

  // Добавляем agent только в Node.js среде
  if (typeof window === 'undefined') {
    const insecureAgent = new https.Agent({ rejectUnauthorized: false })
    options.agent = insecureAgent
  }

  try {
    return await fetch(input, options)
  } catch (error) {
    console.error('Fetch error:', error)
    throw new Error('Network request failed')
  }
}

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
	fetchFn: customFetch
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
