export interface IUsersRequest {
	content: IUser[]
}

export interface IUserResponse {
	token: string;
	id: string;
}

export interface IDeleteUser {
	id: string;
	token: string;
}

export interface IUser {
	id: string;
	firstName: string;
	lastName: string;
	cityDto: ICity;
	phoneNumber: string;
	countCreatedOrders: number;
	countCanceledOrders: number;
}

interface ICity {
	name: string;
}