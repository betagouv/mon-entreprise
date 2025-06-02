import { useTranslation } from 'react-i18next'

import { Body, MontantField } from '@/design-system'
import { Montant } from '@/domaine/Montant'
import { ChangeHandler } from '@/utils/ChangeHandler'

type Props = {
	idSuffix?: string
	valeur: Montant<'Euro'>
	onChange: ChangeHandler<Montant<'Euro'> | undefined>
}

export default function RémunérationInput({
	idSuffix,
	valeur,
	onChange,
}: Props) {
	const { t } = useTranslation()

	return (
		<>
			<Body id={`rémunération-label-${idSuffix}`}>
				{t(
					'pages.assistants.cmg.GED.rémunération.label',
					'Rémunération totale'
				)}
			</Body>
			<MontantField
				value={valeur}
				unité="Euro"
				onChange={onChange}
				aria-labelledby={`rémunération-label-${idSuffix}`}
			/>
		</>
	)
}
