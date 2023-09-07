// import { useEngine } from '../utils/EngineContext'
import { useWorkerEngine } from '@publicodes/worker-react'
import { useCallback } from 'react'

import { InputProps } from '@/components/conversation/RuleInput'
import { DateField } from '@/design-system/field'
import { DateFieldProps } from '@/design-system/field/DateField'

import InputSuggestions from './InputSuggestions'

export default function DateInput({
	suggestions,
	onChange,
	missing,
	title,
	onSubmit,
	required,
	value,
	type,
}: InputProps & { type: DateFieldProps['type'] }) {
	const engine = useWorkerEngine()

	const convertDate = (val?: unknown) => {
		if (!val || typeof val !== 'string') {
			return undefined
		}
		const [day, month, year] = val.split('/')

		return `${year}-${month}-${day}`
	}

	const handleDateChange = useCallback(
		(value?: string) => {
			if (!value) {
				return onChange(undefined)
			}
			onChange(value)
		},
		[onChange]
	)

	const dateValue = convertDate(value)

	return (
		<div className="step input">
			<div>
				{suggestions && (
					<InputSuggestions
						suggestions={suggestions}
						onFirstClick={async (node) => {
							const value = await engine.asyncEvaluate(node)
							handleDateChange(
								'nodeValue' in value && typeof value.nodeValue === 'string'
									? value.nodeValue
									: undefined
							)
						}}
						onSecondClick={() => {
							onSubmit?.('suggestion')
						}}
					/>
				)}
				<DateField
					defaultSelected={
						missing || !dateValue ? undefined : new Date(dateValue)
					}
					isRequired={required}
					onChange={handleDateChange}
					aria-label={title}
					label={title}
					type={type}
				/>
			</div>
		</div>
	)
}
