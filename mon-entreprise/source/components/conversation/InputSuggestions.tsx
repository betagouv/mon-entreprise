import { Link } from 'DesignSystem/typography/link'
import { SmallBody } from 'DesignSystem/typography/paragraphs'
import { ASTNode } from 'publicodes'
import { toPairs } from 'ramda'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

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
		<StyledInputSuggestion>
			{toPairs(suggestions).map(([text, value]: [string, ASTNode]) => {
				return (
					<Link
						key={text}
						onPress={() => {
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
		</StyledInputSuggestion>
	)
}

const StyledInputSuggestion = styled(SmallBody)`
	display: flex;
	gap: ${({ theme }) => theme.spacings.sm};
`
