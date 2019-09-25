import { React, T } from 'Components'
import { serialiseUnit } from 'Engine/units'
import { useTranslation } from 'react-i18next'
import { formatValue } from 'Engine/format'

// let booleanTranslations = { true: '✅', false: '❌' }

let booleanTranslations = {
	fr: { true: 'Oui', false: 'Non' },
	en: { true: 'Yes', false: 'No' }
}

let style = customStyle => `
		font-family: 'Courier New', Courier, monospace;

		${customStyle}
`

export default function Value({
	nodeValue: value,
	unit,
	nilValueSymbol,
	maximumFractionDigits,
	minimumFractionDigits,
	children,
	negative,
	customCSS = ''
}) {
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
		unitText =
			unit !== null && (typeof unit == 'object' ? serialiseUnit(unit) : unit),
		formattedValue =
			valueType === 'string' ? (
				<T>{nodeValue}</T>
			) : valueType === 'object' ? (
				nodeValue.nom
			) : valueType === 'boolean' ? (
				booleanTranslations[language][nodeValue]
			) : (
				formatValue({
					minimumFractionDigits,
					maximumFractionDigits,
					language,
					value: nodeValue,
					unit: unitText
				})
			)

	return nodeValue == undefined ? null : (
		<span css={style(customCSS)} className="value">
			{negative ? '-' : ''}
			{formattedValue}
		</span>
	)
}
