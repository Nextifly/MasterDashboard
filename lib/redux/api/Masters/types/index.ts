import { ISubCategoriesRequest } from '../../Categories/types'

export interface IMastersUnderReviewRequest {
	id: string;
	firstName: string;
	lastName: string;
	cityDto: ICity;
	phoneNumber: string;
	workExperience: string;
	verificationStatus: IVerification;
}

export interface IMastersApprovedRequest {
	id: string;
	firstName: string;
	lastName: string;
	cityDto: ICity;
	phoneNumber: string;
	totalCompletedOrders: number
}

export interface IMastersApprovedRequest {
	content: IMastersApprovedRequest[]
}

type IVerification = 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'

export interface IMasterRequest {
	id: string;
	userDto: IUser;
	masterInfoDto: IMaster;
	completedOrdersThisMonth: number;
	totalCompletedOrders: number;
}

interface IUser {
	id: string;
	phoneNumber: string;
}

interface IMaster {
	id: string;
	firstName: string;
	lastName: string;
	cityDto: ICity;
	email: string;
	hasConviction: boolean;
	workExperience: number;
	averageRating: number;
	ratingCount: number;
	maritalStatus: IMarital;
	education: IEducation;
	subserviceDtos: ISubCategoriesRequest[]
}

export type IMarital = "MARRIED" | "SINGLE" | 'DIVORCED'
export type IEducation = "HIGHER" | "SECONDARY" | "SECONDARY_SPECIAL" | "INCOMPLETE_HIGHER"

export interface IMasterResponse {
	id: string;
	token: string;
}

interface ICity {
	name: string;
}