import { useTranslation } from 'react-i18next'

import { InfoButton, Spacing } from '@/design-system'
import { DocumentationDeValeur } from '@/domaine/documentation/DocumentationDeValeur'

import { DocumentationLink } from './DocumentationLink'

type Props = {
	documentation: DocumentationDeValeur
}

export const DocumentationInfoButton = ({ documentation }: Props) => {
	const { t } = useTranslation()
	const { titre, Résumé, Références } = documentation

	return (
		<InfoButton subject={titre()}>
			<Résumé />

			<DocumentationLink vers={documentation}>
				{t(
					'components.documentation.lire-la-documentation',
					'Lire la documentation'
				)}
			</DocumentationLink>

			<Références />
			<Spacing xxl />
		</InfoButton>
	)
}
