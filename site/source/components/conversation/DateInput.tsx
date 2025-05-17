import { DottedName } from 'modele-social'
import { ASTNode } from 'publicodes'
import { lazy, Suspense } from 'react'
import { styled } from 'styled-components'

import { useEngine } from '@/components/utils/EngineContext'
import { DateFieldProps } from '@/design-system/field/DateField'
import { Spacing } from '@/design-system/layout'
import {
	dateToIsoDate,
	IsoDate,
	isPublicodesStandardDate,
	parseIsoDateString,
	parsePublicodesDateString,
} from '@/domaine/Date'
import { NoOp } from '@/utils/NoOp'

import Skeleton from '../ui/Skeleton'
import InputSuggestions from './InputSuggestions'

const DateField = lazy(() => import('@/design-system/field/DateField'))

interface DateInputProps {
	dottedName: DottedName
	value?: IsoDate
	onChange?: (value: IsoDate | undefined) => void
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

	return (
		<div className="step input">
			<div>
				{suggestions && (
					<InputSuggestions
						suggestions={suggestions}
						onFirstClick={(node) => {
							const value = engine.evaluate(node)

							handleDateChange(
								'nodeValue' in value &&
									typeof value.nodeValue === 'string' &&
									isPublicodesStandardDate(value.nodeValue)
									? parsePublicodesDateString(value.nodeValue)
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
							(missing && hideDefaultValue) || value === undefined
								? undefined
								: parseIsoDateString(value)
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
