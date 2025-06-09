'use client'

import SVGArrow from '@/assets/images/arrow_black.svg'
import SVGClose from '@/assets/images/close2.svg'
import SVGStar from '@/assets/images/rating.svg'
import NavBar from '@/components/NavBar/NavBar'
import Table, { IList } from '@/components/Table/Table'
import { useGetSitiesQuery } from '@/lib/redux/api/Sities/SitiesApi'
import { useAccessToken } from '@/lib/store/store'

import { useGetCategoriesQuery } from '@/lib/redux/api/Categories/CategoriesApi'
import {
	useGetOrdersQuery,
	useLazyGetOrderQuery,
} from '@/lib/redux/api/Orders/OrdersApi'
import { IOrderRequest } from '@/lib/redux/api/Orders/types'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const Statements = () => {
	const { accessToken } = useAccessToken()
	const { data: getSities } = useGetSitiesQuery()
	const [cities, setCities] = useState<Array<string>>([])
	const [categories, setCategories] = useState<Array<string>>([])
	const { data: getCategories } = useGetCategoriesQuery(accessToken!)
	const { data: getOrders } = useGetOrdersQuery(accessToken!)

	const [activeCity, setActiveCity] = useState<string>('Город')
	const [activeCategory, setActiveCategory] = useState<string>('Категория')
	const [activeStatus, setActiveStatus] = useState<string>('Статус')
	const [select, setSelect] = useState<string>('')
	const [modal, setModal] = useState<boolean>(false)
	const [orders, setOrders] = useState<IList>({
		header: [
			{ name: '№' },
			{ name: 'Город', filter: true },
			{ name: 'Дата открытия', filter: true },
			{ name: 'Категория', filter: true },
			{ name: 'Статус', filter: true },
			{ name: 'Действия' },
		],
		list: [],
	})
	const [filterOrders, setFilterOrders] = useState<IList>(orders)
	const [getOrder, { data: orderData }] = useLazyGetOrderQuery()
	const [order, setOrder] = useState<IOrderRequest | undefined>()

	const handleApply = () => {
		// Начинаем с исходного списка
		let filteredList: string[][] = orders.list

		// Последовательно применяем фильтры
		if (activeCity !== 'Город') {
			filteredList = filteredList.filter(value => value[1] === activeCity)
		}

		// Должно быть activeCategory для категории (исправлено)
		if (activeCategory !== 'Категория') {
			// Замените activeStatus на activeCategory
			filteredList = filteredList.filter(value => value[3] === activeCategory)
		}

		if (activeStatus !== 'Статус') {
			filteredList = filteredList.filter(value => value[4] === activeStatus)
		}
		// Убираем лишние проверки - filter всегда возвращает массив
		setFilterOrders({
			header: orders.header,
			list: filteredList.length > 0 ? filteredList : [[]],
		})
	}

	const handleClear = () => {
		setFilterOrders(orders)
		setActiveCity('Город')
		setActiveCategory('Категория')
		setActiveStatus('Статус')
	}

	useEffect(() => {
		if (getSities) {
			let arr: string[] = []
			getSities.map(value => {
				arr.push(value.name)
			})
			setCities(arr)
		}
	}, [getSities])

	useEffect(() => {
		if (getCategories) {
			let arr: string[] = []
			getCategories.map(service => {
				service.subserviceDtos.map(subservice => {
					arr.push(`${service.name} - ${subservice.name}`)
				})
			})
			setCategories(arr)
		}
	}, [getCategories])

	useEffect(() => {
		if (getOrders) {
			let newArr: string[][] = []
			getOrders.content.map((order, index) => {
				const date = new Date(order.createdAt)
				const day = String(date.getDate()).padStart(2, '0')
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const year = date.getFullYear()
				const createData = `${day}.${month}.${year}`

				let status =
					order.status === 'COMPLETED'
						? 'Завершена'
						: order.status === 'CANCELLED'
						? 'Отменена'
						: order.status === 'TAKEN_IN_WORK'
						? 'Взята на работу'
						: order.status === 'DEFERRED_REPAIR'
						? 'Отложенный ремонт'
						: 'Поиск мастера'

				let arr = []
				arr.push((index + 1).toString())
				arr.push(order.cityDto.name)
				arr.push(createData)
				arr.push(
					`${order.serviceCategoryDto.name} - ${order.serviceCategoryDto.subserviceDto.name}`
				)
				arr.push(status)
				arr.push(order.id)
				newArr.push(arr)
			})
			setFilterOrders({ header: orders.header, list: newArr })
			setOrders({ header: orders.header, list: newArr })
		}
	}, [getOrders])

	const deleteFunc = (id: string) => {}

	const handleClick = async (id: string) => {
		setModal(true)
		await getOrder({ id, token: accessToken! })
		setOrder(orderData)
	}

	function formatDateTime(isoString: Date) {
		const date = new Date(isoString)

		const day = String(date.getUTCDate()).padStart(2, '0')
		const month = String(date.getUTCMonth() + 1).padStart(2, '0')
		const year = date.getUTCFullYear()
		const hours = String(date.getUTCHours()).padStart(2, '0')
		const minutes = String(date.getUTCMinutes()).padStart(2, '0')

		return `${day}.${month}.${year} ${hours}:${minutes}`
	}

	function updateStatus(status: string) {
		console.log(status)
		return status === 'COMPLETED'
			? 'Завершена'
			: status === 'CANCELLED'
			? 'Отменена'
			: status === 'TAKEN_IN_WORK'
			? 'Взята на работу'
			: status === 'DEFERRED_REPAIR'
			? 'Отложенный ремонт'
			: 'Поиск мастера'
	}

	return (
		<>
			<NavBar active='statements' />
			<section className='flex justify-between px-30 my-6'>
				<div className='flex justify-start gap-4 items-center'>
					<h2 className='font-medium text-[20px]'>Фильтр:</h2>
					<div className='relative'>
						<div
							className='w-[175px] px-3 h-8 flex justify-between items-center gap-3 bg-white border-1 border-[#9E9E9E] rounded-[20px] cursor-pointer'
							onClick={() => setSelect(select === 'sity' ? '' : 'sity')}
						>
							<h2>{activeCity}</h2>
							<Image
								src={SVGArrow}
								alt=''
								className={`${select === 'sity' && 'rotate-180'}`}
							/>
						</div>
						<div
							className={`absolute w-full h-auto px-5 py-3 top-10 left-0 bg-white z-10 border-1 border-[#9E9E9E] rounded-[20px] ${
								select !== 'sity' && 'hidden'
							} w-[250px]`}
						>
							{cities.map(city => (
								<h2
									className='cursor-pointer'
									key={city}
									onClick={() => {
										setSelect('')
										setActiveCity(city)
									}}
								>
									{city}
								</h2>
							))}
						</div>
					</div>
					<div className='relative'>
						<div
							className='w-[175px] px-3 h-8 flex justify-between items-center gap-3 bg-white border-1 border-[#9E9E9E] rounded-[20px] cursor-pointer'
							onClick={() => setSelect(select === 'category' ? '' : 'category')}
						>
							<h2>
								{activeCategory.length > 14
									? activeCategory.slice(0, 14) + '...'
									: activeCategory}
							</h2>
							<Image
								src={SVGArrow}
								alt=''
								className={`${select === 'category' && 'rotate-180'}`}
							/>
						</div>
						<div
							className={`absolute h-auto px-5 py-3 top-10 left-0 bg-white z-10 border-1 border-[#9E9E9E] rounded-[20px] ${
								select !== 'category' && 'hidden'
							} w-[450px]`}
						>
							{categories.map(category => (
								<h2
									className='cursor-pointer'
									key={category}
									onClick={() => {
										setSelect('')
										setActiveCategory(category)
									}}
								>
									{category}
								</h2>
							))}
						</div>
					</div>
					<div className='relative'>
						<div
							className='w-[175px] px-3 h-8 flex justify-between items-center gap-3 bg-white border-1 border-[#9E9E9E] rounded-[20px] cursor-pointer'
							onClick={() => setSelect(select === 'status' ? '' : 'status')}
						>
							<h2>{activeStatus.length >= 12 ? activeStatus.slice(0,10)+'...' : activeStatus}</h2>
							<Image
								src={SVGArrow}
								alt=''
								className={`${select === 'status' && 'rotate-180'}`}
							/>
						</div>
						<div
							className={`absolute h-auto px-5 py-3 top-10 left-0 bg-white z-10 border-1 border-[#9E9E9E] rounded-[20px] ${
								select !== 'status' && 'hidden'
							} w-[300px]`}
						>
							<h2
								className='cursor-pointer'
								onClick={() => {
									setSelect('')
									setActiveStatus('Поиск мастера')
								}}
							>
								Поиск мастера
							</h2>
							<h2
								className='cursor-pointer'
								onClick={() => {
									setSelect('')
									setActiveStatus('Взята на работу')
								}}
							>
								Взята на работу
							</h2>
							<h2
								className='cursor-pointer'
								onClick={() => {
									setSelect('')
									setActiveStatus('Отложенный ремонт')
								}}
							>
								Отложенный ремонт
							</h2>
							<h2
								className='cursor-pointer'
								onClick={() => {
									setSelect('')
									setActiveStatus('Завершена')
								}}
							>
								Завершена
							</h2>
							<h2
								className='cursor-pointer'
								onClick={() => {
									setSelect('')
									setActiveStatus('Отменена')
								}}
							>
								Отменена
							</h2>
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
			</section>
			<Table
				list={filterOrders}
				onClick={handleClick}
				deleteFunc={deleteFunc}
			/>
			{order !== undefined && (
				<section
					className={`fixed w-full h-full top-0 left-0 bg-[#00000099] z-10 flex justify-center items-center ${
						!modal && 'hidden'
					}`}
				>
					<div className='relative w-auto h-auto p-8 bg-[#D9D9D9] rounded-[20px] max-w-[800px]'>
						<Image
							src={SVGClose}
							alt='...'
							className='absolute top-3 right-3 cursor-pointer'
							onClick={() => {
								window.location.reload()
							}}
						/>
						<div className='flex justify-between items-start gap-10'>
							<div>
								<h2 className='font-bold text-[20px] mb-3'>
									№
									{order.id.slice(0, 3) +
										order.id.slice(order.id.length - 3, order.id.length)}
								</h2>
								<p className='text-[20px]'>Город: {order.cityDto.name}</p>
								<p className='text-[20px]'>
									Категория: {order.serviceCategoryDto.subserviceDto.name}
								</p>
								<p className='text-[20px]'>
									Дата и время: {formatDateTime(order.createdAt)}
								</p>
								<p className='text-[20px]'>
									Статус: {updateStatus(order.status)}
								</p>
								{
									order.postponeDto && (
									<p className='text-[20px]'>
										Назначенная дата: {formatDateTime(order.postponeDto.newAppointmentDate)}
									</p>
									)
								}
							</div>
							<div>
								<h2 className='font-bold text-[20px] mb-3'>Данные заказчика</h2>
								<p className='text-[20px]'>
									Адрес: {order.clientInfoDto.address}
								</p>
								<p className='text-[20px]'>
									Телефон: {order.clientInfoDto.phoneNumber}
								</p>
								<p className='text-[20px]'>
									ФИО:{' '}
									{order.clientInfoDto.firstName +
										' ' +
										order.clientInfoDto.lastName}{' '}
								</p>
							</div>
						</div>
						{
							order.postponeDto && (
								<div className='mt-5'>
									<h2 className='text-[20px] font-bold'>Комментарий мастера:</h2>
									<p className='text-[20px] font-normal'>{order.postponeDto.reason}</p>
								</div>
							)
						}
						{order.masterInfoDto && (
							<div className='mt-5'>
								<h2 className='font-bold text-[20px] mb-3'>Данные мастера</h2>
								<div className='flex justify-start gap-10'>
									<div className='size-[105px] border-1 border-[#4D4D4D] rounded-[20px]' />
									<div className='flex flex-col justify-between'>
										<p className='font-medium text-[20px]'>
											{order.masterInfoDto.firstName +
												' ' +
												order.masterInfoDto.lastName}
										</p>
										<div className='flex gap-2'>
											<Image src={SVGStar} alt='...' />
											<p className='font-medium text-[20px]'>
												{order.masterInfoDto.averageRating}
											</p>
										</div>
										<p className='font-medium text-[20px]'>
											Телефон: {order.masterInfoDto.phoneNumber}
										</p>
									</div>
								</div>
							</div>
						)}
						{!order.postponeDto && order.status === 'COMPLETED' ? (
							<div>
								<h2 className='mb-5 font-medium text-[20px] mt-10'>
									Отзыв заказчика
								</h2>
								<hr className='mb-5' />
								<p className='font-medium text-[20px] leading-[20px]'>
									{order.masterFeedbackDto.review}
								</p>
							</div>
						) : (
							<div>
								<h2 className='mb-5 font-medium text-[20px] mt-10'>
									Комментарий заказчика
								</h2>
								<hr className='mb-5' />
								<p className='font-medium text-[20px] leading-[20px]'>
									{order.comment}
								</p>
							</div>
						)}
					</div>
				</section>
			)}
		</>
	)
}

export default Statements
