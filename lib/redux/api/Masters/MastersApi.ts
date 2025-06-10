import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
	IMasterRequest,
	IMasterResponse,
	IMastersApprovedRequest,
	IMastersUnderReviewRequest,
} from './types'

const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL as string

export const MastersApi = createApi({
	reducerPath: 'masters',
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
	}),
	endpoints: builder => ({
		getMastersApproved: builder.query<IMastersApprovedRequest, string>({
			query: token => ({
				url: '/admin/master-profiles',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
		getMastersUnderReview: builder.query<IMastersUnderReviewRequest[], string>({
			query: token => ({
				url: '/master-requests',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
		getMasterApproved: builder.query<IMasterRequest, IMasterResponse>({
			query: ({ id, token }) => ({
				url: '/admin/master-profiles/' + id,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
		getMasterUnderReview: builder.query<IMasterRequest, IMasterResponse>({
			query: ({ id, token }) => ({
				url: '/master-requests/' + id,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
		approveMaster: builder.mutation<void, IMasterResponse>({
			query: ({ id, token }) => ({
				url: `/master-requests/${id}/approve`,
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
		rejectMaster: builder.mutation<void, IMasterResponse>({
			query: ({ id, token }) => ({
				url: `/master-requests/${id}/reject`,
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
		deleteMaster: builder.mutation<void, IMasterResponse>({
			query: ({ id, token }) => ({
				url: '/admin/master-profiles/' + id,
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		}),
	}),
})

export const {
	useGetMastersApprovedQuery,
	useGetMastersUnderReviewQuery,
	useLazyGetMasterApprovedQuery,
	useLazyGetMasterUnderReviewQuery,
	useApproveMasterMutation,
	useRejectMasterMutation,
	useDeleteMasterMutation,
} = MastersApi
