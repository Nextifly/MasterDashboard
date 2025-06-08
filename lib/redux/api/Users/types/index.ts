export interface IUsersRequest {
	id: string;
	firstName: string;
	lastName: string;
	cityDto: ICity;
	phoneNumber: string;
}

interface ICity {
	name: string;
}