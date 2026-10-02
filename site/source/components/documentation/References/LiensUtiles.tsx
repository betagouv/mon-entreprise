import { useTranslation } from 'react-i18next'

import { H2 } from '@/design-system'
import { Références } from '@/domaine/documentation/References'

import { ListeDeRéférences } from './ListeDeReferences'

type Props = {
	références: Références
}

export const LiensUtiles = ({ références }: Props) => {
	const { t } = useTranslation()

	if (!références || Object.keys(références).length === 0) {
		return null
	}

	return (
		<>
			<H2 as="h3">{t('components.liens-utiles', 'Liens utiles')}</H2>
			<ListeDeRéférences références={références} />
		</>
	)
}
