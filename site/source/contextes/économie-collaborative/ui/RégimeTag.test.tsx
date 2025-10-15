import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { RegimeCotisation } from '@/contextes/économie-collaborative/domaine/location-de-meublé/situation'
import { DesignSystemThemeProvider } from '@/design-system'

import { RégimeTag } from './RégimeTag'

const renderWithTheme = (component: React.ReactElement) =>
	render(<DesignSystemThemeProvider>{component}</DesignSystemThemeProvider>)

describe('RégimeTag', () => {
	it("affiche l'abréviation par défaut", () => {
		renderWithTheme(<RégimeTag régime={RegimeCotisation.microEntreprise} />)

		expect(screen.getByText('AE')).toBeInTheDocument()
	})

	it('affiche le libellé complet quand demandé', () => {
		renderWithTheme(
			<RégimeTag régime={RegimeCotisation.regimeGeneral} affichage="libellé" />
		)

		expect(screen.getByText('Régime général')).toBeInTheDocument()
	})

	it('affiche toujours une icône', () => {
		const { container } = renderWithTheme(
			<RégimeTag régime={RegimeCotisation.travailleurIndependant} />
		)

		const svg = container.querySelector('svg')
		expect(svg).toBeInTheDocument()
	})

	it("affiche un titre sur l'abréviation pour le libellé complet", () => {
		renderWithTheme(
			<RégimeTag régime={RegimeCotisation.travailleurIndependant} />
		)

		const abbr = screen.getByText('TI').closest('abbr')
		expect(abbr).toHaveAttribute('title', 'Travailleur indépendant')
	})
})
