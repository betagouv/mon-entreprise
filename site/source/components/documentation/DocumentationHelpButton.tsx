import { HelpButton } from '@/design-system'
import { DocumentationDeChamp } from '@/domaine/documentation/DocumentationDeChamp'

import { LiensUtiles } from './References/LiensUtiles'

type Props = {
	sujet: string
	documentation: DocumentationDeChamp
}

export const DocumentationHelpButton = ({ sujet, documentation }: Props) => {
	const { Documentation, références } = documentation

	return (
		<HelpButton subject={sujet}>
			<Documentation />

			<LiensUtiles références={références} />
		</HelpButton>
	)
}
