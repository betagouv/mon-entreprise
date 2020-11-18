import { serializeValue } from 'publicodes'
import { toPairs } from 'ramda'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Unit } from 'publicodes'

type InputSuggestionsProps = {
	suggestions?: Record<string, number>
	onFirstClick: (val: string) => void
	onSecondClick?: (val: string) => void
	unit?: Unit
}

export default function InputSuggestions({
	suggestions = {},
	onSecondClick = x => x,
	onFirstClick,
	unit
}: InputSuggestionsProps) {
	const [suggestion, setSuggestion] = useState<string | number>()
	const { t, i18n } = useTranslation()

	return (
		<div
			className="ui__ notice"
			css={`
				display: flex;
				align-items: baseline;
				justify-content: flex-end;
				margin-bottom: 0.4rem;
			`}
		>
			{toPairs(suggestions).map(([text, value]: [string, number]) => {
				const valueWithUnit: string = serializeValue(
					{
						nodeValue: value,
						unit
					},
					{ language: i18n.language }
				)
				return (
					<button
						className="ui__ link-button"
						key={value}
						css={`
							margin: 0 0.4rem !important;
							:first-child {
								margin-left: 0rem !important;
							}
						`}
						onClick={() => {
							onFirstClick(valueWithUnit)
							if (suggestion !== value) setSuggestion(valueWithUnit)
							else onSecondClick && onSecondClick(valueWithUnit)
						}}
						title={t('cliquez pour insérer cette suggestion')}
					>
						{text}
					</button>
				)
			})}
		</div>
	)
}
