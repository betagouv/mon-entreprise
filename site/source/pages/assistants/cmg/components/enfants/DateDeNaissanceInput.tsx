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

	const htmlForId = `date-de-naissance-label-${idSuffix}`

	return (
		<div>
			<Label id={htmlForId}>
				{t(
					'pages.assistants.cmg.enfants.date-de-naissance.label',
					'Date de naissance au format JJ/MM/AAAA'
				)}
			</Label>
			<DateField
				id={htmlForId}
				defaultSelected={O.getOrUndefined(valeur)}
				onChange={(date) => onChange(O.fromNullable(date))}
				aria-labelledby={`date-de-naissance-label-${idSuffix}`}
			/>
		</div>
	)
}
