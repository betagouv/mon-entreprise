import * as O from 'effect/Option'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { OuiNonInput } from '@/components/conversation/OuiNonInput'
import { useCMG } from '@/contextes/cmg'
import { NumberField, Spacing } from '@/design-system'
import { OuiNon } from '@/domaine/OuiNon'

import { Label, Question } from '../styled-components'

export default function AeeH() {
	const { AeeH, set } = useCMG()
	const { t } = useTranslation()
	const [perçoitAeeH, setPerçoitAeeH] = useState<OuiNon | undefined>()

	return (
		<>
			<Question id="perçoit-AeeH-label">
				{t(
					'pages.assistants.cmg.enfants.perçoit-AeeH.label',
					'Percevez-vous l’AeeH (allocation d’éducation de l’enfant handicapé) ?'
				)}
			</Question>
			<Spacing xxs />
			<OuiNonInput
				value={perçoitAeeH}
				aria={{ labelledby: 'perçoit-AeeH-label' }}
				onChange={setPerçoitAeeH}
			/>

			{perçoitAeeH === 'oui' && (
				<>
					<Spacing md />
					<Label id="AeeH-label">
						{t(
							'pages.assistants.cmg.questions.AeeH.label',
							'Nombre d’enfants concernés'
						)}
					</Label>
					<NumberField
						value={O.getOrUndefined(AeeH)}
						onChange={(valeur) => set.AeeH(O.fromNullable(valeur))}
						aria-labelledby="AeeH-label"
					/>
				</>
			)}
		</>
	)
}
