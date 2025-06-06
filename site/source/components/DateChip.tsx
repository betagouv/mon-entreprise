import { useTranslation } from 'react-i18next'

import { Chip, Emoji } from '@/design-system'
import { useCurrentSimulatorData } from '@/hooks/useCurrentSimulatorData'
import useDate from '@/hooks/useDate'

export default function DateChip() {
	const { currentSimulatorData } = useCurrentSimulatorData()
	const showDate = !currentSimulatorData?.hideDate

	const engineDate = useDate()
	const date = engineDate?.toString().slice(-7)

	const { t } = useTranslation()

	return (
		showDate &&
		date && (
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
	)
}
