export interface IGetSity {
	name: string;
	visible: boolean;
	id: string;
}

export interface ISityResponse {
	name: string
	token: string;
}

export interface ISityRequest {
	message?: string
}

export interface IHiddenSity {
	id: string;
	token: string;
}