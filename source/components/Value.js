import { React, T } from 'Components'
import { memoizeWith } from 'ramda'
import { serialiseUnit } from 'Engine/units'
import withLanguage from './utils/withLanguage'

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

// let booleanTranslations = { true: '✅', false: '❌' }

let booleanTranslations = {
	fr: { true: 'Oui', false: 'Non' },
	en: { true: 'Yes', false: 'No' }
}

let style = `
		font-family: 'Courier New', Courier, monospace;
`

export default withLanguage(
	({
		nodeValue: value,
		unit,
		nilValueSymbol,
		numFractionDigits,
		children,
		negative,
		language
	}) => {
		/* Either an entire rule object is passed, or just the right attributes and the value as a JSX  child*/
		let nodeValue = value === undefined ? children : value
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
				) : unit === '€' ? (
					numberFormatter('currency', numFractionDigits)(nodeValue, language)
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
			return (
				<span css={style} className="value">
					-
				</span>
			)

		return nodeValue == undefined ? null : (
			<span css={style} className="value">
				{negative ? '-' : ''}
				{formattedValue}
			</span>
		)
	}
)
