import useDate from './useDate'

export default function useYear() {
	const date = useDate()

	return Number(date?.toString().slice(-4) || new Date().getFullYear())
}
