import { formatValue, formatValueOptions } from 'Engine/format'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { EvaluatedRule } from 'Types/rule'

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
	Pick<EvaluatedRule, 'nodeValue' | 'unit'> &
		Pick<
			formatValueOptions,
			'maximumFractionDigits' | 'minimumFractionDigits'
		> & {
			nilValueSymbol: string
			children: number
			negative: boolean
			customCSS: string
		}
>

export default function Value({
	nodeValue: value,
	unit,
	nilValueSymbol,
	maximumFractionDigits,
	minimumFractionDigits,
	children,
	negative,
	customCSS = ''
}: ValueProps) {
	const { language } = useTranslation().i18n

	/* Either an entire rule object is passed, or just the right attributes and the value as a JSX  child*/
	let nodeValue = value === undefined ? children : value

	if (
		(nilValueSymbol !== undefined && nodeValue === 0) ||
		(nodeValue && Number.isNaN(nodeValue)) ||
		nodeValue === null
	)
		return (
			<span css={style(customCSS)} className="value">
				-
			</span>
		)
	let valueType = typeof nodeValue,
		formattedValue =
			valueType === 'string' ? (
				<Trans>{nodeValue}</Trans>
			) : valueType === 'object' ? (
				(nodeValue as any).nom
			) : valueType === 'boolean' ? (
				booleanTranslations[language][nodeValue]
			) : nodeValue !== undefined ? (
				formatValue({
					minimumFractionDigits,
					maximumFractionDigits,
					language,
					unit,
					value: nodeValue
				})
			) : null
	return nodeValue == undefined ? null : (
		<span css={style(customCSS)} className="value">
			{negative ? '-' : ''}
			{formattedValue}
		</span>
	)
}
