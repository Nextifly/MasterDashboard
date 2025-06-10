export interface IStaticRequest {
		totalOrders: number;
		closedOrders: number;
		openOrders: number;
		totalMasters: number;
		newMastersThisMonth: number;
		topMasters: IMaster[];
		ordersByCity: ICity[];
		usersByCity: ICity[];
		monthlyRevenue: number;
		totalRevenue: number
}

interface ICity {
	city: string;
	count: number
}

interface IMaster {
	firstName: string;
	lastName: string;
	closedOrders: number
}