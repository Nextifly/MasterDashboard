'use client'

import FilterAll from '@/components/FilterAll/FilterAll'
import NavBar from '@/components/NavBar/NavBar'
import Table, { IList } from '@/components/Table/Table'
import { useGetNewsQuery } from '@/lib/redux/api/News/NewsApi'
import { useGetSitiesQuery } from '@/lib/redux/api/Sities/SitiesApi'
import { useEffect, useState } from 'react'

interface IData {
	sity?: string
	category?: string
	status?: string
}

const News = () => {
	const { data: getSities } = useGetSitiesQuery()
	const { data: getNews } = useGetNewsQuery()
	const [cities, setCities] = useState<string[]>([])
	const [news, setNews] = useState<IList[]>([
		{ name: '№', list: [], filter: false },
		{ name: 'Город', list: [], filter: true },
		{ name: 'Дата публикации', list: [], filter: true },
		{ name: 'Заголовок', list: [], filter: true },
	])

	const handleApply = (data: IData) => {}

	const handleClear = () => {}

	useEffect(() => {
		if (getSities) {
			const arr = getSities.map(value => value.name)
			setCities(arr)
		}
	}, [getSities])

	useEffect(() => {
		if (getNews) {
			console.log(getNews[0].createdAt.toUTCString)
			const updatedNews = [
				{ ...news[0], list: getNews.map((_, index) => `${index + 1}`) },
				{ ...news[1], list: getNews.map(value => value.cityDto?.name || '') },
				{
					...news[2],
					list: getNews.map(value => {
						const date = new Date(value.createdAt)
						const day = String(date.getDate()).padStart(2, '0')
						const month = String(date.getMonth() + 1).padStart(2, '0')
						const year = date.getFullYear()
						return `${day}.${month}.${year}`
					}),
				},
				{ ...news[3], list: getNews.map(value => value.title) },
			]
			setNews(updatedNews)
		}
	}, [getNews])

	return (
		<section>
			<NavBar active='news' />
			<FilterAll
				names={['Город']}
				sities={cities}
				onApply={handleApply}
				onClear={handleClear}
				doubleButtonName='Добавить новость'
				doubleButtonLink='news/add'
			/>
			<Table list={news} />
		</section>
	)
}

export default News
