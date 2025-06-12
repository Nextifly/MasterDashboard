import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ISignUpResponse, ISignUpRequest, ISignInResponse, ISignInRequest, IForgot, ILogout } from './types'

const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string

// Универсальный fetch, который игнорирует ошибки SSL в браузере и Node.js
const insecureFetch = async (input: RequestInfo, init?: RequestInit) => {
  // Если код выполняется в браузере
  if (typeof window !== 'undefined') {
    // Используем прокси-сервер для обхода CORS и SSL в браузере
    const proxyUrl = '/api/proxy?endpoint=' + encodeURIComponent(input.toString())
    return fetch(proxyUrl, init)
  }
  
  // Если код выполняется в Node.js (SSR)
  const { default: nodeFetch } = await import('node-fetch')
  const https = await import('https')
  const agent = new https.Agent({ 
    rejectUnauthorized: false // Игнорируем ошибки SSL
  })
  return nodeFetch(input as any, { ...init as any, agent })
}

export const AuthApi = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    fetchFn: insecureFetch, // Используем наш кастомный fetch
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json")
      return headers
    },
  }),
  endpoints: builder => ({
    // ... ваши endpoints остаются без изменений
    signUp: builder.mutation<ISignUpRequest, ISignUpResponse>({
      query: user => ({
        url: '/admin/register',
        method: 'POST',
        body: user
      }),
    }),
    // ... остальные endpoints
  })
})
