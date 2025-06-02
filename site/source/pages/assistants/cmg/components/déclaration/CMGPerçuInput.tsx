import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import { Body, MontantField } from '@/design-system'
import { Montant } from '@/domaine/Montant'
import { ChangeHandler } from '@/utils/ChangeHandler'

type Props = {
	idSuffix?: string
	valeur: O.Option<Montant<'Euro'>>
	onChange: ChangeHandler<O.Option<Montant<'Euro'>>>
}

export default function CMGPerçuInput({ idSuffix, valeur, onChange }: Props) {
	const { t } = useTranslation()

	return (
		<>
			<Body id={`CMG-perçu-label-${idSuffix}`}>
				{t('pages.assistants.cmg.GED.CMG-perçu.label', 'CMG perçu')}
			</Body>
			<MontantField
				value={O.getOrUndefined(valeur)}
				unité="Euro"
				onChange={(montant) => onChange(O.fromNullable(montant))}
				aria-labelledby={`CMG-perçu-label-${idSuffix}`}
			/>
		</>
	)
}
