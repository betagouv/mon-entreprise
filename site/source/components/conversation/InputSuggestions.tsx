import { ASTNode } from 'publicodes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Link } from '@/design-system/typography/link'
import { SmallBody } from '@/design-system/typography/paragraphs'

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
						role="button"
						aria-label={t('Insérer dans le champ la valeur du {{text}}', text)}
						$textColor={(theme) => theme.colors.extended.grey[100]}
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
