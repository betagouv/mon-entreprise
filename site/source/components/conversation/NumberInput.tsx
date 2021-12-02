import { NumberFieldProps } from '@react-types/numberfield'
import { EngineContext } from 'Components/utils/EngineContext'
import { NumberField } from 'DesignSystem/field'
import { ASTNode, serializeUnit, Unit } from 'publicodes'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { debounce } from '../../utils'
import InputSuggestions from './InputSuggestions'
import { InputProps } from './RuleInput'

export default function NumberInput({
	suggestions,
	onChange,
	onSubmit,
	value,
	missing,
	unit,
	formatOptions,
	displayedUnit,
	...fieldProps
}: InputProps & {
	unit?: Unit
}) {
	const unité = serializeUnit(unit)
	const [currentValue, setCurrentValue] = useState<number | undefined>(
		!missing && value != null && typeof value === 'number' ? value : undefined
	)
	const { i18n, t } = useTranslation()
	displayedUnit =
		displayedUnit ??
		(unit && getSerializedUnit(currentValue ?? 0, unit, i18n.language, t))
	const engine = useContext(EngineContext)
	useEffect(() => {
		if (value !== currentValue) {
			setCurrentValue(
				!missing && value != null && typeof value === 'number'
					? value
					: undefined
			)
		}
	}, [value])
	formatOptions = {
		style: 'decimal',
		...(unit?.numerators.includes('€')
			? {
					style: 'currency',
					currency: 'EUR',
					minimumFractionDigits: 0,
			  }
			: {}),
		...formatOptions,
	}
	const debouncedOnChange = useCallback(debounce(1000, onChange), [])
	return (
		<StyledNumberInput>
			<NumberField
				{...(fieldProps as NumberFieldProps)}
				description=""
				displayedUnit={displayedUnit}
				onChange={(valeur) => {
					setCurrentValue(valeur)
					if (valeur != null && unité) {
						debouncedOnChange({ valeur, unité })
					} else {
						debouncedOnChange(valeur)
					}
				}}
				formatOptions={formatOptions}
				placeholder={
					missing && value != null && typeof value === 'number'
						? value
						: undefined
				}
				value={currentValue}
			/>
			<InputSuggestions
				suggestions={suggestions}
				onFirstClick={(node: ASTNode) => {
					const evaluatedNode = engine.evaluate(node)
					if (serializeUnit(evaluatedNode.unit) === serializeUnit(unit)) {
						setCurrentValue(evaluatedNode.nodeValue as number)
					}
					setImmediate(() => {
						onChange(node)
					})
				}}
				onSecondClick={() => onSubmit?.('suggestion')}
			/>
		</StyledNumberInput>
	)
}

// TODO : put this inside publicodes
function getSerializedUnit(
	value: number,
	unit: Unit,
	locale: string,
	t: (s?: string) => string | undefined
): string {
	// removing euro, which is a currency not a unit
	unit = {
		...unit,
		numerators: unit.numerators.filter((unit) => unit !== '€'),
	}

	if (Number.isNaN(value)) {
		value = 0
	}

	const formatUnit = getFormatUnit(unit)
	if (!formatUnit) {
		return t(serializeUnit(unit)?.replace('/', 'par')) ?? ''
	}
	return (
		Intl.NumberFormat(locale, {
			unit: formatUnit,
			style: 'unit',
			unitDisplay: 'long',
		})
			.formatToParts(value)
			.find(({ type }) => type === 'unit')?.value ?? ''
	)
}

// https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier
const UNIT_MAP = {
	heure: 'hour',
	jour: 'day',
	année: 'year',
	an: 'year',
	minute: 'minute',
	mois: 'month',
	second: 'second',
	semaine: 'week',
} as const

function getFormatUnit(unit: Unit): Intl.NumberFormatOptions['unit'] | null {
	if (unit.numerators.length !== 1 || unit.denominators.length > 1) {
		return null
	}
	const numerator = unit.numerators[0]
	const denominator = unit.denominators[0]
	if (
		(numerator && !(numerator in UNIT_MAP)) ||
		(denominator && !(denominator in UNIT_MAP))
	) {
		return null
	}

	let formatUnit = ''
	if (numerator) {
		formatUnit += UNIT_MAP[numerator as keyof typeof UNIT_MAP]
	}
	if (denominator) {
		formatUnit += `-per-${UNIT_MAP[denominator as keyof typeof UNIT_MAP]}`
	}
	return formatUnit
}

const StyledNumberInput = styled.div`
	display: flex;
	width: fit-content;
	flex: 1;
	flex-direction: column;
	max-width: 300px;
	width: 100%;
	align-items: flex-end;
`
