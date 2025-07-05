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

export default function RémunérationInput({
	idSuffix,
	valeur,
	onChange,
}: Props) {
	const { t } = useTranslation()

	return (
		<div>
			<Label id={`rémunération-label-${idSuffix}`}>
				{t(
					'pages.assistants.cmg.déclarations.rémunération.label',
					'Rémunération totale'
				)}
			</Label>
			<MontantField
				value={O.getOrUndefined(valeur)}
				unité="€"
				avecCentimes
				onChange={(montant) => onChange(O.fromNullable(montant))}
				aria-labelledby={`rémunération-label-${idSuffix}`}
			/>
		</div>
	)
}
