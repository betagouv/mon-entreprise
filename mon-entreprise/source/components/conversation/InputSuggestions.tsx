import { Link } from 'DesignSystem/typography/link'
import { ASTNode } from 'publicodes'
import { toPairs } from 'ramda'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type InputSuggestionsProps = {
	suggestions?: Record<string, ASTNode>
	onFirstClick: (val: ASTNode) => void
	onSecondClick?: (val: ASTNode) => void
}

export default function InputSuggestions({
	suggestions = {},
	onSecondClick = (x) => x,
	onFirstClick,
}: InputSuggestionsProps) {
	const [suggestion, setSuggestion] = useState<ASTNode>()
	const { t } = useTranslation()

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
			{toPairs(suggestions).map(([text, value]: [string, ASTNode]) => {
				return (
					<Link
						key={text}
						onClick={() => {
							onFirstClick(value)
							if (suggestion !== value) setSuggestion(value)
							else onSecondClick && onSecondClick(value)
						}}
						title={t('cliquez pour insérer cette suggestion')}
					>
						{text}
					</Link>
				)
			})}
		</div>
	)
}
