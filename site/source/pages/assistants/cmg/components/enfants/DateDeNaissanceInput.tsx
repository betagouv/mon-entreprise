import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import { DateField } from '@/design-system'
import { ChangeHandler } from '@/utils/ChangeHandler'

import { Label } from '../styled-components'

type Props = {
	idSuffix?: string
	valeur: O.Option<Date>
	onChange: ChangeHandler<O.Option<Date>>
}

export default function DateDeNaissanceInput({
	idSuffix,
	valeur,
	onChange,
}: Props) {
	const { t } = useTranslation()

	return (
		<div>
			<Label id={`date-de-naissance-label-${idSuffix}`}>
				{t(
					'pages.assistants.cmg.enfants.date-de-naissance.label',
					'Date de naissance'
				)}
			</Label>
			<DateField
				defaultSelected={O.getOrUndefined(valeur)}
				onChange={(date) => onChange(O.fromNullable(date))}
				aria-labelledby={`date-de-naissance-label-${idSuffix}`}
			/>
		</div>
	)
}
