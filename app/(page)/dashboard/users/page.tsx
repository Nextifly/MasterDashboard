'use client'

import NavBar from '@/components/NavBar/NavBar'
import Table, { IList } from '@/components/Table/Table'
import { useGetSitiesQuery } from '@/lib/redux/api/Sities/SitiesApi'
import { useGetUsersQuery } from '@/lib/redux/api/Users/UsersApi'
import { useAccessToken } from '@/lib/store/store'

import { useEffect, useState } from 'react'

interface IData {
	sity?: string
	category?: string
	status?: string
}

const Users = () => {
	const {accessToken} = useAccessToken()
	const { data: getSities } = useGetSitiesQuery()
	const {data: getUsers} = useGetUsersQuery(accessToken!)
	
	const [users, setUsers] = useState<IList>({header: [{name: 'ID'},{name: 'Город', filter: true}, {name: "ФИО клиента", filter: true}, {name: "Телефон", filter: true}, {name: 'Действия'}], list: []})
	const [cities, setCities] = useState<string[]>([])
	
	useEffect(() => {
		if (getSities) {
			const arr = getSities.map(value => value.name)
			setCities(arr)
		}
	}, [getSities])

	useEffect(() => {
		if (getUsers) {
			const updatedUsers: string[][] = []
			getUsers.map((value) => {
				const info = `${value.firstName} ${value.lastName}`

				let arr = []
				arr.push(value.id)
				arr.push(info)
				arr.push(value.phoneNumber)
				arr.push(value.id)
				updatedUsers.push(arr)
			})
			console.log(updatedUsers)
			setUsers({header: users.header, list: updatedUsers})
		}
	}, [getUsers])

	const handleApply = (data: IData) => {}

	const handleClear = () => {}

	const deleteUserFunc = (id: string) => {

	} 

	return (
		<>
			<NavBar active='users' />
			{/* <Table list={users} deleteFunc={deleteUserFunc} /> */}
		</>
	)
}

export default Users
