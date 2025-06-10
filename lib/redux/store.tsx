import { configureStore } from '@reduxjs/toolkit'
import { AuthApi } from './api/Auth/AuthApi'
import { SitiesApi } from './api/Sities/SitiesApi'
import { NewsApi } from './api/News/NewsApi'
import { CategoriesApi } from './api/Categories/CategoriesApi'
import { UsersApi } from './api/Users/UsersApi'
import { OrdersApi } from './api/Orders/OrdersApi'
import { MastersApi } from './api/Masters/MastersApi'

export const store = configureStore({
	reducer: {
		[AuthApi.reducerPath]: AuthApi.reducer,
		[SitiesApi.reducerPath]: SitiesApi.reducer,
		[NewsApi.reducerPath]: NewsApi.reducer,
		[CategoriesApi.reducerPath]: CategoriesApi.reducer,
		[UsersApi.reducerPath]: UsersApi.reducer,
		[OrdersApi.reducerPath]: OrdersApi.reducer,
		[MastersApi.reducerPath]: MastersApi.reducer
	},
	middleware: getDefaultMiddleware => 
		getDefaultMiddleware().concat(
			AuthApi.middleware,
			SitiesApi.middleware,
			NewsApi.middleware,
			CategoriesApi.middleware,
			UsersApi.middleware,
			OrdersApi.middleware,
			MastersApi.middleware
		)
})