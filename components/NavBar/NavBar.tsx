'use client'

import Image from 'next/image'
import Link from 'next/link'

import SVGArray from '@/assets/images/array.svg'
import { useState } from 'react'

const NavBar = ({ active }: { active: string }) => {
	const [menu, setMenu] = useState<boolean>(false)

	return (
		<section className='w-full h-15 bg-[#9e9e9e] flex justify-between px-30 items-center gap-8'>
			<Link
				href='/dashboard/statements'
				className={`flex justify-around items-center gap-3 px-1 pl-3 rounded-[20px] h-[42px] ${
					active === 'statements' && 'bg-white'
				} py-1 cursor-pointer`}
			>
				<h2
					className={`font-normal text-2xl ${
						active !== 'statements' && 'text-white'
					}`}
				>
					Заявки
				</h2>
				<p
					className={`size-[30px] rounded-[30px] flex justify-center items-center ${
						active === 'statements' ? 'bg-[#D9D9D9]' : 'bg-white'
					} font-normal text-[20px] leading-0 pb-1`}
				>
					3
				</p>
			</Link>
			<Link
				href='/dashboard/users'
				className={`px-4 rounded-[20px] ${
					active === 'users' && 'bg-white'
				} py-1 cursor-pointer`}
			>
				<h2
					className={`font-normal text-2xl ${
						active !== 'users' && 'text-white'
					}`}
				>
					Пользователи
				</h2>
			</Link>
			<Link
				href='/dashboard/masters'
				className={`flex justify-around  items-center gap-3 px-4 h-[42px] rounded-[20px] ${
					active === 'masters' && 'bg-white'
				} py-1 cursor-pointer`}
			>
				<h2
					className={`font-normal text-2xl ${
						active !== 'masters' && 'text-white'
					}`}
				>
					Мастера
				</h2>
				<p
					className={`size-[30px] rounded-[30px] flex justify-center items-center text-center ${
						active === 'masters' ? 'bg-[#D9D9D9]' : 'bg-white'
					} font-normal text-[20px] leading-0 pb-1`}
				>
					3
				</p>
			</Link>
			<Link
				href='/dashboard/news'
				className={`px-4 rounded-[20px] text-center ${
					active === 'news' && 'bg-white'
				} py-1 cursor-pointer h-[42px]`}
			>
				<h2
					className={`font-normal text-2xl ${
						active !== 'news' && 'text-white'
					}`}
				>
					Новости
				</h2>
			</Link>
			<div className='relative w-auto'>
				<div
					className='flex justify-center items-center gap-3 cursor-pointer px-5'
					onClick={() => setMenu(!menu)}
				>
					<h2 className='font-normal text-2xl text-white'>Настойки</h2>
					<Image src={SVGArray} alt='...' className={`${menu && 'rotate-180'}`} />
				</div>
				<div
					className={`absolute top-[46px] flex flex-col items-end w-full ${
						!menu && 'hidden'
					} bg-white h-auto border-r-1 border-l-1 border-b-1 border-[#9e9e9e] rounded-b-[20px]`}
				>
					<Link
						href='#'
						className='text-black font-normal text-[20px] mb-2 pr-5'
					>
						Города
					</Link>
					<Link
						href='#'
						className='text-black font-normal text-[20px] mb-2 pr-5'
					>
						Категории
					</Link>
				</div>
			</div>
			<Link
				href='/dashboard/static'
				className={`px-4 rounded-[20px] text-center ${
					active === 'static' && 'bg-white'
				} py-1 cursor-pointer h-[42px]`}
			>
				<h2
					className={`font-normal text-2xl ${
						active !== 'static' && 'text-white'
					}`}
				>
					Статистика
				</h2>
			</Link>
		</section>
	)
}

export default NavBar
