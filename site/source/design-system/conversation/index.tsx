import { ReactNode, useCallback, useRef } from 'react'
import { Trans } from 'react-i18next'
import { styled } from 'styled-components'

import { Button } from '../buttons'
import { Grid } from '../layout'

const Container = styled.div`
	width: 100%;
`

export interface ConversationProps {
	/**
	 * Appelé lorsque l'utilisateur clique sur le bouton "Précédent"
	 */
	onPrevious?: () => void

	/**
	 * Appelé lorsque l'utilisateur clique sur le bouton "Suivant" ou "Passer"
	 */
	onNext: () => void

	/**
	 * Indique si la question actuelle a une réponse
	 */
	questionIsAnswered: boolean

	/**
	 * Désactive le bouton "Précédent" (par exemple pour la première question)
	 */
	isPreviousDisabled?: boolean

	/**
	 * Élément à afficher à droite des boutons de navigation (visualisation de la situation, etc.)
	 */
	customVisualisation?: ReactNode

	/**
	 * Contenu de la question à afficher
	 */
	children?: ReactNode
}

/**
 * Composant de conversation affichant une question avec des boutons de navigation
 */
export function Conversation({
	onPrevious,
	onNext,
	questionIsAnswered,
	isPreviousDisabled = false,
	customVisualisation,
	children,
}: ConversationProps) {
	const formRef = useRef<HTMLFormElement>(null)

	const focusFirstElemInForm = useCallback(() => {
		setTimeout(() => {
			formRef.current
				?.querySelector<HTMLInputElement | HTMLButtonElement | HTMLLinkElement>(
					'input, button, a'
				)
				?.focus()
		}, 5)
	}, [])

	const handlePrevious = useCallback(() => {
		if (onPrevious) {
			onPrevious()
			focusFirstElemInForm()
		}
	}, [focusFirstElemInForm, onPrevious])

	const handleNext = useCallback(() => {
		onNext()
		focusFirstElemInForm()
	}, [focusFirstElemInForm, onNext])

	return (
		<Container>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					handleNext()
				}}
				ref={formRef}
			>
				{children}

				<Grid container spacing={2}>
					{onPrevious && (
						<Grid item xs={6} sm="auto">
							<Button
								color="primary"
								light
								onPress={handlePrevious}
								size="XS"
								isDisabled={isPreviousDisabled}
							>
								<span aria-hidden>←</span> <Trans>Précédent</Trans>
							</Button>
						</Grid>
					)}
					<Grid item xs={6} sm="auto">
						<Button
							size="XS"
							onPress={handleNext}
							light={!questionIsAnswered ? true : undefined}
							aria-label={
								questionIsAnswered
									? 'Suivant, passer à la question suivante'
									: 'Passer, passer la question sans répondre'
							}
						>
							{questionIsAnswered ? (
								<Trans>Suivant</Trans>
							) : (
								<Trans>Passer</Trans>
							)}{' '}
							<span aria-hidden>→</span>
						</Button>
					</Grid>
					{customVisualisation && (
						<Grid
							item
							xs={12}
							sm
							style={{
								justifyContent: 'flex-end',
								display: 'flex',
							}}
						>
							{customVisualisation}
						</Grid>
					)}
				</Grid>
			</form>
		</Container>
	)
}
