import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import { useCMG } from '@/contextes/cmg'
import { Intro, MontantField, SmallBody } from '@/design-system'

export default function QuestionRessources() {
	const { situation, set } = useCMG()
	const { t } = useTranslation()

	return (
		<>
			<Intro id="ressources-label">
				{t(
					'pages.assistants.cmg.questions.ressources.label',
					'Quel est le revenu de votre foyer pour l’année 2023 ?'
				)}
			</Intro>
			<SmallBody>
				{t(
					'pages.assistants.cmg.questions.ressources.description',
					'Renseignez le revenu fiscal de référence figurant sur le ou les avis d’imposition des membres de votre foyer'
				)}
			</SmallBody>
			<MontantField
				value={O.getOrUndefined(situation.ressources)}
				unité="EuroParAn"
				onChange={(montant) => set.ressources(O.fromNullable(montant))}
				aria={{ labelledby: 'ressources-label' }}
			/>
		</>
	)
}
