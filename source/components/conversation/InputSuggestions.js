import { toPairs } from 'ramda'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function InputSuggestions({
	suggestions,
	onSecondClick,
	onFirstClick
}) {
	const [suggestion, setSuggestion] = useState(null)
	const { t } = useTranslation()

	if (!suggestions) return null

	return (
		<div css="display: flex; align-items: baseline; justify-content: flex-end;">
			<small>Suggestions :</small>

			{toPairs(suggestions).map(([text, value]) => {
				return (
					<button
						className="ui__ link-button"
						key={value}
						css="margin: 0 0.4rem !important"
						onClick={() => {
							onFirstClick(value)
							if (suggestion !== value) setSuggestion(value)
							else onSecondClick && onSecondClick(value)
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
