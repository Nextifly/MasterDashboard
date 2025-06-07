'use client'

import NavBar from '@/components/NavBar/NavBar'
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
	const defaultData = {
		total: 386,
		closed: 350,
		open: 36,
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
					<h2 className='font-bold text-[20px]'>Всего заявок: 386</h2>
					<div className='flex items-center justify-start gap-2'>
						<div className='size-[15px] rounded-[15px] bg-[#45B3AA] mt-1' />
						<p className='font-bold text-[20px]'>Закрытых заявок: 350 (70%)</p>
					</div>
					<div className='flex items-center justify-start gap-2 mb-12'>
						<div className='size-[15px] rounded-[15px] bg-[#777776] mt-1' />
						<p className='font-bold text-[20px]'>Открытых заявок: 36 (30%)</p>
					</div>
					<Pie data={pieChartData} options={options} height={550} width={550} />
				</div>
				<section className='w-[70%]'>
					<div className='flex justify-between items-start mb-8'>
						<div>
							<h2 className='font-bold text-[20px] mb-6'>
								Общая статистика мастеров
							</h2>
							<p className='font-normal text-[20px]'>Всего мастеров: 570</p>
							<p className='font-normal text-[20px]'>Новых в этом месяце: 13</p>
						</div>
						<div>
							<h2 className='font-bold text-[20px] mb-6'>
								Топ-3 мастеров по закрытию
							</h2>
							<p className='font-normal text-[20px]'>
								Иванов Иван Иванович (23)
							</p>
							<p className='font-normal text-[20px]'>
								Иванов Иван Иванович (19)
							</p>
							<p className='font-normal text-[20px]'>
								Иванов Иван Иванович (17)
							</p>
						</div>
					</div>
					<div className='flex justify-between items-start mb-8'>
						<div>
							<h2 className='font-bold text-[20px] mb-6'>
								Количество заявок по городам
							</h2>
							<p className='font-normal text-[20px]'>Москва: 257</p>
							<p className='font-normal text-[20px]'>Екатеринбург: 13</p>
							<p className='font-normal text-[20px]'>Саратов: 2</p>
							<p className='font-normal text-[20px]'>Cамара: 10</p>
							<p className='font-normal text-[20px]'>Волгоград: 96</p>
						</div>
						<div>
							<h2 className='font-bold text-[20px] mb-6'>
								Количество пользователей<br/>по городам
							</h2>
							<p className='font-normal text-[20px]'>
								Москва: 257
							</p>
							<p className='font-normal text-[20px]'>
								Екатеринбург: 13
							</p>
							<p className='font-normal text-[20px]'>
								Саратов: 2
							</p>
							<p className='font-normal text-[20px]'>
								Самара: 10
							</p>
							<p className='font-normal text-[20px]'>
								Волгоград: 96
							</p>
						</div>
					</div>
					<h2 className='font-bold text-[20px]'>Ориентировочная сумма закрытых заявок за месяц: 19356 р.</h2>
					<h2 className='font-bold text-[20px]'>Общая сумма поступлений: 35600 р.</h2>
				</section>
			</div>
		</>
	)
}

export default Static
