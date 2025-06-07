import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { IAccessToken, IRefreshToken } from './types'

export const useAccessToken = create<IAccessToken>()(
	persist(
		(set, get) => ({
			accessToken: undefined,
			setAccessToken: token => set({ accessToken: token }),
			deleteAccessToken: () => set({ accessToken: '' }),
		}),
		{
			name: 'accessToken',
			storage: createJSONStorage(() => localStorage),
		}
	)
)

export const useRefreshToken = create<IRefreshToken>()(
	persist(
		(set, get) => ({
			refreshToken: undefined,
			setRefreshToken: token => set({ refreshToken: token }),
			deleteRefreshToken: () => set({ refreshToken: '' }),
		}),
		{
			name: 'refreshToken',
			storage: createJSONStorage(() => localStorage),
		}
	)
)
