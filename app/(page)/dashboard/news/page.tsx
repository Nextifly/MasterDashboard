'use client'

import NavBar from '@/components/NavBar/NavBar'
import Table, { IList } from '@/components/Table/Table'
import SVGArrow from '@/assets/images/arrow_black.svg'
import {
	useDeleteNewsMutation,
	useGetNewsQuery,
	useHiddenNewsMutation,
	useVisibleNewsMutation,
} from '@/lib/redux/api/News/NewsApi'
import { useGetSitiesQuery } from '@/lib/redux/api/Sities/SitiesApi'
import { useAccessToken } from '@/lib/store/store'
import { myToast } from '@/ui/toast'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface IData {
	sity?: string
	category?: string
	status?: string
}

const News = () => {
	const { data: getSities } = useGetSitiesQuery()
	const { data: getNews } = useGetNewsQuery()
	const [deleteNews] = useDeleteNewsMutation()
	const [hiddenNews] = useHiddenNewsMutation()
	const [visibleNews] = useVisibleNewsMutation()
	const { accessToken } = useAccessToken()

	const [cities, setCities] = useState<string[]>([])
	const [activeCity, setActiveCity] = useState<string>('Город')
	const [select, setSelect] = useState<boolean>(false)
	const [news, setNews] = useState<IList>({
		header: [
			{ name: '№' },
			{ name: 'Город', filter: true },
			{ name: 'Дата публикации', filter: true },
			{ name: 'Заголовок', filter: true },
			{ name: 'Действия' },
		],
		list: [],
	})
	const [filterNews, setFilterNews] = useState<IList>(news)

	const handleApply = () => {
		if (activeCity == 'Город') return
		let list: string[][] = news.list
		let updateList = list.map(value => {
			if (value[1] == activeCity) return value
			return
		})
		setFilterNews({ header: news.header, list: updateList as string[][] })
	}

	const handleClear = () => {
		setFilterNews(news)
		setActiveCity('Город')
	}

	useEffect(() => {
		if (getSities) {
			const arr = getSities.map(value => value.name)
			setCities(arr)
		}
	}, [getSities])

	useEffect(() => {
		if (getNews) {
			const updatedNews: string[][] = []
			getNews.map((value, index) => {
				const date = new Date(value.createdAt)
				const day = String(date.getDate()).padStart(2, '0')
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const year = date.getFullYear()
				const createData = `${day}.${month}.${year}`

				const arr = []
				arr.push(`${index + 1}`)
				arr.push(value.cityDto.name)
				arr.push(createData)
				arr.push(value.title)
				arr.push(value.id)
				updatedNews.push(arr)
			})
			setNews({ header: news.header, list: updatedNews })
			setFilterNews({ header: news.header, list: updatedNews })
		}
	}, [getNews])

	const deleteNewsFunc = async (id: string) => {
		try {
			const response = await deleteNews({ id, token: accessToken! })
			if (response.error) {
				myToast({ message: 'Ошибка при удалении!', type: 'error' })
				return
			}
			myToast({ message: 'Успешно удалено!', type: 'success' })
			setTimeout(() => {
				window.location.reload()
			}, 2000)
		} catch (e) {
			myToast({ message: 'Ошибка удаления', type: 'error' })
		}
	}

	return (
		<section>
			<NavBar active='news' />
			<section className='flex justify-between px-30 my-6'>
				<div className='flex justify-start gap-4 items-center'>
					<h2 className='font-medium text-[20px]'>Фильтр:</h2>
					<div className='relative'>
						<div className='w-[175px] px-3 h-8 flex justify-between items-center gap-3 bg-white border-1 border-[#9E9E9E] rounded-[20px] cursor-pointer' onClick={() => setSelect(!select)}>
						<h2>{activeCity}</h2>
						<Image src={SVGArrow} alt='' className={`${select && 'rotate-180'}`} />
					</div>
					<div className={`absolute w-full h-auto px-5 py-3 top-10 left-0 bg-white z-10 border-1 border-[#9E9E9E] rounded-[20px] ${!select && 'hidden'} w-[250px]`}>
						{
							cities.map((city) => (
								<h2 className='cursor-pointer' key={city} onClick={() => {
									setSelect(false)
									setActiveCity(city)
								}}>{city}</h2>
							))
						}
					</div>
					</div>
					<button onClick={handleApply} className='w-[109px] h-8 text-white bg-[#9E9E9E] rounded-[20px] text-[15px] cursor-pointer'>Применить</button>
					<button onClick={handleClear} className='w-[109px] h-8 text-white bg-[#9E9E9E] rounded-[20px] text-[15px] cursor-pointer'>Очистить</button>
				</div>
				<Link className='w-auto h-8 text-white bg-[#9E9E9E] rounded-[20px] text-[15px] cursor-pointer flex items-center justify-center px-3' href="/dashboard/news/add">Добавить новости</Link>
			</section>
			<Table
				list={filterNews}
				deleteFunc={deleteNewsFunc}
			/>
		</section>
	)
}

export default News
