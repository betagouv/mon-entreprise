import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import { NumberField } from '@/design-system'
import { ChangeHandler } from '@/utils/ChangeHandler'

import { Label } from '../styled-components'

type Props = {
	idSuffix?: string
	valeur: O.Option<number>
	onChange: ChangeHandler<O.Option<number>>
}

export default function HeuresDeGardeInput({
	idSuffix,
	valeur,
	onChange,
}: Props) {
	const { t } = useTranslation()

	return (
		<div>
			<Label id={`heures-de-garde-label-${idSuffix}`}>
				{t('pages.assistants.cmg.GED.heures-de-garde.label', 'Heures de garde')}
			</Label>
			<NumberField
				value={O.getOrUndefined(valeur)}
				onChange={(valeur) => onChange(O.fromNullable(valeur))}
				aria-labelledby={`heures-de-garde-label-${idSuffix}`}
			/>
		</div>
	)
}
