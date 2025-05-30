import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import { useCMG } from '@/contextes/cmg'
import { Intro, NumberField } from '@/design-system'

export default function QuestionAeeH() {
	const { AeeH, set } = useCMG()
	const { t } = useTranslation()

	return (
		<>
			<Intro id="AeeH-label">
				{t(
					'pages.assistants.cmg.questions.AeeH.label',
					'Combien de vos enfants sont concernés par l’AeeH (allocation d’éducation de l’enfant handicapé) ?'
				)}
			</Intro>
			<NumberField
				value={O.getOrUndefined(AeeH)}
				onChange={(valeur) => set.AeeH(O.fromNullable(valeur))}
				aria-labelledby="AeeH-label"
			/>
		</>
	)
}
