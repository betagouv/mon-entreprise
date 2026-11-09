import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TestProvider } from '@/test/TestProvider'

import LodeomSimulation from './Lodeom'

const DÉLAI = { timeout: 30_000 }

const ligneDe = (mois: string) =>
	screen.getByRole('row', { name: new RegExp(`^${mois}`) })

const exonérationDe = (mois: string) => {
	const [, exonération] = within(ligneDe(mois)).getAllByRole('cell')

	return Number(
		(exonération.textContent ?? '')
			.replace(/[^\d,.-]/g, '')
			.replace(/\./g, '')
			.replace(',', '.')
	)
}

const saisirJuilletÀMayotte = async () => {
	window.history.replaceState(null, '', '/')
	const utilisateur = userEvent.setup()
	render(
		<TestProvider>
			<LodeomSimulation />
		</TestProvider>
	)

	await utilisateur.click(await screen.findByText(/^Mayotte$/, {}, DÉLAI))
	await utilisateur.click(await screen.findByText(/^Barème de compétitivité$/))
	await utilisateur.type(
		within(
			await screen.findByRole('row', { name: /^juillet/ }, DÉLAI)
		).getByRole('textbox'),
		'2000'
	)
	await waitFor(
		() => expect(exonérationDe('juillet')).toBeGreaterThan(0),
		DÉLAI
	)

	return utilisateur
}

describe('Simulateur Lodeom à Mayotte', () => {
	beforeEach(() => {
		vi.useFakeTimers({ toFake: ['Date'] })
		vi.setSystemTime(new Date(2026, 10, 9))
	})

	it('ne demande pas si l’employeur est éligible à l’exonération JEI, puisqu’il simule le Lodeom', async () => {
		const utilisateur = await saisirJuilletÀMayotte()

		expect(
			screen.queryByRole('button', { name: 'Aller à la question : JEI' })
		).not.toBeInTheDocument()

		await utilisateur.click(
			screen.getByRole('button', { name: /modifier mes réponses/i })
		)
		const réponses = await screen.findByRole('dialog', {}, DÉLAI)

		expect(
			within(réponses).queryByRole('button', { name: 'Modifier JEI' })
		).not.toBeInTheDocument()
	}, 120_000)
})
