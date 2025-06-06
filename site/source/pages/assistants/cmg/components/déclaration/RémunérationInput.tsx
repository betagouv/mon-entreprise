import { useTranslation } from 'react-i18next'

import { MontantField } from '@/design-system'
import { Montant } from '@/domaine/Montant'
import { ChangeHandler } from '@/utils/ChangeHandler'

import { Label } from '../styled-components'

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
		<div>
			<Label id={`rémunération-label-${idSuffix}`}>
				{t(
					'pages.assistants.cmg.GED.rémunération.label',
					'Rémunération totale'
				)}
			</Label>
			<MontantField
				value={valeur}
				unité="Euro"
				onChange={onChange}
				aria-labelledby={`rémunération-label-${idSuffix}`}
			/>
		</div>
	)
}
