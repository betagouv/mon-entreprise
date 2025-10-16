import { render, screen } from '@testing-library/react'
import { ReactElement } from 'react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'

import i18n from '@/locales/i18n'

import { DesignSystemThemeProvider } from '../root'
import { StatusCard } from './StatusCard'

const renderWithTheme = (component: ReactElement) => {
	return render(
		<I18nextProvider i18n={i18n}>
			<DesignSystemThemeProvider>{component}</DesignSystemThemeProvider>
		</I18nextProvider>
	)
}

describe('StatusCard', () => {
	it('affiche le titre principal', () => {
		renderWithTheme(
			<StatusCard>
				<StatusCard.Titre>Titre principal</StatusCard.Titre>
			</StatusCard>
		)

		expect(screen.getByText('Titre principal')).toBeInTheDocument()
	})

	it('affiche plusieurs étiquettes', () => {
		renderWithTheme(
			<StatusCard>
				<StatusCard.Étiquette>Étiquette 1</StatusCard.Étiquette>
				<StatusCard.Étiquette>Étiquette 2</StatusCard.Étiquette>
				<StatusCard.Titre>Titre</StatusCard.Titre>
			</StatusCard>
		)

		expect(screen.getByText('Étiquette 1')).toBeInTheDocument()
		expect(screen.getByText('Étiquette 2')).toBeInTheDocument()
	})

	it('affiche le titre et valeur secondaire', () => {
		renderWithTheme(
			<StatusCard>
				<StatusCard.Titre>1 645 €/mois</StatusCard.Titre>
				<StatusCard.ValeurSecondaire>
					(invalidité partielle)
				</StatusCard.ValeurSecondaire>
			</StatusCard>
		)

		expect(screen.getByText('1 645 €/mois')).toBeInTheDocument()
		expect(screen.getByText('(invalidité partielle)')).toBeInTheDocument()
	})

	it('affiche les actions', () => {
		renderWithTheme(
			<StatusCard>
				<StatusCard.Titre>Titre</StatusCard.Titre>
				<StatusCard.Action>
					<button>Action</button>
				</StatusCard.Action>
			</StatusCard>
		)

		expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
	})

	it('affiche la médaille pour la meilleure option', () => {
		renderWithTheme(
			<StatusCard isBestOption>
				<StatusCard.Titre>Meilleure option</StatusCard.Titre>
			</StatusCard>
		)

		expect(screen.getByTitle('Option la plus avantageuse.')).toBeInTheDocument()
	})

	it("n'affiche pas la médaille si ce n'est pas la meilleure option", () => {
		renderWithTheme(
			<StatusCard isBestOption={false}>
				<StatusCard.Titre>Option normale</StatusCard.Titre>
			</StatusCard>
		)

		expect(
			screen.queryByTitle('Option la plus avantageuse.')
		).not.toBeInTheDocument()
	})

	it('peut avoir plusieurs actions', () => {
		renderWithTheme(
			<StatusCard>
				<StatusCard.Titre>Titre</StatusCard.Titre>
				<StatusCard.Action>
					<button>Action 1</button>
				</StatusCard.Action>
				<StatusCard.Action>
					<button>Action 2</button>
				</StatusCard.Action>
			</StatusCard>
		)

		expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument()
	})

	it('fonctionne avec uniquement un titre', () => {
		renderWithTheme(
			<StatusCard>
				<StatusCard.Titre>Titre seul</StatusCard.Titre>
			</StatusCard>
		)

		expect(screen.getByText('Titre seul')).toBeInTheDocument()
	})

	it("les sous-composants peuvent être donnés dans n'importe quel ordre", () => {
		const { container } = renderWithTheme(
			<StatusCard>
				<StatusCard.Action>Action</StatusCard.Action>
				<StatusCard.Complément>Complément</StatusCard.Complément>
				<StatusCard.ValeurSecondaire>
					Valeur secondaire
				</StatusCard.ValeurSecondaire>
				<StatusCard.Titre>Titre</StatusCard.Titre>
				<StatusCard.Étiquette>Étiquette</StatusCard.Étiquette>
			</StatusCard>
		)

		const fullText = container.textContent || ''
		const etiquetteIndex = fullText.indexOf('Étiquette')
		const titreIndex = fullText.indexOf('Titre')
		const valeurSecondaireIndex = fullText.indexOf('Valeur secondaire')
		const complementIndex = fullText.indexOf('Complément')
		const actionIndex = fullText.indexOf('Action')

		expect(etiquetteIndex).toBeLessThan(titreIndex)
		expect(titreIndex).toBeLessThan(valeurSecondaireIndex)
		expect(valeurSecondaireIndex).toBeLessThan(complementIndex)
		expect(complementIndex).toBeLessThan(actionIndex)
	})
})
