interface IAuthButton {
	text: string;
	onClick: () => (void)
}

const AuthButton = ({text, onClick}: IAuthButton) => {
	return (
		<button onClick={onClick} className='h-[49px] w-107 bg-[#9e9e9e] text-white font-bold text-[20px] cursor-pointer'>{text}</button>
	)
}

export default AuthButton