import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReactElement } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Item } from 'react-stately'
import { describe, expect, it } from 'vitest'

import i18n from '@/locales/i18n'

import { DesignSystemThemeProvider } from '../root'
import { Accordion } from './'

const renderWithTheme = (component: ReactElement) => {
	return render(
		<I18nextProvider i18n={i18n}>
			<DesignSystemThemeProvider>{component}</DesignSystemThemeProvider>
		</I18nextProvider>
	)
}

describe('Accordion', () => {
	it('garde toutes les sections repliées après « Tout déplier » puis « Tout plier »', async () => {
		const user = userEvent.setup()
		renderWithTheme(
			<Accordion title="Titre" isFoldable>
				<Item key="a" title="Section A" hasChildItems={false}>
					Contenu A
				</Item>
				<Item key="b" title="Section B" hasChildItems={false}>
					Contenu B
				</Item>
			</Accordion>
		)

		await user.click(screen.getByRole('button', { name: 'Tout déplier' }))
		await user.click(await screen.findByRole('button', { name: 'Tout plier' }))
		await waitFor(() =>
			expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute(
				'aria-expanded',
				'false'
			)
		)
		// Laisse s'écouler les délais du composant : les sections ne doivent pas se rouvrir
		await new Promise((resolve) => setTimeout(resolve, 300))

		expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute(
			'aria-expanded',
			'false'
		)
		expect(screen.getByRole('button', { name: 'Section B' })).toHaveAttribute(
			'aria-expanded',
			'false'
		)
	})
})
