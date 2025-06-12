'use client'

import SVGArrow from '@/assets/images/arrow_black.svg'
import SVGClose from '@/assets/images/close2.svg'
import NavBar from '@/components/NavBar/NavBar'
import Table, { IList } from '@/components/Table/Table'
import {
	useDeleteMasterMutation,
	useGetMastersApprovedQuery,
	useLazyGetMasterApprovedQuery,
} from '@/lib/redux/api/Masters/MastersApi'
import {
	IEducation,
	IMarital,
	IMasterRequest,
} from '@/lib/redux/api/Masters/types'
import { useGetSitiesQuery } from '@/lib/redux/api/Sities/SitiesApi'
import { useAccessToken } from '@/lib/store/store'
import { myToast } from '@/ui/toast'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

const Masters = () => {
	const { accessToken } = useAccessToken()
	const { data: getSities } = useGetSitiesQuery()
	const { data: getMasters } = useGetMastersApprovedQuery(accessToken!)
	const [getMaster, { data: masterData }] = useLazyGetMasterApprovedQuery()
	const [deleteMaster] = useDeleteMasterMutation()
	const [masters, setMasters] = useState<IList>({
		header: [
			{ name: 'ID' },
			{ name: 'Город', filter: true },
			{ name: 'ФИО клиента', filter: true },
			{ name: 'Телефон' },
			{ name: 'Сдано заявок', filter: true },
			{ name: 'Действия' },
		],
		list: [],
	})
	const [cities, setCities] = useState<string[]>([])
	const [activeCity, setActiveCity] = useState<string>('Город')
	const [select, setSelect] = useState<boolean>(false)
	const [filterMasters, setFilterMasters] = useState<IList>(masters)
	const [modal, setModal] = useState<boolean>(false)
	const [master, setMaster] = useState<IMasterRequest | undefined>()
	const [isLoading, setIsLoading] = useState<boolean>(false)
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
		if (getSities) {
			const arr = getSities.map(value => value.name)
			setCities(arr)
		}
	}, [getSities])

	useEffect(() => {
		if (getMasters) {
			let newArr: string[][] = []
			getMasters.content.map(master => {
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
				arr.push(master.totalCompletedOrders.toString())
				arr.push(master.id)
				newArr.push(arr)
			})
			setMasters({ header: masters.header, list: newArr })
			setFilterMasters({ header: masters.header, list: newArr })
		}
	}, [getMasters])

	const handleApply = () => {
		if (activeCity == 'Город') return
		let list: string[][] = masters.list
		let updateList = list.map(value => {
			if (value[1] == activeCity) return value
			return
		})
		setFilterMasters({ header: masters.header, list: updateList as string[][] })
	}

	const handleClear = () => {
		setFilterMasters(masters)
		setActiveCity('Город')
	}

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
				await getMaster({ id, token: accessToken! }).then((masterData: any) => {
					setMaster(masterData)
				}).catch((e: any) => {
					console.error(e)
				})
				const photoProfileFetch = await fetch(
					`https://109.73.198.81:9093/api/master-profiles/${id}/photo-profile`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				)
				const photoPassportMainFetch = await fetch(
					`https://109.73.198.81:9093/api/master-profiles/${id}/photo-passport-main`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				)
				const photoPassportRegisterFetch = await fetch(
					`https://109.73.198.81:9093/api/master-profiles/${id}/photo-passport-register`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				)
				const photoSnilsFetch = await fetch(
					`https://109.73.198.81:9093/api/master-profiles/${id}/photo-snils`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				)
				const photoInnFetch = await fetch(
					`https://109.73.198.81:9093/api/master-profiles/${id}/photo-inn`,
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
				if (masterData) {
					setMaster(masterData)
				}

				setPhotoProfileData(URL.createObjectURL(blobProfile))
				setPhotoPassportMainData(URL.createObjectURL(blobPassportMain))
				setPhotoPassportRegisterData(URL.createObjectURL(blobPassportRegister))
				setPhotoInnData(URL.createObjectURL(blobInn))
				setPhotoSnilsData(URL.createObjectURL(blobSnils))
			} catch (error) {
				console.error('Error fetching order:', error)
			} finally {
				// 5. Финализация
				setIsLoading(false)
			}
		},
		[accessToken, masterData]
	)
	
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

	const deleteMasterFunc = async (id: string) => {
		console.log(id)
		try {
			const response = await deleteMaster({ id, token: accessToken! })
			if (response.error) {
				myToast({ message: 'Ошибка при удалении!', type: 'error' })
				return
			}
			myToast({ message: 'Пользователь удалён!', type: 'success' })
			setTimeout(() => {
				window.location.reload()
			}, 2000)
		} catch (e) {
			myToast({ message: 'Ошибка при удалении!', type: 'error' })
		}
	}

	return (
		<>
			<NavBar active='masters' />
			<section className='flex justify-between px-30 my-6'>
				<div className='flex justify-start gap-4 items-center'>
					<h2 className='font-medium text-[20px]'>Фильтр:</h2>
					<div className='relative'>
						<div
							className='w-[175px] px-3 h-8 flex justify-between items-center gap-3 bg-white border-1 border-[#9E9E9E] rounded-[20px] cursor-pointer'
							onClick={() => setSelect(!select)}
						>
							<h2>{activeCity}</h2>
							<Image
								src={SVGArrow}
								alt=''
								className={`${select && 'rotate-180'}`}
							/>
						</div>
						<div
							className={`absolute w-full h-auto px-5 py-3 top-10 left-0 bg-white z-10 border-1 border-[#9E9E9E] rounded-[20px] ${
								!select && 'hidden'
							} w-[250px]`}
						>
							{cities.map(city => (
								<h2
									className='cursor-pointer'
									key={city}
									onClick={() => {
										setSelect(false)
										setActiveCity(city)
									}}
								>
									{city}
								</h2>
							))}
						</div>
					</div>
					<button
						onClick={handleApply}
						className='w-[109px] h-8 text-white bg-[#9E9E9E] rounded-[20px] text-[15px] cursor-pointer'
					>
						Применить
					</button>
					<button
						onClick={handleClear}
						className='w-[109px] h-8 text-white bg-[#9E9E9E] rounded-[20px] text-[15px] cursor-pointer'
					>
						Очистить
					</button>
				</div>
				<Link
					className='w-auto h-8 text-white bg-[#9E9E9E] rounded-[20px] text-[15px] cursor-pointer flex items-center justify-center px-3'
					href='/dashboard/masters/now'
				>
					Новые заявки
				</Link>
			</section>
			<Table
				list={filterMasters}
				onClick={handleClick}
				deleteFunc={deleteMasterFunc}
			/>
			{master !== undefined && !isLoading ? (
				<section
					className={`fixed w-full h-full top-0 left-0 bg-[#00000099] ${
						!modal && 'hidden'
					} flex justify-center items-center`}
				>
					<div className='w-auto h-auto bg-[#D9D9D9] rounded-[20px] p-10 relative max-h-[600px] overflow-auto'>
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
						<div className='flex justify-between items-center'>
							<div>
								<h2 className='font-bold text-[20px]'>Выполнено заявок:</h2>
								<ul>
									<li className='list-disc ml-8 font-bold text-[20px]'>
										Месяц: {master.completedOrdersThisMonth || '0'}
									</li>
									<li className='list-disc ml-8 font-bold text-[20px]'>
										Весь период: {master.totalCompletedOrders || '0'}
									</li>
								</ul>
							</div>
							<button
								className='rounded-[10px] bg-[#8B8181] text-white text-[20px] h-[39px] w-[257px] cursor-pointer'
								onClick={() => deleteMasterFunc(master.id)}
							>
								Удалить профиль
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

export default Masters
