import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { RegimeCotisation } from '@/contextes/économie-collaborative'
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

	it("affiche un titre sur l'abréviation pour le libellé complet", () => {
		renderWithTheme(
			<RégimeTag régime={RegimeCotisation.travailleurIndependant} />
		)

		expect(
			screen.getByTitle('Sécurité Sociale des Indépendants')
		).toBeInTheDocument()
		expect(
			screen.getByTitle('Sécurité Sociale des Indépendants')
		).toHaveTextContent('SSI')
	})
})
