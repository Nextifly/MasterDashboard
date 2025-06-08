'use client'

import NavBar from '@/components/NavBar/NavBar'
import FilterAll from '@/components/FilterAll/FilterAll'
import Table from '@/components/Table/Table'
import { useGetSitiesQuery } from '@/lib/redux/api/Sities/SitiesApi'
import { useEffect, useState } from 'react'

interface IData {
	sity?: string
	category?: string
	status?: string
}

const Statements = () => {
	const [cities, setCities] = useState<Array<string>>([])
	const { data: getSities } = useGetSitiesQuery()

	const handleApply = (data: IData) => {}

	const handleClear = () => {}

	useEffect(() => {
		if (getSities) {
			let arr: string[] = []
			getSities.map(value => {
				arr.push(value.name)
			})
			setCities(arr)
		}
	}, [getSities])

	return (
		<>
			<NavBar active='statements' />
			<FilterAll
				names={['Город', 'Категория', 'Статус']}
				sities={cities}
				categories={[
					'Бытовая техника - Ремонт - Стиральные машины',
					'Электрика - Установка - Монтаж розеток',
				]}
				status={[
					'поиск мастера',
					'взята в работу',
					'отложенный ремонт',
					'завершена',
				]}
				onApply={handleApply}
				onClear={handleClear}
			/>
			{/* <Table
				list={[
					{ name: '№', list: ['1'], filter: false },
					{ name: 'Город', list: ['Москва'], filter: true },
					{ name: 'Дата открытия', list: ['01.01.2024'], filter: true },
					{
						name: 'Категория',
						list: ['Бытовая техника - Ремонт - Стиральные машины'],
						filter: true,
					},
					{ name: 'Статус', list: ['поиск мастера'], filter: true },
				]}
			/> */}
		</>
	)
}

export default Statements