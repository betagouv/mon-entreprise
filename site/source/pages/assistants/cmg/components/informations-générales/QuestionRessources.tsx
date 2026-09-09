import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import { useCMG } from '@/contextes/cmg'
import { MontantField } from '@/design-system'

import { DescriptionQuestion, Question } from '../styled-components'

export default function QuestionRessources() {
	const { situation, set } = useCMG()
	const { t } = useTranslation()

	return (
		<>
			<Question id="ressources-label">
				{t(
					'pages.assistants.cmg.informations-générales.ressources.label',
					'Quel est le revenu de votre foyer pour l’année 2023 ?'
				)}
			</Question>
			<DescriptionQuestion>
				{t(
					'pages.assistants.cmg.informations-générales.ressources.description',
					'Renseignez le revenu fiscal de référence figurant sur le ou les avis d’imposition des membres de votre foyer.'
				)}
			</DescriptionQuestion>
			<MontantField
				value={O.getOrUndefined(situation.ressources)}
				unité="€/an"
				onChange={(montant) => set.ressources(O.fromNullable(montant))}
				aria={{ labelledby: 'ressources-label' }}
			/>
		</>
	)
}
