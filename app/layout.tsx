import { ReduxProvider } from '@/lib/redux/provider'
import type { Metadata } from 'next'
import { Jost } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const jost = Jost({
	variable: '--font-jost',
	subsets: ['latin'],
	weight: ["100","200","300","400","500","600","700","800"]
})

export const metadata: Metadata = {
	title: 'Admin Panel',
	description: 'Admin Panel',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
			<ReduxProvider>
			<html lang='ru'>
				<body className={`${jost.variable}`}>
					{children}
				</body>
			</html>
			<Toaster />
		</ReduxProvider>
	)
}
