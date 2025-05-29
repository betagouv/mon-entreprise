import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import { useCMG } from '@/contextes/cmg'
import { Intro, MontantField } from '@/design-system'

export default function QuestionRessources() {
	const { situation, set } = useCMG()
	const { t } = useTranslation()

	return (
		<>
			<Intro id="ressources-label">
				{t(
					'pages.assistants.cmg.questions.ressources.label',
					'Quel est le revenu fiscal de référence de votre foyer pour l’année 2023 ?'
				)}
			</Intro>
			<MontantField
				value={O.getOrUndefined(situation.ressources)}
				unité="EuroParAn"
				onChange={(montant) => set.ressources(O.fromNullable(montant))}
				aria={{ labelledby: 'ressources-label' }}
			/>
		</>
	)
}
