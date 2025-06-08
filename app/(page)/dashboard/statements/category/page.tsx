'use client'

import SVGArrow from '@/assets/images/arrow_black.svg'
import NavBar from '@/components/NavBar/NavBar'
import { IList } from '@/components/Table/Table'
import TableCategory from '@/components/Table/TableCategory'
import {
	useCreateSubCategoriesMutation,
	useGetCategoriesQuery,
	useHiddenCategoryMutation,
	useVisibleCategoryMutation,
} from '@/lib/redux/api/Categories/CategoriesApi'
import { useAccessToken } from '@/lib/store/store'
import { myToast } from '@/ui/toast'
import SVGClose from '@/assets/images/close.svg'

import Image from 'next/image'
import { useEffect, useState } from 'react'

interface IService {
	id: string
	name: string
}

const StatementsCategory = () => {
	const { accessToken } = useAccessToken()
	const { data: getCategories } = useGetCategoriesQuery(accessToken!)
	const [createSubCategory] = useCreateSubCategoriesMutation()
	const [hiddenCategory] = useHiddenCategoryMutation()
	const [visibleCategory] = useVisibleCategoryMutation()

	const [menu, setMenu] = useState<boolean>(false)
	const [serviceId, setServiceId] = useState<string>('')
	const [name, setName] = useState<string>('')
	const [serviceName, setServiceName] = useState<string>('')
	const [service, setService] = useState<IService[]>([])
	const [select, setSelect] = useState<boolean>(false)
	const [initialList, setInitialList] = useState<IList>({
		header: [
			{ name: 'Наименование', filter: true },
			{ name: 'Родительская категория', filter: true },
			{ name: 'Действия' },
		],
		list: [],
	})

	useEffect(() => {
		if (getCategories) {
			let newList: string[][] = []
			getCategories.map(category => {
				category.subserviceDtos.map(subcategory => {
					let arr = []
					arr.push(subcategory.name)
					arr.push(category.name)
					arr.push(subcategory.id)
					arr.push((subcategory.visible).toString())
					arr.push(category.id)
					newList.push(arr)
				})
			})
			setInitialList({ header: initialList.header, list: newList })
		}
	}, [getCategories])

	useEffect(() => {
		if (getCategories) {
			let newArr: IService[] = []
			getCategories.map(category => {
				newArr.push({ name: category.name, id: category.id })
			})
			setService(newArr)
		}
	}, [getCategories])

	const handleHidden = async (id: string, visible: string, serviceId: string) => {
		if (visible === 'true') {
			try {
				const response = await hiddenCategory({id, token: accessToken!, serviceId})
				if (response?.error) {
					return myToast({message: 'Ошибка!', type: 'error'})
				}
				myToast({message: 'Успешно!', type: 'success'})
				setTimeout(() => {
					window.location.reload()
				}, 2000)
			} catch (e) {
				myToast({message: 'Ошибка!', type: 'error'})
			}
		} else {
			try {
				const response = await visibleCategory({id, token: accessToken!, serviceId})
				if (response?.error) {
					return myToast({message: 'Ошибка!', type: 'error'})
				}
				myToast({message: 'Успешно!', type: 'success'})
				setTimeout(() => {
					window.location.reload()
				}, 2000)
			} catch (e) {
				myToast({message: 'Ошибка!', type: 'error'})
			}
		}
	}

	const handleAdd = async () => {
		if (!name) return myToast({ message: 'Введите название!', type: 'error' })
		if (!serviceId)
			return myToast({ message: 'Выберите категорию!', type: 'error' })
		try {
			const response = await createSubCategory({name, serviceId, token: accessToken!})
			if (response?.error) {
				return myToast({message: 'Категория уже существует.', type: 'error'})
			}
			myToast({message: 'Успешно!', type: 'success'})
			setTimeout(() => {
				window.location.reload()
			}, 2000)
		} catch (e) {
			myToast({ message: 'Ошибка!', type: 'error' })
		}
	}

	return (
		<>
			<NavBar active='statements' />
			<div className='my-8 px-30'>
				<button
					className='w-[194px] h-10 bg-[#4D4D4D] rounded-[20px] text-white font-normal cursor-pointer'
					onClick={() => setMenu(!menu)}
				>
					Добавить категорию
				</button>
			</div>
			<TableCategory
				list={initialList}
				onHidden={handleHidden}
			/>
			<section
				className={`modal w-full h-full fixed top-0 left-0 z-100 bg-[#00000099] flex items-center justify-center ${
					!menu && 'hidden'
				}`}
			>
				<div className='w-[422px] h-[314px] rounded-[20px] bg-white p-8 relative'>
					<Image src={SVGClose} alt="close..." className='absolute top-5 right-5 size-[22px] cursor-pointer' onClick={() => setMenu(false)} />
					<h2 className='text-[14px] font-medium mb-3'>Наименование</h2>
					<input
						type='text'
						onChange={e => setName(e.target.value)}
						className='w-full h-11 bg-[#D9D9D9] rounded-[20px] text-[15px] text-black font-normal px-5 outline-0 mb-5'
						maxLength={30}
					/>

					<h2 className='text-[14px] font-medium mb-3'>
						Родительская категория
					</h2>
					<div className='w-full relative'>
						<div
							className='w-full h-11 bg-[#D9D9D9] rounded-[20px] text-[15px] text-black font-normal px-5 mb-5 relative cursor-pointer flex items-center'
							onClick={() => setSelect(!select)}
						>
							{serviceName}
							<Image
								src={SVGArrow}
								alt='...'
								className={`absolute top-5 right-5 ${select && 'rotate-180'}`}
							/>
						</div>
						<div className={`absolute top-12 left-0 w-full h-auto max-h-[200px] p-5 overflow-auto ${!select && 'hidden'} bg-[#D9D9D9] rounded-[20px]`}>
							{
								service.map((value) => (
									<h2 key={value.id} className='mb-2 font-normal text-[16px] cursor-pointer' onClick={() => {
										setServiceName(value.name)
										setServiceId(value.id)
										setSelect(false)
									}}>{value.name}</h2>
								))
							}
						</div>
					</div>
					<button
						className='w-full h-[54px] bg-[#4D4D4D] text-white text-[16px] font-normal rounded-[10px] cursor-pointer'
						onClick={handleAdd}
					>
						Сохранить
					</button>
				</div>
			</section>
		</>
	)
}

export default StatementsCategory
