'use client'

import SVGArrowBack from '@/assets/images/arrow_back.svg'
import SVGClose from '@/assets/images/close2.svg'
import NavBar from '@/components/NavBar/NavBar'
import Table, { IList } from '@/components/Table/Table'
import {
	useApproveMasterMutation,
	useGetMastersUnderReviewQuery,
	useLazyGetMasterUnderReviewQuery,
	useRejectMasterMutation,
} from '@/lib/redux/api/Masters/MastersApi'
import {
	IEducation,
	IMarital,
	IMasterRequest,
} from '@/lib/redux/api/Masters/types'
import { useAccessToken } from '@/lib/store/store'

import { myToast } from '@/ui/toast'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

const MastersNow = () => {
	const { accessToken } = useAccessToken()
	const { data: getMasters } = useGetMastersUnderReviewQuery(accessToken!)
	const [getMaster, { data: masterData }] = useLazyGetMasterUnderReviewQuery()
	const [approveMaster] = useApproveMasterMutation()
	const [rejectMaster] = useRejectMasterMutation()

	const [masters, setMasters] = useState<IList>({
		header: [
			{ name: 'ID' },
			{ name: 'Город', filter: true },
			{ name: 'ФИО клиента', filter: true },
			{ name: 'Телефон' },
			{ name: 'Опыт работы', filter: true },
			{ name: 'Действия' },
		],
		list: [],
	})
	const [filterMasters, setFilterMasters] = useState<IList>(masters)
	const [modal, setModal] = useState<boolean>(false)
	const [master, setMaster] = useState<IMasterRequest | undefined>()
	const [isLoading, setIsLoading] = useState(false)
	const [photoProfileData, setPhotoProfileData] = useState<string | undefined>()
	const [photoPassportMainData, setPhotoPassportMainData] = useState<
		string | undefined
	>()
	const [photoPassportRegisterData, setPhotoPassportRegisterData] = useState<
		string | undefined
	>()
	const [photoInnData, setPhotoInnData] = useState<string | undefined>()
	const [photoSnilsData, setPhotoSnilsData] = useState<string | undefined>()

	useEffect(() => {
		if (getMasters) {
			let newArr: string[][] = []
			getMasters.map(master => {
				if (master.verificationStatus === 'UNDER_REVIEW') {
					getMaster({ id: master.id, token: accessToken! })
					const id = `${master.id.slice(0, 3)}-${master.id.slice(
						master.id.length - 3,
						master.id.length
					)}`
					const masterName = `${master.firstName} ${master.lastName}`

					let arr = []
					arr.push(id.slice(0, 3) + '-' + id.slice(id.length - 3, id.length))
					arr.push(master.cityDto.name)
					arr.push(masterName)
					arr.push(master.phoneNumber)
					arr.push(master.workExperience || '0')
					arr.push(master.id)
					newArr.push(arr)
				}
			})
			setMasters({ header: masters.header, list: newArr })
			setFilterMasters({ header: masters.header, list: newArr })
		}
	}, [getMasters])

	const handleClick = useCallback(
		async (id: string) => {
			try {
				// 1. Начало операции - сбрасываем состояния
				setIsLoading(true)
				setMaster(undefined)

				// 2. Синхронные обновления
				setModal(true)
				console.log('Modal state set to true')

				// 3. Асинхронная операция
				// 3. Асинхронная операция
				await getMaster({ id, token: accessToken! }).unwrap().then(async(masterData: IMasterRequest) => {
					setMaster(masterData)
					const photoProfileFetch = await fetch(
					`https://109.73.198.81:9093/api/master-profiles/${masterData.id}/photo-profile`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				)
				const photoPassportMainFetch = await fetch(
					`https://109.73.198.81:9093/api/master-profiles/${masterData.id}/photo-passport-main`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				)
				const photoPassportRegisterFetch = await fetch(
					`https://109.73.198.81:9093/api/master-profiles/${masterData.id}/photo-passport-register`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				)
				const photoSnilsFetch = await fetch(
					`https://109.73.198.81:9093/api/master-profiles/${masterData.id}/photo-snils`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				)
				const photoInnFetch = await fetch(
					`https://109.73.198.81:9093/api/master-profiles/${masterData.id}/photo-inn`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				)
								
				const blobProfile = await photoProfileFetch.blob()
				const blobPassportMain = await photoPassportMainFetch.blob()
				const blobPassportRegister = await photoPassportRegisterFetch.blob()
				const blobInn = await photoInnFetch.blob()
				const blobSnils = await photoSnilsFetch.blob()

				// 4. После получения данных

				setPhotoProfileData(URL.createObjectURL(blobProfile))
				setPhotoPassportMainData(URL.createObjectURL(blobPassportMain))
				setPhotoPassportRegisterData(URL.createObjectURL(blobPassportRegister))
				setPhotoInnData(URL.createObjectURL(blobInn))
				setPhotoSnilsData(URL.createObjectURL(blobSnils))})
			} catch (error) {
				console.error('Error fetching order:', error)
			} finally {
				// 5. Финализация
				setIsLoading(false)
			}
		},
		[accessToken, masterData]
	)

	useEffect(() => {
		if (masterData) {
			setMaster(masterData)
		}
	}, [masterData])

	function getMarriedStatus(status: IMarital) {
		return status === 'DIVORCED'
			? 'Разведён/Разведена'
			: status === 'MARRIED'
			? 'Женат/Замужем'
			: 'Холост/Не замужем'
	}

	function getEducationStatus(status: IEducation) {
		return status === 'HIGHER'
			? 'Высшее'
			: status === 'SECONDARY'
			? 'Среднее'
			: status === 'INCOMPLETE_HIGHER'
			? 'Неоконченное высшее'
			: 'Среднее специальное'
	}

	const handlyApproved = async (id: string) => {
		try {
			const response = await approveMaster({ id, token: accessToken! })
			if (response.error) {
				return myToast({ message: 'Ошибка!', type: 'error' })
			}
			myToast({ message: 'Успешно!', type: 'success' })
			setTimeout(() => {
				window.location.reload()
			}, 2000)
		} catch (e) {
			myToast({ message: 'Ошибка!', type: 'error' })
		}
	}

	const handlyReject = async (id: string) => {
		try {
			const response = await rejectMaster({ id, token: accessToken! })
			if (response.error) {
				return myToast({ message: 'Ошибка!', type: 'error' })
			}
			myToast({ message: 'Успешно!', type: 'success' })
			setTimeout(() => {
				window.location.reload()
			}, 2000)
		} catch (e) {
			myToast({ message: 'Ошибка!', type: 'error' })
		}
	}

	return (
		<>
			<NavBar active='masters' />
			<section className='px-30 my-6'>
				<Link href='/dashboard/masters' className='flex gap-5 items-center'>
					<Image src={SVGArrowBack} alt='...' />
					<h2 className='text-2xl'>Новые заявки</h2>
				</Link>
			</section>
			<Table list={filterMasters} onClick={handleClick} />
			{master !== undefined && !isLoading ? (
				<section
					className={`fixed w-full h-full top-0 left-0 bg-[#00000099] ${
						!modal && 'hidden'
					} flex justify-center items-center`}
				>
					<div className='w-auto h-auto bg-[#D9D9D9] rounded-[20px] p-10 relative max-h-[700px] overflow-auto'>
						<Image
							src={SVGClose}
							alt='...'
							className='absolute top-3 right-3 cursor-pointer'
							onClick={() => {
								setModal(false)
								setMaster(undefined)
							}}
						/>
						<div className='flex justify-start items-start gap-10 mb-5'>
							{photoProfileData ? (
								<img
									src={photoProfileData}
									alt='...'
									className='size-[305px] rounded-[20px]'
								/>
							) : (
								<div className='size-[305px] rounded-[20px] bg-[#8B8181]' />
							)}
							<div>
								<h2 className='font-bold text-[20px] mb-5'>
									ID{' '}
									{master.id.slice(0, 3) +
										'-' +
										master.id.slice(master.id.length - 3, master.id.length)}
								</h2>
								<p>Город: {master.masterInfoDto.cityDto.name}</p>
								<p>Телефон: {master.userDto.phoneNumber}</p>
								<p>E-mail: {master.masterInfoDto.email}</p>
								<p>Имя: {master.masterInfoDto.firstName}</p>
								<p>Фамилия: {master.masterInfoDto.lastName}</p>
								<p>
									Семейное положение:{' '}
									{getMarriedStatus(master.masterInfoDto.maritalStatus)}
								</p>
								<p>
									Образование:{' '}
									{getEducationStatus(master.masterInfoDto.education)}
								</p>
								<p>Опыт работы: {master.masterInfoDto.workExperience || '0'}</p>
								<p>
									Судимость: {master.masterInfoDto.hasConviction ? 'Да' : 'Нет'}
								</p>
							</div>
						</div>
						<div className='mb-5'>
							<h2 className='font-bold text-[20px] mb-5'>Фото документов</h2>
							<div className='flex justify-start items-center gap-5'>
								<div className='flex flex-wrap max-w-[322px] gap-3'>
									{photoInnData ? (
										<Link href={photoInnData} target='_blank'>
											<img
												src={photoInnData}
												alt='...'
												className='size-[141px] rounded-[20px]'
											/>
										</Link>
									) : (
										<div className='size-[141px] rounded-[20px] bg-[#8B8181]' />
									)}
									{photoPassportMainData ? (
										<Link href={photoPassportMainData} target='_blank'>
											<img
												src={photoPassportMainData}
												alt='...'
												className='size-[141px] rounded-[20px]'
											/>
										</Link>
									) : (
										<div className='size-[141px] rounded-[20px] bg-[#8B8181]' />
									)}
									{photoPassportRegisterData ? (
										<Link href={photoPassportRegisterData} target='_blank'>
											<img
												src={photoPassportRegisterData}
												alt='...'
												className='size-[141px] rounded-[20px]'
											/>
										</Link>
									) : (
										<div className='size-[141px] rounded-[20px] bg-[#8B8181]' />
									)}
									{photoSnilsData ? (
										<Link href={photoSnilsData} target='_blank'>
											<img
												src={photoSnilsData}
												alt='...'
												className='size-[141px] rounded-[20px]'
											/>
										</Link>
									) : (
										<div className='size-[141px] rounded-[20px] bg-[#8B8181]' />
									)}
								</div>
								<div className='flex flex-col gap-2 max-h-[300px] h-[300px] overflow-auto pr-4'>
									<h2 className='font-bold'>Специализация</h2>
									{master.masterInfoDto.subserviceDtos.map(subservice => (
										<p
											className='leading-[18px]'
											key={master.id + subservice.id}
										>
											{subservice.name}
										</p>
									))}
								</div>
							</div>
						</div>
						<div className='flex justify-between items-center mt-10'>
							<button
								className='rounded-[10px] bg-[#8B8181] text-white text-[20px] h-[39px] w-[257px] cursor-pointer'
								onClick={() => handlyApproved(master.id)}
							>
								Принять заявку
							</button>
							<button
								className='rounded-[10px] bg-[#8B8181] text-white text-[20px] h-[39px] w-[257px] cursor-pointer'
								onClick={() => handlyReject(master.id)}
							>
								Отклонить заявку
							</button>
						</div>
					</div>
				</section>
			) : (
				<section
					className={`fixed w-full h-full top-0 left-0 bg-[#00000099] ${
						!modal && 'hidden'
					} justify-center items-center flex`}
				>
					<div className='w-[610px] h-[657px] bg-[#D9D9D9] rounded-[20px] p-10 relative'>
						<Image
							src={SVGClose}
							alt='...'
							className='absolute top-3 right-3 cursor-pointer'
							onClick={() => {
								setModal(false)
								setMaster(undefined)
							}}
						/>
					</div>
				</section>
			)}
		</>
	)
}

export default MastersNow
