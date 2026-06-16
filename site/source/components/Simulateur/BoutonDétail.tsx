import { useTranslation } from 'react-i18next'

import { ArrowDownIcon, Button } from '@/design-system'

export const ÉLÉMENT_DÉTAILS_ID = 'simulation-détail'

export const BoutonDétail = () => {
	const { t } = useTranslation()

	const scrollToDétails = () => {
		const détails = document.getElementById(ÉLÉMENT_DÉTAILS_ID)
		détails?.scrollIntoView({ behavior: 'smooth' })
		détails?.focus()
	}

	return (
		<Button light color="secondary" size="XS" onPress={scrollToDétails}>
			<ArrowDownIcon />
			{t('components.simulateur.voir-le-détail', 'Voir le détail')}
		</Button>
	)
}
