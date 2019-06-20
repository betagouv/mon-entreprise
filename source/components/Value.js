import React from 'react'
import { memoizeWith } from 'ramda'
import { serialiseUnit } from 'Engine/units'

const NumberFormat = memoizeWith(
	(...args) => JSON.stringify(args),
	Intl.NumberFormat
)

let numberFormatter = (style, numFractionDigits = 2) => (value, language) =>
	NumberFormat(language, {
		style,
		currency: 'EUR',
		maximumFractionDigits: numFractionDigits,
		minimumFractionDigits: numFractionDigits
	}).format(value)

let booleanTranslations = { true: '✅', false: '✘' }

/* Or maybe this :
let booleanTranslations = {
	fr: { true: 'Oui', false: 'Non' },
	en: { true: 'Yes', false: 'No' }
}
*/

let style = `
		border: 2px dashed chartreuse
		font-family: 'Courier New', Courier, monospace;
`

export default ({
	nodeValue: value,
	unit,
	nilValueSymbol,
	numFractionDigits,
	children,
	negative
}) => {
	/* Either an entire rule object is passed, or just the right attributes and the value as a JSX  child*/
	let nodeValue = value === undefined ? children : value
	let valueType = typeof nodeValue,
		unitText =
			unit !== null && (typeof unit == 'object' ? serialiseUnit(unit) : unit),
		formattedValue =
			valueType === 'object' ? (
				JSON.stringify(nodeValue)
			) : valueType === 'boolean' ? (
				booleanTranslations[nodeValue]
			) : unit === '€' ? (
				numberFormatter('currency', numFractionDigits)(nodeValue)
			) : (
				<>
					{numberFormatter('decimal', numFractionDigits)(nodeValue)}
					&nbsp;
					{unitText}
				</>
			)

	if (
		(nilValueSymbol !== undefined && nodeValue === 0) ||
		Number.isNaN(nodeValue)
	)
		return <span css={style}>-</span>

	return nodeValue == undefined ? null : (
		<span css={style}>
			{negative ? '-' : ''}
			{formattedValue}
		</span>
	)
}
