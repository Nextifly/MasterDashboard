'use client'

import SVGArrow from '@/assets/images/arrow_black.svg'
import SVGPlus from '@/assets/images/plus.svg'
import SVGReset from '@/assets/images/reset.svg'
import NavBar from '@/components/NavBar/NavBar'
import { useCreateNewsMutation } from '@/lib/redux/api/News/NewsApi'
import { ICreateNews } from '@/lib/redux/api/News/types'

import { useGetSitiesQuery } from '@/lib/redux/api/Sities/SitiesApi'
import { myToast } from '@/ui/toast'
import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent, useState } from 'react'

const AddNews = () => {
	const [isCityMenu, setIsCityMenu] = useState<boolean>(false)
	const { data: getSities } = useGetSitiesQuery()
	const [createNews] = useCreateNewsMutation()
	const [cityText, setCityText] = useState<string>('')
	const [title, setTitle] = useState<string>('')
	const [cityId, setCityId] = useState<string>('')
	const [text, setText] = useState<string>('')

	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string>('')

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) return

		const file = e.target.files[0]
		setSelectedFile(file)

		// Превью изображения
		const reader = new FileReader()
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				setPreviewUrl(reader.result)
			}
		}
		reader.readAsDataURL(file)
	}

	const handleUpload = async () => {
		if (!title) return myToast({message: 'Введите заголовок!', type: 'error'})
		if (!cityId) return myToast({message: 'Выберите город!', type: 'error'})
		if (!text) return myToast({message: 'Введите контент!', type: 'error'})
    if (!selectedFile) return myToast({message: 'Выберите фотографию!', type: 'error'});

		let formData = new FormData()
		formData.append('photo', selectedFile)
		formData.append('title', title)
		formData.append('cityId', cityId)
		formData.append('content', text)

		try {
			const response = await createNews(formData)
			if (response?.data) {
				myToast({message: 'Успешно!', type: 'success'})
			}
		} catch (e) {
			console.log(e)
			myToast({message: 'Ошибка создания', type: 'error'})
		}
  };

	return (
		<section>
			<NavBar active='news' />
			<div className='px-30 flex justify-between items-start mt-8'>
				<div>
					<Link
						href={'/dashboard/news'}
						className='flex items-center gap-4 mb-8'
					>
						<Image src={SVGReset} alt='...' />
						<h1 className='font-normal text-2xl '>Новая публикация</h1>
					</Link>
					<div className='mb-8'>
						<h2 className='font-normal mb-3'>Заголовок:</h2>
						<input
							type='text'
							className='w-[668px] h-[39px] border-1 border-[#0895A8] rounded-[20px] px-4 outline-0 text-[14px]'
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>
					<div className='mb-8 relative'>
						<h2 className='font-normal mb-3'>Город:</h2>
						<div
							className='w-[668px] h-[39px] border-1 border-[#0895A8] rounded-[20px] px-4 outline-0 text-[14px] flex justify-between items-center cursor-pointer'
							onClick={() => setIsCityMenu(!isCityMenu)}
						>
							<h2>{cityText}</h2>
							<Image
								src={SVGArrow}
								alt='...'
								className={`${isCityMenu && 'rotate-180'}`}
							/>
						</div>
						<div
							className={`w-[668px] h-auto absolute border-1 border-[#0895A8] p-4 text-start flex flex-col gap-3 z-10 bg-white top-21 rounded-[20px] ${
								!isCityMenu && 'hidden'
							}`}
						>
							{getSities &&
								getSities.map(value => (
									<h2
										key={value.id}
										className='font-normal text-[16px] cursor-pointer'
										onClick={() => {
											setCityId(value.id)
											setCityText(value.name)
											setIsCityMenu(false)
										}}
									>
										{value.name}
									</h2>
								))}
						</div>
					</div>
					<div>
						<h2 className='font-normal mb-3'>Текст новости</h2>
						<textarea className='w-[668px] h-[250px] resize-none border-1 border-[#0895A8] rounded-[20px] p-4 outline-0 text-[14px]' onChange={(e) => setText(e.target.value)}/>
					</div>
				</div>
				<div>
					<h2>Фото для новости</h2>
					<div className='my-8 flex items-center justify-center gap-8'>
						{previewUrl && selectedFile ? (
							<div className='preview'>
								<img
									src={previewUrl}
									alt='Preview'
									className='w-[151px] h-[151px] rounded-[10px]'
								/>
							</div>
						) : (
							<div className='relative'>
								<input
									type='file'
									accept='image/*'
									onChange={handleFileChange}
									className='file-input w-[151px] h-[151px] rounded-[10px] opacity-0 absolute top-0 left-0 z-20 cursor-pointer'
								/>
								<div className='flex justify-center items-center w-[151px] h-[151px] bg-[#d9d9d9] rounded-[10px]'>
									<Image src={SVGPlus} alt='...' />
								</div>
							</div>
						)}
						<h2 className='font-medium'>Можно загрузить<br/>изображение<br/>в формате jpg, png.</h2>
					</div>
					<button className='w-full h-[39px] text-[20px] font-normal text-white bg-[#9E9E9E] rounded-[20px] cursor-pointer' onClick={handleUpload}>Сохранить</button>
				</div>
			</div>
		</section>
	)
}

export default AddNews
