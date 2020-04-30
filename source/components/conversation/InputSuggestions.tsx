import { toPairs } from 'ramda'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { serializeUnit, Unit } from '../../engine/units'

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
	const { t } = useTranslation()

	return (
		<div
			className="ui__ notice"
			css={`
				display: flex;
				align-items: baseline;
				margin-top: 0.2rem;
			`}
		>
			{toPairs(suggestions).map(([text, value]: [string, number]) => {
				const valueWithUnit = `${value} ${
					unit ? serializeUnit(unit)?.replace(' / ', '/') : ''
				}`
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
