'use client'

import SVGArrow from '@/assets/images/arrow_black.svg'
import NavBar from '@/components/NavBar/NavBar'
import Table, { IList } from '@/components/Table/Table'
import { useGetSitiesQuery } from '@/lib/redux/api/Sities/SitiesApi'
import { useDeleteUsersMutation, useGetUsersQuery } from '@/lib/redux/api/Users/UsersApi'
import { useAccessToken } from '@/lib/store/store'
import { myToast } from '@/ui/toast'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface IData {
	sity?: string
	category?: string
	status?: string
}

const Users = () => {
	const { accessToken } = useAccessToken()
	const { data: getSities } = useGetSitiesQuery()
	const { data: getUsers } = useGetUsersQuery(accessToken!)
	const [deleteUsers] = useDeleteUsersMutation()

	const [users, setUsers] = useState<IList>({
		header: [
			{ name: 'ID' },
			{ name: 'Город', filter: true },
			{ name: 'ФИО клиента', filter: true },
			{ name: 'Телефон'},
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
		})
		if (updateList === undefined) {
			updateList = []
		}
		setFilterUsers({ header: users.header, list: updateList as string[][] })
	}

	const handleClear = () => {
		setFilterUsers(users)
		setActiveCity('Город')
	}

	const deleteUserFunc = async (id: string) => {
		try {
			await deleteUsers({ id, token: accessToken! })
			myToast({ message: 'Пользователь удалён!', type: 'success' })
			setTimeout(() => {
				window.location.reload()
			}, 2000)
		} catch (e) {
			myToast({ message: 'Ошибка удаления', type: 'error' })
		}
	}

	const handleClick = (id: string) => {
		setModal(true)
	}

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
				<Link
					className='w-auto h-8 text-white bg-[#9E9E9E] rounded-[20px] text-[15px] cursor-pointer flex items-center justify-center px-3'
					href='#'
				>
					Новые заявки
				</Link>
			</section>
			<Table list={filterUsers} deleteFunc={deleteUserFunc} onClick={handleClick} />
			<section className='fixed w-full h-full top-0 left-0 bg-[#00000099]'>

			</section>
		</>
	)
}

export default Users
