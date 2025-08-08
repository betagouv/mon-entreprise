import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Spacing } from '../layout'
import { Link } from '../typography/link'
import { Body } from '../typography/paragraphs'

export type InputSuggestionsRecord<T> = Record<string, T>

export type InputSuggestionsProps<T> = {
	suggestions?: InputSuggestionsRecord<T>

	/**
	 * Fonction appelée lors du premier clic sur une suggestion
	 */
	onFirstClick: (val: T) => void

	/**
	 * Fonction appelée lors du second clic sur la même suggestion
	 */
	onSecondClick?: (val: T) => void

	/**
	 * Classe CSS additionnelle
	 */
	className?: string
}

/**
 * Composant qui affiche une liste de suggestions cliquables
 * Le composant gère un état interne pour détecter les clics répétés sur la même suggestion
 */
export function InputSuggestions<T>({
	suggestions = {},
	onSecondClick = ((x: T) => x) as unknown as (val: T) => void,
	onFirstClick,
	className,
}: InputSuggestionsProps<T>) {
	const [suggestion, setSuggestion] = useState<T>()
	const { t } = useTranslation()

	if (!suggestions || !Object.keys(suggestions).length) {
		return <Spacing md />
	}

	return (
		<StyledInputSuggestion className={className}>
			{Object.entries(suggestions).map(([text, value]: [string, T]) => {
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

export const StyledInputSuggestion = styled(Body)`
	display: flex;
	justify-content: flex-end;
	> * {
		white-space: nowrap;
	}
	gap: ${({ theme }) => theme.spacings.sm};
	flex-wrap: wrap;
	margin-top: 0.5rem !important;
`
