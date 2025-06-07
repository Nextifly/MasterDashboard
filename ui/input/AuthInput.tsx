'use client'

import Image from 'next/image'
import SVGEye from '@/assets/images/eye.svg'
import { useState } from 'react'

type TInput = 'password' | 'text'

interface IAuthInput {
	placeholder: string;
	type: TInput;
	onChange: (value: string) => (void);
}

const AuthInput = ({placeholder, type, onChange}: IAuthInput) => {
	const [click, setClick] = useState<boolean>(false)

	return (
		<div className='relative'>
			<input type={click ? 'text' : type} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} maxLength={35} className='w-107 h-[49px] border-1 border-[#9D9D9D] text-black font-bold outline-0 placeholder:text-black text-[20px] pl-3 pr-14 mb-[15px]'/>
			<Image src={SVGEye} alt='...' className={`${type !== 'password' && 'hidden'} absolute top-4.5 right-5 cursor-pointer`} onClick={() => setClick(!click)} />
		</div>
	)
}

export default AuthInput