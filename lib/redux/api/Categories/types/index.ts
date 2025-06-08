export interface ICategoriesRequest {
	id: string;
	name: string;
	visible: boolean;
	subserviceDtos: ISubCategoriesRequest[]
}

export interface ISubCategoriesRequest {
	id: string;
	name: string;
	visible: boolean;
}

export interface ISubServiceResponse {
	name: string;
	serviceId: string;
	token: string;
}

export interface IHiddenCategory {
	id: string;
	serviceId: string;
	token: string;
}