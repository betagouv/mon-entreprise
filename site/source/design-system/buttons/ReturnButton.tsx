import { useTranslation } from 'react-i18next'

import { ReturnLeftIcon } from '../icons'
import { Button, Size } from './Button'

type Props = {
	onPress: () => void
	text?: string
	size?: Size
}

export const ReturnButton = ({ onPress, text, size }: Props) => {
	const { t } = useTranslation()

	return (
		<Button light size={size} onPress={onPress}>
			<ReturnLeftIcon />
			{text ?? t('global.retour', 'Retour')}
		</Button>
	)
}
