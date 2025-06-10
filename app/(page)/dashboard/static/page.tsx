'use client'

import NavBar from '@/components/NavBar/NavBar'
import { useGetStaticQuery } from '@/lib/redux/api/Static/StaticApi'
import { useAccessToken } from '@/lib/store/store'
import {
	ArcElement,
	Chart as ChartJS,
	ChartOptions,
	Legend,
	Tooltip,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

const Static = () => {
	const { accessToken } = useAccessToken()
	const { data: staticData } = useGetStaticQuery(accessToken!)

	const defaultData = {
		total: staticData?.totalOrders || 0,
		closed: staticData?.closedOrders || 0,
		open: staticData?.openOrders || 0,
	}

	// Данные для диаграммы
	const pieChartData = {
		datasets: [
			{
				data: [defaultData.closed, defaultData.open],
				backgroundColor: ['#45B3AA', '#777776'],
				hoverBackgroundColor: ['#45B3AA', '#777776'],
				borderWidth: 5,
			},
		],
	}

	// Настройки диаграммы
	const options: ChartOptions<'pie'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			tooltip: {
				callbacks: {
					label: function (context: any) {
						const label = context.label || ''
						const value = context.raw || 0
						return `${label}: ${value}`
					},
				},
			},
			datalabels: {
				formatter: value => {
					const percentage = Math.round((value / defaultData.total) * 100)
					return `${percentage}%` // Отображаем только проценты
				},
				color: '#fff',
				font: {
					weight: 'bold',
					size: 24,
				},
				anchor: 'center',
				align: 'center',
			},
		},
	}

	return (
		<>
			<NavBar active='static' />
			<div className='mt-15 flex justify-between px-30 items-start gap-32'>
				<div className='w-[420px]'>
					<h2 className='font-bold text-[20px] mb-12'>
						Общая статистика заявок
					</h2>
					<h2 className='font-bold text-[20px]'>
						Всего заявок: {staticData ? staticData.totalOrders : 0}
					</h2>
					<div className='flex items-center justify-start gap-2'>
						<div className='size-[15px] rounded-[15px] bg-[#45B3AA] mt-1' />
						<p className='font-bold text-[20px]'>
							Закрытых заявок:{' '}
							{staticData &&
								staticData.closedOrders +
									' ' +
									'(' +
									Math.round(
										(staticData.closedOrders / staticData.totalOrders) * 100
									) +
									'%' +
									')'}
						</p>
					</div>
					<div className='flex items-center justify-start gap-2 mb-12'>
						<div className='size-[15px] rounded-[15px] bg-[#777776] mt-1' />
						<p className='font-bold text-[20px]'>
							Открытых заявок:{' '}
							{staticData &&
								staticData.openOrders +
									' ' +
									'(' +
									Math.round(
										(staticData.openOrders / staticData.totalOrders) * 100
									) +
									'%' +
									')'}
						</p>
					</div>
					<div className='max-w-[350px]'>
						<Pie
							data={pieChartData}
							options={options}
							style={{ height: 350 }}
						/>
					</div>
				</div>
				<section className='w-[70%]'>
					<div className='flex justify-between items-start mb-8'>
						<div>
							<h2 className='font-bold text-[20px] mb-6'>
								Общая статистика мастеров
							</h2>
							<p className='font-normal text-[20px]'>Всего мастеров: {staticData ? staticData.totalMasters : 0}</p>
							<p className='font-normal text-[20px]'>Новых в этом месяце: {staticData ? staticData.newMastersThisMonth : 0}</p>
						</div>
						<div>
							<h2 className='font-bold text-[20px] mb-6'>
								Топ-3 мастеров по закрытию
							</h2>
							{
								staticData && staticData.topMasters.map((master) => (
										<p className='font-normal text-[20px]' key={master.firstName + master.lastName + master.closedOrders}>
											{master.firstName + ' ' + master.lastName} ({master.closedOrders})
										</p>
								))
							}
						</div>
					</div>
					<div className='flex justify-between items-start mb-8'>
						<div>
							<h2 className='font-bold text-[20px] mb-6'>
								Количество заявок по городам
							</h2>
							{
								staticData && staticData.ordersByCity.map((city) => (
									<p className='font-normal text-[20px]'>{city.city}: {city.count}</p>
								))
							}
						</div>
						<div>
							<h2 className='font-bold text-[20px] mb-6'>
								Количество пользователей
								<br />
								по городам
							</h2>
							{
								staticData && staticData.usersByCity.map((city) => (
									<p className='font-normal text-[20px]'>{city.city}: {city.count}</p>
								))
							}
						</div>
					</div>
					<h2 className='font-bold text-[20px]'>
						Ориентировочная сумма закрытых заявок за месяц: {staticData ? staticData.monthlyRevenue : 0} р.
					</h2>
					<h2 className='font-bold text-[20px]'>
						Общая сумма поступлений: {staticData ? staticData.totalRevenue : 0} р.
					</h2>
				</section>
			</div>
		</>
	)
}

export default Static
