'use client'

import FilterAll from '@/components/FilterAll/FilterAll'
import NavBar from '@/components/NavBar/NavBar'
import Table, { IList } from '@/components/Table/Table'
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

	const handleApply = (data: IData) => {
		if (!data.sity) return
		let list: string[][] = news.list
		let updateList = list.map(value => {
			if (value.includes(data.sity!)) return
			return value
		})
		if (updateList === undefined) {updateList = []}
		setFilterNews({header: news.header, list: updateList as string[][]})
	}

	const handleClear = () => {
		setFilterNews(news)
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
				arr.push(value.visible.toString())
				arr.push(`${index + 1}`)
				arr.push(value.cityDto.name)
				arr.push(createData)
				arr.push(value.title)
				arr.push(value.id)
				updatedNews.push(arr)
			})
			console.log(updatedNews)
			setNews({ header: news.header, list: updatedNews })
			setFilterNews({ header: news.header, list: updatedNews })
		}
	}, [getNews])

	const deleteNewsFunc = async (id: string) => {
		try {
			await deleteNews({ id, token: accessToken! })
			myToast({ message: 'Успешно удалено!', type: 'success' })
			setTimeout(() => {
				window.location.reload()
			}, 2000)
		} catch (e) {
			myToast({ message: 'Ошибка удаления', type: 'error' })
		}
	}

	const handleHidden = async (id: string, visible: string) => {
		if (visible === 'true') {
			try {
				await hiddenNews({ id, token: accessToken! })
				myToast({ message: 'Успешно!', type: 'success' })
				setTimeout(() => {
					window.location.reload()
				}, 2000)
			} catch (e) {
				myToast({ message: 'Ошибка!', type: 'error' })
			}
		} else {
			try {
				await visibleNews({ id, token: accessToken! })
				myToast({ message: 'Успешно!', type: 'success' })
				setTimeout(() => {
					window.location.reload()
				}, 2000)
			} catch (e) {
				myToast({ message: 'Ошибка!', type: 'error' })
			}
		}
	}

	return (
		<section>
			<NavBar active='news' />
			<FilterAll
				names={['Город']}
				sities={cities}
				onApply={handleApply}
				onClear={handleClear}
				doubleButtonName='Добавить новость'
				doubleButtonLink='/dashboard/news/add'
			/>
			<Table onHidden={handleHidden} list={filterNews} deleteFunc={deleteNewsFunc} />
		</section>
	)
}

export default News
