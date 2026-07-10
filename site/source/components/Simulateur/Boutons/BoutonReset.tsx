import { useTranslation } from 'react-i18next'

import { ArrowCircleIcon, Button } from '@/design-system'

export const BoutonReset = ({ onReset }: { onReset: () => void }) => {
	const { t } = useTranslation()

	return (
		<Button size="XXS" light onPress={onReset}>
			<ArrowCircleIcon />
			{t(
				'components.simulateur.zone-de-saisie.situation.réinitialiser',
				'Valeurs par défaut'
			)}
		</Button>
	)
}
