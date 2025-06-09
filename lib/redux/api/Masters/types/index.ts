export interface IMastersRequest {
	content: IMaster[]
}

export interface IDeleteMaster {
	id: string;
	token: string;
}

interface IMaster {
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