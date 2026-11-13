// @vitest-environment happy-dom
import {
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { plausibleService } from './plausibleService'

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }))

vi.mock('plausible-tracker', async (importOriginal) => {
	const { default: Plausible } =
		await importOriginal<typeof import('plausible-tracker')>()

	return {
		default: (...options: Parameters<typeof Plausible>) => ({
			...Plausible(...options),
			trackEvent,
		}),
	}
})

const ajouteUnLien = async (attributs: Record<string, string>) => {
	const lien = document.createElement('a')
	Object.entries(attributs).forEach(([nom, valeur]) =>
		lien.setAttribute(nom, valeur)
	)
	lien.textContent = 'lien'
	document.body.appendChild(lien)
	// Laisse aux éventuels MutationObserver le temps de traiter le nouveau lien
	await new Promise((resolve) => setTimeout(resolve))

	return lien
}

const clique = (élément: Element) => {
	let navigationAnnulée: boolean | undefined
	const intercepteNavigation = (event: Event) => {
		navigationAnnulée = event.defaultPrevented
		// Empêche happy-dom de suivre réellement le lien
		event.preventDefault()
	}
	window.addEventListener('click', intercepteNavigation)
	élément.dispatchEvent(
		new MouseEvent('click', { bubbles: true, cancelable: true })
	)
	window.removeEventListener('click', intercepteNavigation)

	return { navigationAnnulée }
}

describe('plausibleService', () => {
	beforeAll(() => {
		plausibleService.initialize()
	})

	beforeEach(() => {
		trackEvent.mockClear()
	})

	afterEach(() => {
		document.body.innerHTML = ''
	})

	describe('au clic sur un lien sortant', () => {
		it('laisse le navigateur ouvrir le lien comme prévu, par exemple dans une nouvelle fenêtre', async () => {
			const lien = await ajouteUnLien({
				href: 'https://www.lassuranceretraite.fr/',
				target: '_blank',
			})

			expect(clique(lien).navigationAnnulée).toBe(false)
		})

		it('envoie un événement Plausible avec l’URL du lien', async () => {
			const lien = await ajouteUnLien({
				href: 'https://www.lassuranceretraite.fr/',
				target: '_blank',
			})

			clique(lien)

			expect(trackEvent).toHaveBeenCalledWith('Outbound Link: Click', {
				props: { url: 'https://www.lassuranceretraite.fr/' },
			})
		})

		it('envoie l’événement même si la propagation du clic est stoppée', async () => {
			const lien = await ajouteUnLien({
				href: 'https://www.lassuranceretraite.fr/',
				target: '_blank',
			})
			lien.addEventListener('click', (event) => {
				event.stopPropagation()
				event.preventDefault()
			})

			lien.dispatchEvent(
				new MouseEvent('click', { bubbles: true, cancelable: true })
			)

			expect(trackEvent).toHaveBeenCalledWith('Outbound Link: Click', {
				props: { url: 'https://www.lassuranceretraite.fr/' },
			})
		})
	})

	it('n’envoie pas d’événement de lien sortant au clic sur un lien interne', async () => {
		const lien = await ajouteUnLien({ href: '/simulateurs/salarié' })

		clique(lien)

		expect(trackEvent).not.toHaveBeenCalledWith(
			'Outbound Link: Click',
			expect.anything()
		)
	})
})
