import { useTranslation } from 'react-i18next'

import { Chip, Emoji } from '@/design-system'

type Props = {
	date: string
}

export const DateChip = ({ date }: Props) => {
	const { t } = useTranslation()

	return (
		<Chip
			type="secondary"
			icon={<Emoji emoji="📆" />}
			title={t(
				'pages.simulateurs.date',
				'Date de la réglementation utilisée pour les calculs'
			)}
		>
			{date}
		</Chip>
	)
}
