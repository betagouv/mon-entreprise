import { NumberField } from 'DesignSystem/field'
import { serializeUnit, Unit } from 'publicodes'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { debounce } from '../../utils'
import InputSuggestions from './InputSuggestions'
import { InputProps } from './RuleInput'

export default function NumberInput({
	suggestions,
	onChange,
	onSubmit,
	value,
	formatOptions,
	missing,
	unit,
	autoFocus,
}: InputProps & {
	unit: Unit | undefined
}) {
	const unité = serializeUnit(unit)
	const [currentValue, handleChange] = useState<number | undefined>(
		!missing && value != null && typeof value === 'number' ? value : undefined
	)
	const language = useTranslation().i18n.language
	const displayedUnit =
		unit && getSerializedUnit(currentValue ?? 0, unit, language)

	useEffect(() => {
		if (!missing && value != null && typeof value === 'number') {
			handleChange(value)
		}
	}, [value])
	formatOptions = {
		style: 'decimal',
		...(unit?.numerators.includes('€')
			? {
					style: 'currency',
					currency: 'EUR',
			  }
			: {}),
		...formatOptions,
	}

	const debouncedOnChange = useCallback(debounce(1000, onChange), [])
	return (
		<div className="step input">
			<div>
				<InputSuggestions
					suggestions={suggestions}
					onFirstClick={(value) => {
						handleChange(value)
						setImmediate(() => {
							onChange(value)
						})
					}}
					onSecondClick={() => onSubmit?.('suggestion')}
				/>
				<NumberField
					autoFocus={autoFocus}
					displayedUnit={displayedUnit}
					onChange={(valeur) => {
						handleChange(valeur)
						if (!Number.isNaN(valeur)) {
							debouncedOnChange({ valeur, unité })
						}
					}}
					formatOptions={formatOptions}
					placeholder={missing && value != null ? value : undefined}
					value={currentValue}
				/>
			</div>
		</div>
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
		return serializeUnit(unit) ?? ''
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
