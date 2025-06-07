import toast from 'react-hot-toast'

type TType = 'error' | 'success'

interface IToast {
	message: string
	type: TType
}

export const myToast = ({ message, type }: IToast) => {
	if (type === 'success')
		return toast.success(message, { duration: 2500, position: 'top-left' })
	else {
		return toast.error(message, { duration: 2500, position: 'top-left' })
	}
}
