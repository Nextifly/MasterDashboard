export interface ISignUpResponse {
	email: string;
	name: string;
	password: string;
}

export interface ISignUpRequest {
	message?: string;
}

export interface ISignInResponse {
	email: string;
	password: string;
}

export interface ISignInRequest {
	accessToken?: string;
	refreshToken?: string;
}

export interface IForgot {
	email: string;
	code: string;
	newPassword: string;
}

export interface ILogout {
	accessToken: string;
	refreshToken: string;
}