import React from 'react'
import { memoizeWith } from 'ramda'
import { serialiseUnit } from 'Engine/units'

const NumberFormat = memoizeWith(JSON.stringify, Intl.NumberFormat)

let numberFormatter = style => (value, language) =>
	NumberFormat(language, {
		style,
		currency: 'EUR',
		maximumFractionDigits: 2,
		minimumFractionDigits: 2
	}).format(value)

let booleanTranslations = {
	fr: { true: 'Oui', false: 'Non' },
	en: { true: 'Yes', false: 'No' }
}

let formats = {
	'€': numberFormatter('currency'),
	boolean: (value, language = 'fr') => booleanTranslations[language][value],
	object: value => JSON.stringify(value)
}

export default ({ nodeValue, unit }) => {
	let valueType = typeof nodeValue,
		unitText = unit && serialiseUnit(unit)
	return nodeValue == undefined ? null : (
		<div
			css={`
				border: 2px dashed chartreuse
				font-family: 'Courier New', Courier, monospace;
					`}>
			{(formats[valueType !== 'number' ? valueType : unitText] ||
				numberFormatter('decimal'))(nodeValue)}
			&nbsp;
			{unit && unitText}
		</div>
	)
}
