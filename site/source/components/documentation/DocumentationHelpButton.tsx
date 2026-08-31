import { useTranslation } from 'react-i18next'

import { H3, HelpButton } from '@/design-system'
import { DocumentationDeChamp } from '@/domaine/documentation/DocumentationDeChamp'

import { ListeDeRéférences } from './References/ListeDeReferences'

type Props = {
	sujet: string
	documentation: DocumentationDeChamp
}

export const DocumentationHelpButton = ({ sujet, documentation }: Props) => {
	const { t } = useTranslation()
	const { Documentation, références } = documentation

	return (
		<HelpButton subject={sujet}>
			<Documentation />

			{références && (
				<>
					<H3>{t('components.champ.aide.références', 'Liens utiles')}</H3>
					<ListeDeRéférences références={références} />
				</>
			)}
		</HelpButton>
	)
}
