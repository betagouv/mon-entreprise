import { ASTNode } from 'publicodes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Spacing } from '@/design-system/layout'
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
		return <Spacing md />
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
						type="button" // To avoid submitting the form
						aria-label={t('Insérer dans le champ la valeur du {{text}}', {
							text,
						})}
					>
						{text}
					</Link>
				)
			})}
		</StyledInputSuggestion>
	)
}

export const StyledInputSuggestion = styled(SmallBody)`
	display: flex;
	> * {
		white-space: nowrap;
	}
	gap: ${({ theme }) => theme.spacings.sm};
	flex-wrap: wrap;
`
