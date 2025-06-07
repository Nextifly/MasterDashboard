import FilterSelect from '@/ui/select/FilterSelect'
import Link from 'next/link'
import { useState } from 'react'

interface IFilter {
	names: string[]
	sities?: string[]
	categories?: string[]
	status?: string[]
	doubleButtonName?: string;
	doubleButtonLink?: string;
	onClear: () => void
	onApply: (data: IData) => void
}

interface IData {
	sity?: string
	category?: string
	status?: string
}

const FilterAll = ({
	names,
	sities,
	categories,
	status,
	onApply,
	onClear,
	doubleButtonLink, doubleButtonName
}: IFilter) => {
	const [isActive, setIsActive] = useState<string>('')
	const [data, setData] = useState<IData>({
		sity: '',
		category: '',
		status: '',
	})

	const handleClick = (name: string, type: string) => {
		type === 'sity' && setData({
			sity: name,
			category: data.category,
			status: data.status
		})
		type === 'category' && setData({
			sity: data.sity,
			category: name,
			status: data.status
		})
		type === 'status' && setData({
			sity: data.sity,
			category: data.category,
			status: name
		})
	}

	return (
		<section className='flex justify-between px-30 my-6'>
			<div className='flex justify-start gap-4'>
			<h2 className='font-medium text-[20px]'>Фильтр:</h2>
			{names.map(value => (
				<FilterSelect
					name={value}
					list={
						value === 'Город'
							? sities!
							: value === 'Категория'
							? categories!
							: status!
					}
					isActive={isActive}
					setIsActive={setIsActive}
					key={value}
					click={handleClick}
				/>
			))}
			<button
				className='w-[109px] h-8 rounded-[20px] bg-[#9E9E9E] flex justify-center items-center leading-0 text-white text-[15px] font-normal cursor-pointer'
				onClick={() => onApply(data)}
			>
				Применить
			</button>
			<button
				className='w-[109px] h-8 rounded-[20px] bg-[#9E9E9E] flex justify-center items-center leading-0 text-white text-[15px] font-normal cursor-pointer'
				onClick={onClear}
			>
				Очистить
			</button>
		</div>
		{
			doubleButtonLink && 
			<Link href={doubleButtonLink} className=' h-8 rounded-[20px] bg-[#9E9E9E] flex justify-center items-center leading-0 text-white text-[15px] font-normal cursor-pointer px-7'>{doubleButtonName}</Link>
		}
		</section>
	)
}

export default FilterAll
