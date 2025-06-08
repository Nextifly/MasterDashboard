'use client'

import NavBar from '@/components/NavBar/NavBar'
import TableSity from '@/components/Table/TableSity'
import SVGClose from '@/assets/images/close.svg'

import { useCreateSitiesMutation, useGetSitiesQuery, useHiddenSitiesMutation, useVisibleSitiesMutation } from '@/lib/redux/api/Sities/SitiesApi'
import { useAccessToken } from '@/lib/store/store'
import { myToast } from '@/ui/toast'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const StatementsSity = () => {
	const {data: getSities} = useGetSitiesQuery()
	const [hiddenSity] = useHiddenSitiesMutation()
	const [visibleSity] = useVisibleSitiesMutation()
	const [createSity] = useCreateSitiesMutation()
	const {accessToken} = useAccessToken()
	
	const [menu, setMenu] = useState<boolean>(false)
	const [nameCity, setNameCity] = useState<string>('')
	const [initialList, setInitialList] = useState<string[][]>([])

	useEffect(() => {
		if (getSities) {
			const newList: string[][] = []
			getSities.map(value => {
				const arr = []
				arr.push((value.visible).toString())
				arr.push(value.name)
				arr.push(value.id)
				newList.push(arr)
			})
			setInitialList(newList)
		}
	}, [getSities])

	const handleHidden = async (id: string, visible: string) => {
		if (visible === 'true') {
			try {
			await hiddenSity({id, token: accessToken!})
			myToast({message: 'Успешно!', type: 'success' })
			window.location.reload()
		} catch (e) {
			myToast({message: 'Ошибка!', type: 'error' })
		}
		} else {
			try {
			await visibleSity({id, token: accessToken!})
			myToast({message: 'Успешно!', type: 'success' })
			window.location.reload()
		} catch (e) {
			myToast({message: 'Ошибка!', type: 'error' })
		}
		}
	}

	const handleClickAdd = async () => {
		if (nameCity.length === 0) return myToast({message: 'Введите название города!', type: 'error'})
		try {
			const responce = await createSity({name: nameCity, token: accessToken!})
			if (responce?.error) {
				return myToast({message: 'Такой город уже есть!', type: 'error'})
			}
			myToast({message: 'Успешно!', type: 'success'})
			setTimeout(() => {
				window.location.reload()
			}, 2000)
		} catch (e) {
			myToast({message: 'Ошибка', type: 'error'})
		}
	}

	return (
		<>
			<NavBar active='statements' />
			<div className='my-8 px-30'>
				<button className='w-[174px] h-[39px] bg-[#4D4D4D] rounded-[20px] text-white font-normal cursor-pointer' onClick={() => setMenu(!menu)}>Добавить город</button>
			</div>
			<TableSity list={{header: [{name: 'Наименование', filter: true}, {name: 'Действия'}], list: initialList}} onHidden={handleHidden} />
			<section className={`modal w-full h-full fixed top-0 left-0 z-100 bg-[#00000099] flex items-center justify-center ${!menu && 'hidden'}`}>
				<div className='w-[422px] h-[226px] rounded-[20px] bg-white p-8 relative'>
					<Image src={SVGClose} alt="close..." className='absolute top-5 right-5 size-[22px] cursor-pointer' onClick={() => setMenu(false)} />
					<h2 className='text-[14px] font-medium mb-3'>Наименование</h2>
					<input type="text" onChange={(e) => setNameCity(e.target.value)} className='w-full h-11 bg-[#D9D9D9] rounded-[20px] text-[15px] text-black font-normal px-5 outline-0 mb-10'  maxLength={30} />
					<button className='w-full h-[54px] bg-[#4D4D4D] text-white text-[16px] font-normal rounded-[10px] cursor-pointer' onClick={handleClickAdd}>Сохранить</button>
				</div>
			</section>
		</>
	)
}

export default StatementsSity