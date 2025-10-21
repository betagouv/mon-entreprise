import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Button, Emoji, Spacing } from '@/design-system'
import { simulationUrlSelector } from '@/store/selectors/simulationUrl.selector'

export default function BackToSimulation() {
	const url = useSelector(simulationUrlSelector)
	const { t } = useTranslation()

	if (!url) {
		return null
	}

	return (
		<>
			<Spacing lg />
			<Button to={url}>
				<Emoji emoji="←" />{' '}
				{t('pages.documentation.back', 'Retourner à la simulation')}
			</Button>
		</>
	)
}
