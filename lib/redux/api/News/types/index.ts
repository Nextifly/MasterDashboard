export interface IGetNews {
	id: string
	title: string
	createdAt: Date
	cityDto: ICity;
	visible: boolean;
}

interface ICity {
	name: string;
}

export interface ICreateNews {
	city: FormData;
	token: string;
}

export interface IHiddenNews {
	id: string;
	token: string;
}
