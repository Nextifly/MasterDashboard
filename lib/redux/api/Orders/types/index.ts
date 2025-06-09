export interface IOrdersRequest {
	content: IOrders[]
}

export interface IOrderResponse {
	id: string;
	token: string;
}

export interface IOrderRequest {
	id: string;
	createdAt: Date;
	serviceCategoryDto: IServicesRequest;
	cityDto: ICIty;
	status: string;
	comment: string;
	masterInfoDto: IMaster;
	clientInfoDto: IClient;
	masterFeedbackDto: IMasterFeedBack;
	postponeDto: IPostpone;
}

interface IPostpone {
	reason: string;
	newAppointmentDate: Date;
}

interface IMasterFeedBack {
	review: string;
	rating: number;
}

interface IClient {
	id: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	address: string
}

interface IMaster {
	id: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	averageRating: number;
}

interface IOrders {
	id: string;
	createdAt: Date;
	cityDto: ICIty;
	serviceCategoryDto: IServicesRequest;
	serviceType: string;
	status: IStatus;
}

type IStatus = "CANCELLED" | "COMPLETED" | "SEARCHING_FOR_MASTER" | "TAKEN_IN_WORK" | "DEFERRED_REPAIR"

interface IServicesRequest {
	id: string;
	name: string;
	subserviceDto: ISubCategoryRequest
}

interface ISubCategoryRequest {
	id: string;
	name: string;
	visible: boolean;
}

interface ICIty {
	name: string;
}