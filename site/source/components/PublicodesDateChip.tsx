import useDate from '@/hooks/useDate'

import { DateChip } from './DateChip'

export const PublicodesDateChip = () => {
	const engineDate = useDate()
	const date = engineDate?.toString().slice(-7)

	return date && <DateChip date={date} />
}
