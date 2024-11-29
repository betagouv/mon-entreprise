import { NumberFieldProps } from '@react-types/numberfield'
import { ASTNode, parseUnit, serializeUnit, Unit } from 'publicodes'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { EngineContext } from '@/components/utils/EngineContext'
import { NumberField } from '@/design-system/field'
import { debounce } from '@/utils'

import localI18n from '../../locales/i18n'
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
	displaySuggestions = true,
	...fieldProps
}: InputProps & {
	unit?: Unit
	displaySuggestions?: boolean
}) {
	const unité = serializeUnit(unit)
	const [currentValue, setCurrentValue] = useState<number | undefined>(
		!missing && value != null && typeof value === 'number' ? value : undefined
	)
	const { i18n } = useTranslation()
	const parsedDisplayedUnit = displayedUnit ? parseUnit(displayedUnit) : unit
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

	if (parsedDisplayedUnit && parsedDisplayedUnit.numerators.includes('€')) {
		parsedDisplayedUnit.numerators = parsedDisplayedUnit.numerators.filter(
			(u) => u === '€'
		)
		formatOptions = {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: 0,

			...formatOptions,
		}
	} else {
		formatOptions = {
			style: 'decimal',
			...formatOptions,
		}
	}
	const debouncedOnChange = useCallback(debounce(1000, onChange), [])

	return (
		<StyledNumberInput>
			<NumberField
				{...(fieldProps as NumberFieldProps)}
				description=""
				displayedUnit={
					parsedDisplayedUnit &&
					getSerializedUnit(
						currentValue ?? 0,
						parsedDisplayedUnit,
						i18n.language
					)
				}
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
			{displaySuggestions && (
				<InputSuggestions
					className="print-hidden"
					suggestions={suggestions}
					onFirstClick={(node: ASTNode) => {
						const evaluatedNode = engine.evaluate(node)
						if (serializeUnit(evaluatedNode.unit) === serializeUnit(unit)) {
							setCurrentValue(evaluatedNode.nodeValue as number)
						}
						onChange(node)
					}}
					onSecondClick={() => onSubmit?.('suggestion')}
				/>
			)}
		</StyledNumberInput>
	)
}

// TODO : put this inside publicodes
function getSerializedUnit(value: number, unit: Unit, locale: string): string {
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
		const { translatedUnit, translatedPer } = getTranslatedUnit(
			unit,
			locale,
			value >= 2
		)

		return (
			serializeUnit(translatedUnit)
				?.replace(/\/([^\s])/, ' / $1')
				.replace('/', translatedPer)
				.trim() ?? ''
		)
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

function getTranslatedUnit(unit: Unit, locale: string, plural: boolean) {
	const unitsTranslations = Object.entries(
		localI18n.getResourceBundle(locale, 'units') as Record<string, string>
	)
	const getTranslatedUnit = (unit: string, plural: boolean): string => {
		const pluralizedUnit = unit + (plural ? '_plural' : '')
		const key = unitsTranslations
			.find(([unitKey]) => unitKey === pluralizedUnit)?.[1]
			.replace(/_plural$/, '')

		return key || unit
	}

	const translatedUnit = {
		numerators: unit.numerators[0]
			? [getTranslatedUnit(unit.numerators[0], plural)]
			: [],
		denominators: unit.denominators[0]
			? [getTranslatedUnit(unit.denominators[0], false)]
			: [],
	}
	const translatedPer =
		unitsTranslations.find(([key]) => key === 'par')?.[1] || 'par'

	return { translatedUnit, translatedPer }
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
