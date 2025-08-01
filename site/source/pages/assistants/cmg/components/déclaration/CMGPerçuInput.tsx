import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import { MontantField } from '@/design-system'
import { Montant } from '@/domaine/Montant'
import { ChangeHandler } from '@/utils/ChangeHandler'

import { Label } from '../styled-components'

type Props = {
	idSuffix?: string
	valeur: O.Option<Montant<'€'>>
	onChange: ChangeHandler<O.Option<Montant<'€'>>>
}

export default function CMGPerçuInput({ idSuffix, valeur, onChange }: Props) {
	const { t } = useTranslation()

	return (
		<div>
			<Label id={`CMG-perçu-label-${idSuffix}`}>
				{t(
					'pages.assistants.cmg.déclarations.CMG-perçu.label',
					'CMG Rémunération perçu'
				)}
			</Label>
			<MontantField
				value={O.getOrUndefined(valeur)}
				unité="€"
				avecCentimes
				onChange={(montant) => onChange(O.fromNullable(montant))}
				aria-labelledby={`CMG-perçu-label-${idSuffix}`}
			/>
		</div>
	)
}
