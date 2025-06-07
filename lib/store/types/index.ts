export interface IAccessToken {
	accessToken: undefined | string
	setAccessToken: (token: string) => void
	deleteAccessToken: () => void
}

export interface IRefreshToken {
	refreshToken: undefined | string
	setRefreshToken: (token: string) => void
	deleteRefreshToken: () => void
}
