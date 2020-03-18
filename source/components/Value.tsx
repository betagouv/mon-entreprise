import { formatValue, formatValueOptions } from 'Engine/format'
import { Unit } from 'Engine/units'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Evaluation } from 'Types/rule'

// let booleanTranslations = { true: '✅', false: '❌' }

let booleanTranslations = {
	fr: { true: 'Oui', false: 'Non' },
	en: { true: 'Yes', false: 'No' }
}

let style = customStyle => `
		font-family: 'Courier New', Courier, monospace;

		${customStyle}
`

export type ValueProps = Partial<
	Pick<
		formatValueOptions,
		'maximumFractionDigits' | 'minimumFractionDigits'
	> & {
		nodeValue: Evaluation<any>
		unit?: Unit | string
		nilValueSymbol: string
		children: number
		customCSS: string
	}
>

export default function Value({
	nodeValue: value,
	unit,
	maximumFractionDigits,
	minimumFractionDigits,
	children,
	customCSS = ''
}: ValueProps) {
	const { language } = useTranslation().i18n

	/* Either an entire rule object is passed, or just the right attributes and the value as a JSX  child*/
	value = value === undefined ? children : value

	if (value === undefined) {
		return null
	}

	if (
		(value && Number.isNaN(value)) ||
		value === null ||
		(value === false && unit)
	) {
		return (
			<span css={style(customCSS)} className="value">
				—
			</span>
		)
	}

	const formattedValue =
		typeof value === 'string' ? (
			<Trans>{value}</Trans>
		) : typeof value === 'object' ? (
			(value as any).nom
		) : typeof value === 'boolean' ? (
			booleanTranslations[language][value]
		) : value !== undefined ? (
			formatValue({
				minimumFractionDigits,
				maximumFractionDigits,
				language,
				unit,
				value
			})
		) : null

	return (
		<span css={style(customCSS)} className="value">
			{formattedValue}
		</span>
	)
}
