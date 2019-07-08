import { React, T } from 'Components'
import { serialiseUnit } from 'Engine/units'
import { memoizeWith } from 'ramda'
import withLanguage from './utils/withLanguage'

const NumberFormat = memoizeWith(
	(...args) => JSON.stringify(args),
	Intl.NumberFormat
)

export let numberFormatter = ({
	style,
	maximumFractionDigits,
	minimumFractionDigits = 0,
	language
}) => value =>
	NumberFormat(language, {
		style,
		currency: 'EUR',
		maximumFractionDigits,
		minimumFractionDigits
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
		maximumFractionDigits,
		minimumFractionDigits,
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
					numberFormatter({
						style: 'currency',
						maximumFractionDigits,
						minimumFractionDigits,
						language
					})(nodeValue)
				) : unitText === '%' ? (
					numberFormatter({ style: 'percent', maximumFractionDigits: 3 })(
						nodeValue
					)
				) : (
					<>
						{numberFormatter({
							style: 'decimal',
							minimumFractionDigits,
							maximumFractionDigits
						})(nodeValue)}
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
