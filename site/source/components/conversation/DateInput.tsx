import { ASTNode, EvaluatedNode, PublicodesExpression } from 'publicodes'
import { lazy, Suspense, useCallback, useMemo } from 'react'
import { styled } from 'styled-components'

import { useEngine } from '@/components/utils/EngineContext'
import { DateFieldProps } from '@/design-system/field/DateField'
import { Spacing } from '@/design-system/layout'

import Skeleton from '../ui/Skeleton'
import InputSuggestions from './InputSuggestions'

const DateField = lazy(() => import('@/design-system/field/DateField'))

interface DateInputProps {
	value: EvaluatedNode['nodeValue']
	onChange: (value: PublicodesExpression | undefined) => void
	missing?: boolean
	hideDefaultValue?: boolean
	onSubmit?: (source?: string) => void
	suggestions?: Record<string, ASTNode>

	title?: string
	type: DateFieldProps['type']

	aria?: {
		labelledby?: string
		label?: string
	}
}

export const DateInput = ({
	suggestions = {},
	onChange,
	missing,
	title,
	hideDefaultValue,
	onSubmit,
	value,
	type,
	aria = {},
}: DateInputProps) => {
	const engine = useEngine()

	const convertDate = (val?: unknown) => {
		if (!val || typeof val !== 'string') {
			return undefined
		}
		const [day, month, year] = val.split('/')

		return `${year}-${month}-${day}T12:00:00`
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
				<Suspense fallback={<Wrapper />}>
					<DateField
						aria-label={aria.label ?? title}
						aria-labelledby={aria.labelledby}
						defaultSelected={
							(missing && hideDefaultValue) || isNaN(+dateValue)
								? undefined
								: dateValue
						}
						onChange={handleDateChange}
						label={title}
						type={type}
					/>
				</Suspense>
				<Spacing md />
			</div>
		</div>
	)
}

const Wrapper = styled(Skeleton)`
	width: 218px;
	height: 3.5rem;
`
