'use client'

import SVGArrow from '@/assets/images/arrow_black.svg'
import NavBar from '@/components/NavBar/NavBar'
import Table, { IList } from '@/components/Table/Table'
import { useGetSitiesQuery } from '@/lib/redux/api/Sities/SitiesApi'
import { IUser } from '@/lib/redux/api/Users/types'
import {
	useDeleteUsersMutation,
	useGetUsersQuery,
	useLazyGetUserQuery,
} from '@/lib/redux/api/Users/UsersApi'
import { useAccessToken } from '@/lib/store/store'
import { myToast } from '@/ui/toast'
import SVGClose from '@/assets/images/close2.svg'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

const Users = () => {
	const { accessToken } = useAccessToken()
	const { data: getSities } = useGetSitiesQuery()
	const { data: getUsers } = useGetUsersQuery(accessToken!)
	const [deleteUsers] = useDeleteUsersMutation()
	const [getUsersLazy, {data: usersLazy}] = useLazyGetUserQuery()

	const [users, setUsers] = useState<IList>({
		header: [
			{ name: 'ID' },
			{ name: 'Город', filter: true },
			{ name: 'ФИО клиента', filter: true },
			{ name: 'Телефон' },
			{ name: 'Оформлено заявок', filter: true },
			{ name: 'Действия' },
		],
		list: [],
	})
	const [cities, setCities] = useState<string[]>([])
	const [activeCity, setActiveCity] = useState<string>('Город')
	const [select, setSelect] = useState<boolean>(false)
	const [filterUsers, setFilterUsers] = useState<IList>(users)
	const [modal, setModal] = useState<boolean>(false)
	const [user, setUser] = useState<IUser | undefined>()
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (getSities) {
			const arr = getSities.map(value => value.name)
			setCities(arr)
		}
	}, [getSities])

	useEffect(() => {
		if (getUsers) {
			let newArr: string[][] = []
			getUsers.content.map(user => {
				const id = `${user.id.slice(0, 3)}-${user.id.slice(
					user.id.length - 3,
					user.id.length
				)}`
				const userName = `${user.firstName} ${user.lastName}`

				let arr = []
				arr.push(id)
				arr.push(user.cityDto.name)
				arr.push(userName)
				arr.push(user.phoneNumber)
				arr.push(user.countCreatedOrders.toString())
				arr.push(user.id)
				newArr.push(arr)
			})
			setUsers({ header: users.header, list: newArr })
			setFilterUsers({ header: users.header, list: newArr })
		}
	}, [getUsers])

	const handleApply = () => {
		if (activeCity == 'Город') return
		let list: string[][] = users.list
		let updateList = list.map(value => {
			if (value[1] == activeCity) return value
			return
		})
		setFilterUsers({ header: users.header, list: updateList as string[][] })
	}

	const handleClear = () => {
		setFilterUsers(users)
		setActiveCity('Город')
	}

	const deleteUserFunc = async (id: string) => {
		try {
			const response = await deleteUsers({ id, token: accessToken! })
			if (response.error) {
				myToast({ message: 'Ошибка при удалении!', type: 'error' })
				return
			}
			myToast({ message: 'Пользователь удалён!', type: 'success' })
			setTimeout(() => {
				window.location.reload()
			}, 2000)
		} catch (e) {
			myToast({ message: 'Ошибка при удалении', type: 'error' })
		}
	}

	const handleClick = useCallback(
		async (id: string) => {
			try {
				// 1. Начало операции - сбрасываем состояния
				setIsLoading(true)
				setUser(undefined)

				// 2. Синхронные обновления
				setModal(true)
				console.log('Modal state set to true')

				// 3. Асинхронная операция
				await getUsersLazy({id, token: accessToken!}).unwrap()

				// 4. После получения данных
				if (usersLazy) {
					setUser(usersLazy)
				}
			} catch (error) {
				console.error('Error fetching order:', error)
			} finally {
				// 5. Финализация
				setIsLoading(false)
			}
		},
		[accessToken, getUsersLazy]
	)

	useEffect(() => {
			if (usersLazy) {
				setUser(usersLazy)
			}
		}, [usersLazy])

	return (
		<>
			<NavBar active='users' />
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
			</section>
			<Table
				list={filterUsers}
				deleteFunc={deleteUserFunc}
				onClick={handleClick}
			/>
			{user && !isLoading ? (
				<section
					className={`fixed w-full h-full top-0 left-0 bg-[#00000099] ${
						!modal && 'hidden'
					} flex justify-center items-center`}
				>
					<div className='w-[533px] h-[327px] bg-[#D9D9D9] rounded-[20px] p-10 relative'>
						<Image
							src={SVGClose}
							alt='...'
							className='absolute top-3 right-3 cursor-pointer'
							onClick={() => {
								setModal(false)
							}}
						/>
						<h2 className='font-bold text-[20px] mb-8'>
							ID {user.id.slice(0, 3) +
										'-' +
										user.id.slice(user.id.length - 3, user.id.length)}
						</h2>
						<div className='flex items-start justify-between mb-5'>
							<div>
								<p>Город: {user.cityDto.name}</p>
								<p>Телефон: {user.phoneNumber}</p>
							</div>
							<div>
								<h2 className='font-semibold'>Оформлено заявок:</h2>
								<p>{user.countCreatedOrders}</p>
							</div>
						</div>
						<div className='flex items-start justify-between mb-10'>
							<div>
								<p>Имя: {user.firstName}</p>
								<p>Фамилия: {user.lastName}</p>
							</div>
							<div>
								<h2 className='font-semibold'>Отмененных заявок:</h2>
								<p>{user.countCanceledOrders}</p>
							</div>
						</div>
						<button className='w-full h-[39px] rounded-[20px] bg-[#8B8181] cursor-pointer' onClick={() => deleteUserFunc(user.id)}>Заблокировать и удалить аккаунт</button>
					</div>
				</section> 
			)
				: (
					<section
					className={`fixed w-full h-full top-0 left-0 bg-[#00000099] ${
						!modal && 'hidden'
					} justify-center items-center flex`}
				>
					<div className='w-[533px] h-[327px] bg-[#D9D9D9] rounded-[20px] p-10 relative'>
						<Image
							src={SVGClose}
							alt='...'
							className='absolute top-3 right-3 cursor-pointer'
							onClick={() => {
								setModal(false)
							}}
						/>
					</div>
				</section>
				)
			}
		</>
	)
}

export default Users
