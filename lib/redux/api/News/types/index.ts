import { StaticImageData } from 'next/image'

export interface IGetNews {
	id: string
	title: string
	createdAt: Date
	cityDto: ICity
}

interface ICity {
	name: string;
}
