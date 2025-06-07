'use client'

import SVGArrowBlack from '@/assets/images/arrow_black.svg'
import Image from 'next/image'
import { Dispatch, SetStateAction, useState } from 'react'

interface ISelect {
	name: string
	list: string[]
	isActive: string
	setIsActive: Dispatch<SetStateAction<string>>
	click: (name: string, type: string) => void
}

const FilterSelect = ({
	name,
	list,
	isActive,
	click,
	setIsActive,
}: ISelect) => {
	const [activeName, setActiveName] = useState<string>(name)

	const handleClick = (value: string) => {
		setActiveName(value)
		setIsActive('')
		click(activeName, 'sity')
	}

	return (
		<div className='relative cursor-pointer'>
			<div
				className='h-8 w-[150px] border-1 border-[#9E9E9E] px-4 flex justify-between gap-3 rounded-[20px] items-center'
				onClick={() => setIsActive(isActive === name ? '' : name)}
			>
				<h2 className='font-medium text-[15px] leading-0'>
					{name !== activeName && activeName.length >= 8
						? activeName.slice(0, 8) + '...'
						: activeName}
				</h2>
				<Image
					src={SVGArrowBlack}
					alt='...'
					className={`${isActive === name && 'rotate-180'}`}
				/>
			</div>
			<div
				className={`px-5 w-[200px] ${
					isActive !== name && 'hidden'
				} absolute top-10 border-1 border-[#9E9E9E] rounded-[20px] py-3 flex flex-col items-start gap-1 z-10 bg-white`}
			>
				{list.map(value => (
					<h2
						key={value}
						className='font-medium text-[15px]'
						onClick={() => handleClick(value)}
					>
						{value}
					</h2>
				))}
			</div>
		</div>
	)
}

export default FilterSelect
