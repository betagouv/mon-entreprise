import { pipe } from 'effect'
import * as O from 'effect/Option'
import { DottedName } from 'modele-social'
import { ASTNode } from 'publicodes'

import { useEngine } from '@/components/utils/EngineContext'
import {
	DateField,
	DateFieldProps,
	InputSuggestions,
	InputSuggestionsRecord,
	Spacing,
} from '@/design-system'
import {
	dateToIsoDate,
	isIsoDate,
	IsoDate,
	isPublicodesStandardDate,
	parseIsoDateString,
	publicodesDateToIsoDate,
} from '@/domaine/Date'
import { PublicodesAdapter } from '@/domaine/engine/PublicodesAdapter'
import { NoOp } from '@/utils/NoOp'

interface DateInputProps {
	id?: string
	dottedName: DottedName
	value?: IsoDate
	onChange?: (value: IsoDate | undefined) => void
	missing?: boolean
	hideDefaultValue?: boolean
	onSubmit?: (source?: string) => void
	suggestions?: InputSuggestionsRecord<IsoDate | ASTNode>

	title?: string
	type: DateFieldProps['type']

	aria?: {
		labelledby?: string
	}
}

export const DateInput = ({
	id,
	suggestions = {},
	onChange = NoOp,
	missing,
	title,
	hideDefaultValue,
	onSubmit,
	value,
	type,
	aria = {},
}: DateInputProps) => {
	const engine = useEngine()

	const handleDateChange = (value?: Date) => {
		if (!value) {
			return onChange(undefined)
		}
		onChange(value && dateToIsoDate(value))
	}

	const handleSuggestion = (value?: IsoDate) => {
		onChange(value)
	}

	return (
		<div className="step input">
			<div>
				{suggestions && (
					<InputSuggestions
						suggestions={suggestions}
						onFirstClick={(valeur) => {
							if (isIsoDate(valeur)) {
								return handleSuggestion(valeur)
							}
							if (isPublicodesStandardDate(valeur)) {
								return handleSuggestion(publicodesDateToIsoDate(valeur))
							}

							const dateÉvaluée = pipe(
								engine.evaluate(valeur),
								PublicodesAdapter.decode,
								O.getOrUndefined
							) as IsoDate | undefined

							handleSuggestion(dateÉvaluée)
						}}
						onSecondClick={() => {
							onSubmit?.('suggestion')
						}}
					/>
				)}
				<DateField
					id={id}
					aria-labelledby={aria.labelledby}
					defaultSelected={
						(missing && hideDefaultValue) || value === undefined
							? undefined
							: parseIsoDateString(value)
					}
					onChange={handleDateChange}
					label={title}
					type={type}
				/>
				<Spacing md />
			</div>
		</div>
	)
}
