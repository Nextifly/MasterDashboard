import { configureStore } from '@reduxjs/toolkit'
import { AuthApi } from './api/Auth/AuthApi'
import { SitiesApi } from './api/Sities/SitiesApi'
import { NewsApi } from './api/News/NewsApi'

export const store = configureStore({
	reducer: {
		[AuthApi.reducerPath]: AuthApi.reducer,
		[SitiesApi.reducerPath]: SitiesApi.reducer,
		[NewsApi.reducerPath]: NewsApi.reducer
	},
	middleware: getDefaultMiddleware => 
		getDefaultMiddleware().concat(
			AuthApi.middleware,
			SitiesApi.middleware,
			NewsApi.middleware
		)
})