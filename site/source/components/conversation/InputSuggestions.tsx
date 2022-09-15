import { Link } from '@/design-system/typography/link'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { ASTNode } from 'publicodes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

type InputSuggestionsProps = {
	suggestions?: Record<string, ASTNode>
	onFirstClick: (val: ASTNode) => void
	onSecondClick?: (val: ASTNode) => void
	className?: string
}

export default function InputSuggestions({
	suggestions = {},
	onSecondClick = (x) => x,
	onFirstClick,
	className,
}: InputSuggestionsProps) {
	const [suggestion, setSuggestion] = useState<ASTNode>()
	const { t } = useTranslation()
	if (!suggestions || !Object.keys(suggestions).length) {
		return null
	}

	return (
		<StyledInputSuggestion className={className}>
			{Object.entries(suggestions).map(([text, value]: [string, ASTNode]) => {
				return (
					<Link
						key={text}
						onPress={() => {
							onFirstClick(value)
							if (suggestion !== value) {
								setSuggestion(value)
							} else {
								onSecondClick && onSecondClick(value)
							}
						}}
						aria-label={`${t('Insérer la suggestion')} : ${text}`}
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
	> * {
		white-space: nowrap;
	}
	gap: ${({ theme }) => theme.spacings.sm};
	flex-wrap: wrap;
`
