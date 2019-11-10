import { T } from 'Components'
import { formatValue, formatValueOptions } from 'Engine/format'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Rule } from 'Types/rule'

// let booleanTranslations = { true: '✅', false: '❌' }

let booleanTranslations = {
	fr: { true: 'Oui', false: 'Non' },
	en: { true: 'Yes', false: 'No' }
}

let style = customStyle => `
		font-family: 'Courier New', Courier, monospace;

		${customStyle}
`

type ValueProps = Partial<
	Pick<Rule, 'nodeValue' | 'unit'> &
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
		Number.isNaN(nodeValue) ||
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
				<T>{nodeValue}</T>
			) : valueType === 'object' ? (
				(nodeValue as any).nom
			) : valueType === 'boolean' ? (
				booleanTranslations[language][nodeValue]
			) : (
				formatValue({
					minimumFractionDigits,
					maximumFractionDigits,
					language,
					unit,
					value: nodeValue
				})
			)

	return nodeValue == undefined ? null : (
		<span css={style(customCSS)} className="value">
			{negative ? '-' : ''}
			{formattedValue}
		</span>
	)
}
