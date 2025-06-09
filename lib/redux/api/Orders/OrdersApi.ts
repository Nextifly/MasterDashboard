import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IOrderRequest, IOrderResponse, IOrdersRequest } from './types'


const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string;

export const OrdersApi = createApi({
	reducerPath: "orders",
	baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
	endpoints: builder => ({
		getOrders: builder.query<IOrdersRequest,string>({
			query: (token) => ({
				url: '/admin/orders',
				headers: {
					Authorization: `Bearer ${token}`,
				}
			})
		}),
		getOrder: builder.query<IOrderRequest,IOrderResponse>({
			query: ({id, token}) => ({
				url: '/admin/orders/'+id,
				headers: {
					Authorization: `Bearer ${token}`,
				}
			})
		})
	})
})

export const {useGetOrdersQuery, useLazyGetOrderQuery} = OrdersApi;