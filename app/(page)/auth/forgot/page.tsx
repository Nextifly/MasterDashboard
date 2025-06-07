'use client'

import AuthTitle from '@/ui/text/AuthTitle'
import AuthInput from '@/ui/input/AuthInput'
import AuthButton from '@/ui/button/AuthButton'

import { useState } from 'react'

const Forgot = () => {
	const [email, setEmail] = useState<string>('')
	const [word, setWord] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [doublePassword, setDoublePassword] = useState<string>('')

	const handleClick = () => {

	}

	return (
		<>
			<AuthTitle value='Восстановление пароля' />
			<AuthInput placeholder='E-mail' type='text' onChange={setEmail} />
			<AuthInput placeholder='Кодовое слово' type='text' onChange={setWord} />
			<AuthInput placeholder='Новый пароль' type='password' onChange={setEmail} />
			<AuthInput placeholder='Повторить новый пароль' type='password' onChange={setEmail} />
			<AuthButton text='Войти' onClick={handleClick} />			
		</>
	)
}

export default Forgot