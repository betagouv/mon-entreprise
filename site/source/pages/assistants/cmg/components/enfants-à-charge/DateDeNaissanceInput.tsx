import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import { Body, DateField } from '@/design-system'
import { ChangeHandler } from '@/utils/ChangeHandler'

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
		<>
			<Body id={`date-de-naissance-label-${idSuffix}`}>
				{t(
					'pages.assistants.cmg.questions.date-de-naissance.label',
					'Date de naissance'
				)}
			</Body>
			<DateField
				defaultSelected={O.getOrUndefined(valeur)}
				onChange={(date) => onChange(O.fromNullable(date))}
				aria-labelledby={`date-de-naissance-label-${idSuffix}`}
			/>
		</>
	)
}
