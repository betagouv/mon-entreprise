import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { TestProvider } from '@/test/TestProvider'

import LodeomSimulation from './Lodeom'

const afficheLeSimulateurEnZoneUn = async () => {
	const utilisateur = userEvent.setup()
	render(
		<TestProvider>
			<LodeomSimulation />
		</TestProvider>
	)

	await utilisateur.click(
		await screen.findByText(
			/Guadeloupe, Guyane, Martinique, La Réunion/,
			{},
			{ timeout: 30000 }
		)
	)
	await utilisateur.click(await screen.findByText(/^Barème de compétitivité$/))

	return utilisateur
}

const nomDeLigne = (mois: string) => new RegExp(`^${mois}`)

const champDeRémunérationDe = async (mois: string) =>
	within(
		await screen.findByRole(
			'row',
			{ name: nomDeLigne(mois) },
			{ timeout: 30000 }
		)
	).getByRole('textbox')

const exonérationDu = (mois: string) => {
	const ligne = screen.getByRole('row', { name: nomDeLigne(mois) })
	const [, exonération] = within(ligne).getAllByRole('cell')

	return Number(
		(exonération.textContent ?? '')
			.replace(/[^\d,.-]/g, '')
			.replace(/\./g, '')
			.replace(',', '.')
	)
}

describe('Simulateur Lodeom', () => {
	it('présente les douze mois dans l’ordre', async () => {
		await afficheLeSimulateurEnZoneUn()
		await champDeRémunérationDe('janvier')

		const tableau = screen.getByRole('table', { name: /mois par mois/ })

		expect(
			within(tableau)
				.getAllByRole('rowheader')
				.map((mois) => mois.textContent)
		).toStrictEqual([
			'janvier',
			'février',
			'mars',
			'avril',
			'mai',
			'juin',
			'juillet',
			'août',
			'septembre',
			'octobre',
			'novembre',
			'décembre',
		])
	}, 120000)

	it('calcule l’exonération dès la saisie d’une rémunération', async () => {
		const utilisateur = await afficheLeSimulateurEnZoneUn()

		await utilisateur.type(await champDeRémunérationDe('janvier'), '3500')

		await waitFor(
			() => {
				expect(exonérationDu('janvier')).toBeGreaterThan(0)
			},
			{ timeout: 30000 }
		)
	}, 120000)

	it('tient compte des saisies successives sur plusieurs mois', async () => {
		const utilisateur = await afficheLeSimulateurEnZoneUn()

		await utilisateur.type(await champDeRémunérationDe('janvier'), '3500')
		await waitFor(
			() => {
				expect(exonérationDu('janvier')).toBeGreaterThan(0)
			},
			{ timeout: 30000 }
		)
		const janvierSeul = exonérationDu('janvier')

		await utilisateur.type(await champDeRémunérationDe('février'), '3000')

		await waitFor(
			() => {
				expect(exonérationDu('février')).toBeGreaterThan(0)
			},
			{ timeout: 30000 }
		)
		expect(exonérationDu('janvier')).toBeCloseTo(janvierSeul, 2)
	}, 120000)
})
