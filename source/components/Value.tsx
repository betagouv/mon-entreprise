import classnames from 'classnames'
import { formatValue, formatValueOptions } from 'Engine/format'
import { EvaluatedRule } from 'Engine/types'
import { Unit } from 'Engine/units'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

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
	Pick<EvaluatedRule, 'nodeValue'> &
		Pick<
			formatValueOptions,
			'maximumFractionDigits' | 'minimumFractionDigits'
		> & {
			nilValueSymbol: string
			children: number
			negative: boolean
			unit: string | Unit
			customCSS: string
			className?: string
		}
>

export default function Value({
	nodeValue: value,
	unit,
	nilValueSymbol,
	maximumFractionDigits,
	minimumFractionDigits,
	children,
	className,
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
			<span css={style(customCSS)} className={classnames('value', className)}>
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
		<span css={style(customCSS)} className={classnames('value', className)}>
			{negative ? '-' : ''}
			{formattedValue}
		</span>
	)
}
