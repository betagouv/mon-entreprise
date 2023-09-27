import { lazy, Suspense, useCallback, useMemo } from 'react'
import { styled } from 'styled-components'

import { InputProps } from '@/components/conversation/RuleInput'
import { DateFieldProps } from '@/design-system/field/DateField'
import { Spacing } from '@/design-system/layout'

import Skeleton from '../ui/Skeleton'
import { useEngine } from '../utils/EngineContext'
import InputSuggestions from './InputSuggestions'

const DateField = lazy(() => import('@/design-system/field/DateField'))

export default function DateInput({
	suggestions,
	onChange,
	missing,
	title,
	hideDefaultValue,
	onSubmit,
	required,
	value,
	type,
}: InputProps & { type: DateFieldProps['type'] }) {
	const engine = useEngine()

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

	const dateValue = useMemo(() => new Date(convertDate(value) ?? NaN), [value])

	return (
		<div className="step input">
			<div>
				{suggestions && (
					<InputSuggestions
						suggestions={suggestions}
						onFirstClick={(node) => {
							const value = engine.evaluate(node)

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
				<Suspense fallback={<DateFieldFallback />}>
					<DateField
						defaultSelected={
							(missing && hideDefaultValue) || !isNaN(+dateValue)
								? undefined
								: dateValue
						}
						isRequired={required}
						onChange={handleDateChange}
						aria-label={title}
						label={title}
						type={type}
					/>
				</Suspense>
				<Spacing md />
			</div>
		</div>
	)
}
function DateFieldFallback() {
	return <Wrapper />
}

const Wrapper = styled(Skeleton)`
	width: 218px;

	height: 3.5rem;
`
