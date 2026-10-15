import { HelpButton } from '@/design-system'

import { DocumentationDeQuestion } from './DocumentationDeQuestion'
import { LiensUtiles } from './References/LiensUtiles'

type Props = {
	sujet: string
	documentation: DocumentationDeQuestion
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
