'use client'

import SVGDelete from '@/assets/images/delete.svg'
import SVGEye from '@/assets/images/eye2.svg'
import SVGFilter from '@/assets/images/filter.svg'
import Image from 'next/image'

export interface IList {
	name: string
	list: string[]
	filter: boolean
}

interface ITable {
	list: IList[]
}

const Table = ({ list }: ITable) => {
	return (
		<table className='w-full'>
			<thead className='bg-[#9e9e9e] w-full text-center h-15'>
				<tr>
					{list.map(value => (
						<td key={value.name}>
							<div className='flex justify-center items-center gap-4'>
								<h2 className='font-medium text-[20px]'>{value.name}</h2>
								<Image
									src={SVGFilter}
									alt='...'
									className={`cursor-pointer ${!value.filter && 'hidden'}`}
								/>
							</div>
						</td>
					))}
					<td>
						<div className='flex justify-center items-center gap-4'>
							<h2 className='font-medium text-[20px]'>Действия</h2>
						</div>
					</td>
				</tr>
			</thead>
			<tbody>
				<tr className='h-15 text-center'>
					{list.map(value =>
						value.list.map(row => (
							<td className='font-medium text-[15px]' key={row}>
								{row}
							</td>
						))
					)}
					<td className='font-medium text-[15px]'>
						<div className='flex justify-around items-center'>
							<Image src={SVGEye} alt='...' className='cursor-pointer' />
							<Image src={SVGDelete} alt='...' className='cursor-pointer' />
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	)
}

export default Table
