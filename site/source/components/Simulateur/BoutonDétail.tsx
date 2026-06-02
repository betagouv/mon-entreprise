import { useTranslation } from 'react-i18next'

import { ArrowDownIcon, Button } from '@/design-system'

export const BoutonDétail = () => {
	const { t } = useTranslation()

	const scrollToDétails = () =>
		document
			.getElementById('simulation-détail')
			?.scrollIntoView({ behavior: 'smooth' })

	return (
		<Button light color="secondary" size="XS" onPress={scrollToDétails}>
			<ArrowDownIcon />
			{t('components.simulateur.voir-le-détail', 'Voir le détail')}
		</Button>
	)
}
