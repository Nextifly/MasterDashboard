'use client'

import Image from 'next/image'

import SVGInfo from '@/assets/images/info.svg'
import SVGLogout from '@/assets/images/logout.svg'
import { useLogoutMutation } from '@/lib/redux/api/Auth/AuthApi'
import { useGetStaticQuery } from '@/lib/redux/api/Static/StaticApi'
import { useAccessToken, useRefreshToken } from '@/lib/store/store'
import { myToast } from '@/ui/toast'
import { useRouter } from 'next/navigation'

interface IHeader {
	email: string
	accessToken: string
	refreshToken: string
}

const Header = ({ email, accessToken, refreshToken }: IHeader) => {
	const [logout] = useLogoutMutation()
	const router = useRouter()
	const { deleteAccessToken } = useAccessToken()
	const { deleteRefreshToken } = useRefreshToken()
	const { data: staticData } = useGetStaticQuery(accessToken!)

	const handleClick = async () => {
		await logout({ accessToken, refreshToken })
		deleteAccessToken()
		deleteRefreshToken()
		myToast({ message: 'Вы успешно вышли из аккаунта!', type: 'success' })
		setTimeout(() => {
			router.push('/auth/signup')
		}, 2000)
	}

	return (
		<header className='flex justify-between items-center px-30 my-5'>
			<div>
				<p className='font-medium text-[20px]'>Admin</p>
				<p className='font-medium text-[20px]'>{email}</p>
				<div
					className='mt-5 flex gap-2 items-center cursor-pointer'
					onClick={handleClick}
				>
					<Image src={SVGLogout} alt='...' />
					<h2 className='font-medium text-[20px] leading-0'>Выйти</h2>
				</div>
			</div>
			<div className='flex gap-8'>
				<Image src={SVGInfo} alt='...' />
				<div>
					<h2 className='text-[20px] font-medium mb-1'>Закрытие заявок</h2>
					{staticData ? (
						<p className='text-2xl font-medium'>
							{staticData.closedOrders} (
							{`${Math.round(
								(staticData.closedOrders / staticData.totalOrders) * 100
							)}`}
							%)
						</p>
					) : (
						<p className='text-2xl font-medium'>0 (0%)</p>
					)}
				</div>
			</div>
			<div className='flex gap-8'>
				<Image src={SVGInfo} alt='...' />
				<div>
					<h2 className='text-[20px] font-medium mb-1'>Открытие заявок</h2>
					{staticData ? (
						<p className='text-2xl font-medium'>
							{staticData.openOrders} (
							{`${Math.round(
								(staticData.openOrders / staticData.totalOrders) * 100
							)}`}
							%)
						</p>
					) : (
						<p className='text-2xl font-medium'>0 (0%)</p>
					)}
				</div>
			</div>
			<div className='flex gap-8'>
				<Image src={SVGInfo} alt='...' />
				<div>
					<h2 className='text-[20px] font-medium mb-1'>Всего доход</h2>
					<p className='text-2xl font-medium'>
						{staticData ? staticData.totalRevenue : 0} р.
					</p>
				</div>
			</div>
		</header>
	)
}

export default Header
