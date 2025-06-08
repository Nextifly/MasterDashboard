'use client'

import ImageEye from '@/assets/images/close_eye.png'
import SVGDelete from '@/assets/images/delete.svg'
import SVGEye from '@/assets/images/eye2.svg'
import SVGFilter from '@/assets/images/filter.svg'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface IHeader {
	name: string
	filter?: boolean
}

export interface IList {
	header: IHeader[]
	list: string[][]
}

interface ITable {
	list: IList
	deleteFunc: (id: string) => void
	onHidden: (id: string, visible: string) => void
}

const Table = ({ list: initialList, deleteFunc, onHidden }: ITable) => {
	const [sortConfig, setSortConfig] = useState<{
		column: string | null
		direction: 'asc' | 'desc'
	}>({ column: null, direction: 'asc' })
	const [sortedList, setSortedList] = useState<IList>(initialList)

	useEffect(() => {
		if (initialList.list.length !== 0) setSortedList(initialList)
	}, [initialList])

	const handleSort = (columnName: string) => {
		if (sortedList) {
			let direction: 'asc' | 'desc' = 'asc'

			if (sortConfig.column === columnName && sortConfig.direction === 'asc') {
				direction = 'desc'
			}

			setSortConfig({ column: columnName, direction })

			// Находим индекс колонки в header
			const columnIndex = sortedList.header.findIndex(
				h => h.name === columnName
			)
			if (columnIndex === -1) return

			// Создаем копию списка для сортировки
			const newList = [...sortedList.list]

			newList.sort((a, b) => {
				// Для числовых колонок (например, №)
				if (
					columnName === '№' ||
					columnName === 'Телефон' ||
					columnName === 'Оформления заявок' ||
					columnName === 'ID'
				) {
					const numA = parseInt(a[columnIndex])
					const numB = parseInt(b[columnIndex])
					return direction === 'asc' ? numA - numB : numB - numA
				}

				// Для дат
				if (columnName.includes('Дата')) {
					const dateA = new Date(a[columnIndex].split('.').reverse().join('-'))
					const dateB = new Date(b[columnIndex].split('.').reverse().join('-'))
					return direction === 'asc'
						? dateA.getTime() - dateB.getTime()
						: dateB.getTime() - dateA.getTime()
				}

				// Для строк (по умолчанию)
				const valueA = a[columnIndex].toLowerCase()
				const valueB = b[columnIndex].toLowerCase()

				if (valueA < valueB) return direction === 'asc' ? -1 : 1
				if (valueA > valueB) return direction === 'asc' ? 1 : -1
				return 0
			})

			setSortedList(prev => ({
				...prev,
				list: newList,
			}))
		}
	}

	return (
		<section className='relative w-full'>
			<div className='absolute top-0 left-0 bg-[#9e9e9e] w-full h-15 z-[-1]'></div>
			<table className='w-auto mx-30'>
				<thead className='w-full text-center h-15'>
					<tr>
						{sortedList.header.map((header, index) => (
							<td
								key={header.name}
								className={`${index === 0 ? 'pl-0 pr-10' : 'px-10'}`}
							>
								<div className='flex justify-center items-center gap-4'>
									<h2 className='font-medium text-[20px]'>{header.name}</h2>
									{header.filter && (
										<div
											className='flex items-center cursor-pointer'
											onClick={() => handleSort(header.name)}
										>
											<Image src={SVGFilter} alt='Filter' className='mr-1' />
										</div>
									)}
								</div>
							</td>
						))}
					</tr>
				</thead>
				<tbody>
					{sortedList.list[0] !== undefined &&
						sortedList.list.map((row, rowIndex) => (
							<tr className='h-15 text-center' key={rowIndex}>
								{row.map(
									(cell, cellIndex) =>
										cellIndex !== 0 &&
										(cellIndex !== row.length - 1 ? (
											<td
												className={`font-medium text-[15px] ${
													cellIndex === 1 && 'text-start pl-2'
												}`}
												key={`${rowIndex}-${cellIndex}`}
											>
												{cell}
											</td>
										) : (
											<td
												className='font-medium text-[15px]'
												key={`actions-${rowIndex}`}
											>
												<div className='flex justify-around items-center'>
													<Image
														src={row[0] === 'false' ? ImageEye : SVGEye}
														alt='View'
														className='cursor-pointer'
														onClick={() => onHidden(cell, row[0])}
													/>
													<Image
														src={SVGDelete}
														alt='Delete'
														className='cursor-pointer'
														onClick={() => deleteFunc(cell)}
													/>
												</div>
											</td>
										))
								)}
							</tr>
						))}
				</tbody>
			</table>
		</section>
	)
}

export default Table
