import Link from 'next/link'

interface IAuthLink {
	value: string;
	link: string;
}

const AuthLink = ({value, link}: IAuthLink) => {
	return <Link href={link} className='text-black text-[20px] font-bold mt-20'>{value}</Link>
}

export default AuthLink