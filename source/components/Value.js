import { React, T } from 'Components'
import { memoizeWith } from 'ramda'
import { serialiseUnit } from 'Engine/units'
import withLanguage from './utils/withLanguage'

const NumberFormat = memoizeWith(
	(...args) => JSON.stringify(args),
	Intl.NumberFormat
)

export let numberFormatter = (style, numFractionDigits) => (value, language) =>
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

let style = customStyle => `
		font-family: 'Courier New', Courier, monospace;

		${customStyle}
`

export default withLanguage(
	({
		nodeValue: value,
		unit,
		nilValueSymbol,
		numFractionDigits = 2,
		children,
		negative,
		language,
		customCSS = ''
	}) => {
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
				) : unitText === '€' ? (
					numberFormatter('currency', numFractionDigits)(nodeValue, language)
				) : unitText === '%' ? (
					numberFormatter('percent')(nodeValue)
				) : (
					<>
						{numberFormatter('decimal', numFractionDigits)(nodeValue)}
						&nbsp;
						{unitText}
					</>
				)

		return nodeValue == undefined ? null : (
			<span css={style(customCSS)} className="value">
				{negative ? '-' : ''}
				{formattedValue}
			</span>
		)
	}
)
