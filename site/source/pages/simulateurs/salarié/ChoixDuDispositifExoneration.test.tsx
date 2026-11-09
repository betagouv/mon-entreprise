import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TestProvider } from '@/test/TestProvider'

import SalariéSimulation from './Salarié'

const DÉLAI = { timeout: 30_000 }
const DURÉE_MAXIMALE = 120_000

type Utilisateur = ReturnType<typeof userEvent.setup>

const COMMUNES = {
	Lyon: {
		code: '69123',
		nom: 'Lyon',
		codesPostaux: ['69001'],
		departement: { code: '69', nom: 'Rhône' },
		region: { code: '84', nom: 'Auvergne-Rhône-Alpes' },
	},
	'Pointe-à-Pitre': {
		code: '97120',
		nom: 'Pointe-à-Pitre',
		codesPostaux: ['97110'],
		departement: { code: '971', nom: 'Guadeloupe' },
		region: { code: '01', nom: 'Guadeloupe' },
	},
	Mamoudzou: {
		code: '97611',
		nom: 'Mamoudzou',
		codesPostaux: ['97600'],
		departement: { code: '976', nom: 'Mayotte' },
		region: { code: '06', nom: 'Mayotte' },
	},
}

type NomDeCommune = keyof typeof COMMUNES

const apiDesCommunes = (adresse: string) => {
	const url = new URL(adresse)
	const parCode = Object.values(COMMUNES).find((commune) =>
		url.pathname.endsWith(`/${commune.code}`)
	)
	if (parCode) {
		return Response.json({ ...parCode, _score: 1 })
	}
	const nom = (url.searchParams.get('nom') ?? '').trim()

	return Response.json(
		Object.values(COMMUNES)
			.filter((commune) => commune.nom.startsWith(nom))
			.map((commune) => ({ ...commune, _score: 1 }))
	)
}

const ouvrirLeSimulateur = async () => {
	window.history.replaceState(null, '', '/')
	const utilisateur = userEvent.setup()
	render(
		<TestProvider>
			<SalariéSimulation />
		</TestProvider>
	)
	await screen.findByRole('textbox', { name: /coût total employeur/i }, DÉLAI)

	return utilisateur
}

const saisirLeSalaireBrut = async (
	utilisateur: Utilisateur,
	montant: string
) => {
	const champ = screen.getByRole('textbox', { name: /^Salaire brut/ })
	await utilisateur.clear(champ)
	await utilisateur.type(champ, montant)
}

const choisirLaCommune = async (
	utilisateur: Utilisateur,
	commune: NomDeCommune
) => {
	await utilisateur.click(
		await screen.findByRole(
			'button',
			{ name: 'Aller à la question : Commune' },
			DÉLAI
		)
	)
	await utilisateur.type(
		await screen.findByRole('combobox', { name: /commune/i }, DÉLAI),
		commune
	)
	await utilisateur.click(
		await screen.findByRole(
			'option',
			{ name: new RegExp(`^${commune}`) },
			DÉLAI
		)
	)
}

const fermerLesFenêtres = async (utilisateur: Utilisateur) => {
	for (let essai = 0; essai < 5; essai++) {
		if (!screen.queryAllByRole('dialog').length) {
			return
		}
		await utilisateur.keyboard('{Escape}')
	}
	expect(screen.queryAllByRole('dialog')).toHaveLength(0)
}

const ouvrirMesRéponses = async (utilisateur: Utilisateur) => {
	await fermerLesFenêtres(utilisateur)
	await utilisateur.click(
		(
			await screen.findAllByRole(
				'button',
				{ name: /modifier mes réponses/i },
				DÉLAI
			)
		)[0]
	)

	return screen.findByRole('dialog', {}, DÉLAI)
}

const ouvrirLaQuestion = async (utilisateur: Utilisateur, titre: string) => {
	const réponses = await ouvrirMesRéponses(utilisateur)
	await utilisateur.click(
		await within(réponses).findByRole(
			'button',
			{ name: `Modifier ${titre}` },
			DÉLAI
		)
	)

	return screen.findByRole('dialog', { name: `Modifier ${titre}` }, DÉLAI)
}

const répondre = async (
	utilisateur: Utilisateur,
	titre: string,
	réponse: string | RegExp
) => {
	const question = await ouvrirLaQuestion(utilisateur, titre)
	await utilisateur.click(
		within(question).getByRole('radio', { name: réponse })
	)
	await utilisateur.click(
		within(question).getByRole('button', { name: 'Continuer' })
	)
	await fermerLesFenêtres(utilisateur)
}

const répondreNonAuxBarèmesLodeom = async (utilisateur: Utilisateur) => {
	await répondre(utilisateur, 'Barème de compétitivité renforcée', 'Non')
	await répondre(utilisateur, 'Barème d’innovation et croissance', 'Non')
}

const coûtTotalEmployeur = () =>
	screen
		.getByRole<HTMLInputElement>('textbox', { name: /coût total employeur/i })
		.value.replace(/\s/g, ' ')

const attendreLeCoûtTotal = (montant: string) =>
	waitFor(() => expect(coûtTotalEmployeur()).toBe(montant), DÉLAI)

const mention = () => screen.queryByText(/Dispositif d’exonération :/)

const questionDuDispositifProposée = async (utilisateur: Utilisateur) => {
	const réponses = await ouvrirMesRéponses(utilisateur)
	const bouton = within(réponses).queryByRole('button', {
		name: 'Modifier Dispositif d’exonération',
	})
	await fermerLesFenêtres(utilisateur)

	return bouton !== null
}

const optionsDuDispositif = async (utilisateur: Utilisateur) => {
	const question = await ouvrirLaQuestion(
		utilisateur,
		'Dispositif d’exonération'
	)
	const options = within(question)
		.getAllByRole<HTMLInputElement>('radio')
		.map((option) => option.labels?.[0]?.textContent?.trim())
	await fermerLesFenêtres(utilisateur)

	return options
}

const choisirLeDispositif = (utilisateur: Utilisateur, dispositif: RegExp) =>
	répondre(utilisateur, 'Dispositif d’exonération', dispositif)

describe('Choix du dispositif d’exonération dans le simulateur salarié', () => {
	beforeEach(() => {
		vi.useFakeTimers({ toFake: ['Date'] })
		vi.setSystemTime(new Date(2026, 10, 9))
		const vraiFetch = globalThis.fetch
		vi.stubGlobal('fetch', (adresse: string, options?: RequestInit) => {
			if (String(adresse).startsWith('https://geo.api.gouv.fr/communes')) {
				return Promise.resolve(apiDesCommunes(String(adresse)))
			}
			if (String(adresse).includes('versement-mobilit')) {
				return Promise.resolve(Response.json({}))
			}

			return vraiFetch(adresse, options)
		})
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	describe('À Lyon, sans JEI', () => {
		const saisir = async () => {
			const utilisateur = await ouvrirLeSimulateur()
			await saisirLeSalaireBrut(utilisateur, '2000')
			await choisirLaCommune(utilisateur, 'Lyon')
			await attendreLeCoûtTotal('2 249 €')

			return utilisateur
		}

		it(
			'applique la RGDU et le mentionne sous le coût total employeur',
			async () => {
				await saisir()

				expect(mention()).toHaveTextContent(
					'Dispositif d’exonération : Réduction générale dégressive unique (RGDU)'
				)
			},
			DURÉE_MAXIMALE
		)

		it(
			'ne demande pas de choisir, un seul dispositif étant éligible',
			async () => {
				const utilisateur = await saisir()

				expect(await questionDuDispositifProposée(utilisateur)).toBe(false)
			},
			DURÉE_MAXIMALE
		)
	})

	describe('À Lyon, pour une jeune entreprise innovante', () => {
		const saisir = async () => {
			const utilisateur = await ouvrirLeSimulateur()
			await saisirLeSalaireBrut(utilisateur, '2000')
			await choisirLaCommune(utilisateur, 'Lyon')
			await répondre(utilisateur, 'JEI', 'Oui')
			await attendreLeCoûtTotal('2 300 €')

			return utilisateur
		}

		it(
			'applique la JEI par défaut',
			async () => {
				await saisir()

				expect(mention()).toHaveTextContent(
					'Dispositif d’exonération : Exonération jeune entreprise innovante (JEI)'
				)
			},
			DURÉE_MAXIMALE
		)

		it(
			'propose de choisir entre la JEI et la RGDU',
			async () => {
				const utilisateur = await saisir()

				expect(await optionsDuDispositif(utilisateur)).toStrictEqual([
					'Exonération jeune entreprise innovante (JEI)',
					'Réduction générale dégressive unique (RGDU)',
				])
			},
			DURÉE_MAXIMALE
		)

		it(
			'applique la RGDU quand l’usager la choisit',
			async () => {
				const utilisateur = await saisir()

				await choisirLeDispositif(utilisateur, /RGDU/)

				await attendreLeCoûtTotal('2 249 €')
				expect(mention()).toHaveTextContent(
					'Dispositif d’exonération : Réduction générale dégressive unique (RGDU)'
				)
			},
			DURÉE_MAXIMALE
		)
	})

	describe('À Pointe-à-Pitre, sans JEI', () => {
		const saisir = async () => {
			const utilisateur = await ouvrirLeSimulateur()
			await saisirLeSalaireBrut(utilisateur, '2000')
			await choisirLaCommune(utilisateur, 'Pointe-à-Pitre')
			await répondreNonAuxBarèmesLodeom(utilisateur)
			await attendreLeCoûtTotal('2 082 €')

			return utilisateur
		}

		it(
			'applique le Lodeom par défaut',
			async () => {
				await saisir()

				expect(mention()).toHaveTextContent(
					'Dispositif d’exonération : Exonération Lodeom'
				)
			},
			DURÉE_MAXIMALE
		)

		it(
			'propose de choisir entre le Lodeom et la RGDU, sans la JEI',
			async () => {
				const utilisateur = await saisir()

				expect(await optionsDuDispositif(utilisateur)).toStrictEqual([
					'Exonération Lodeom',
					'Réduction générale dégressive unique (RGDU)',
				])
			},
			DURÉE_MAXIMALE
		)

		it(
			'applique la RGDU quand l’usager la choisit',
			async () => {
				const utilisateur = await saisir()

				await choisirLeDispositif(utilisateur, /RGDU/)

				await attendreLeCoûtTotal('2 249 €')
				expect(mention()).toHaveTextContent(
					'Dispositif d’exonération : Réduction générale dégressive unique (RGDU)'
				)
			},
			DURÉE_MAXIMALE
		)
	})

	describe('À Pointe-à-Pitre, pour une jeune entreprise innovante', () => {
		const saisir = async () => {
			const utilisateur = await ouvrirLeSimulateur()
			await saisirLeSalaireBrut(utilisateur, '2000')
			await choisirLaCommune(utilisateur, 'Pointe-à-Pitre')
			await répondreNonAuxBarèmesLodeom(utilisateur)
			await répondre(utilisateur, 'JEI', 'Oui')
			await attendreLeCoûtTotal('2 300 €')

			return utilisateur
		}

		it(
			'applique la JEI par défaut',
			async () => {
				await saisir()

				expect(mention()).toHaveTextContent(
					'Dispositif d’exonération : Exonération jeune entreprise innovante (JEI)'
				)
			},
			DURÉE_MAXIMALE
		)

		it(
			'propose de choisir entre la JEI, le Lodeom et la RGDU',
			async () => {
				const utilisateur = await saisir()

				expect(await optionsDuDispositif(utilisateur)).toStrictEqual([
					'Exonération jeune entreprise innovante (JEI)',
					'Exonération Lodeom',
					'Réduction générale dégressive unique (RGDU)',
				])
			},
			DURÉE_MAXIMALE
		)
	})

	describe('À Lyon, au-delà de 3 Smic', () => {
		it(
			'n’applique ni ne propose aucun dispositif',
			async () => {
				const utilisateur = await ouvrirLeSimulateur()
				await saisirLeSalaireBrut(utilisateur, '10000')
				await choisirLaCommune(utilisateur, 'Lyon')
				await attendreLeCoûtTotal('14 325 €')

				expect(mention()).not.toBeInTheDocument()
				expect(await questionDuDispositifProposée(utilisateur)).toBe(false)
			},
			DURÉE_MAXIMALE
		)
	})

	describe('Pour un stage', () => {
		it(
			'n’applique ni ne propose aucun dispositif',
			async () => {
				const utilisateur = await ouvrirLeSimulateur()
				await saisirLeSalaireBrut(utilisateur, '700')
				await répondre(utilisateur, 'Contrat', /stage/i)
				await attendreLeCoûtTotal('732 €')

				expect(mention()).not.toBeInTheDocument()
				expect(await questionDuDispositifProposée(utilisateur)).toBe(false)
			},
			DURÉE_MAXIMALE
		)
	})

	describe('À Mamoudzou, sans JEI', () => {
		const saisir = async () => {
			const utilisateur = await ouvrirLeSimulateur()
			await saisirLeSalaireBrut(utilisateur, '2000')
			await choisirLaCommune(utilisateur, 'Mamoudzou')
			await répondreNonAuxBarèmesLodeom(utilisateur)
			await attendreLeCoûtTotal('2 138 €')

			return utilisateur
		}

		it(
			'applique le Lodeom par défaut',
			async () => {
				await saisir()

				expect(mention()).toHaveTextContent(
					'Dispositif d’exonération : Exonération Lodeom'
				)
			},
			DURÉE_MAXIMALE
		)

		it(
			'applique la RGDU quand l’usager la choisit',
			async () => {
				const utilisateur = await saisir()

				await choisirLeDispositif(utilisateur, /RGDU/)

				await attendreLeCoûtTotal('2 441 €')
				expect(mention()).toHaveTextContent(
					'Dispositif d’exonération : Réduction générale dégressive unique (RGDU)'
				)
			},
			DURÉE_MAXIMALE
		)
	})

	describe('À Mamoudzou, pour une jeune entreprise innovante', () => {
		const saisir = async () => {
			const utilisateur = await ouvrirLeSimulateur()
			await saisirLeSalaireBrut(utilisateur, '2000')
			await choisirLaCommune(utilisateur, 'Mamoudzou')
			await répondreNonAuxBarèmesLodeom(utilisateur)
			await répondre(utilisateur, 'JEI', 'Oui')
			await attendreLeCoûtTotal('2 150 €')

			return utilisateur
		}

		it(
			'propose de choisir entre la JEI, le Lodeom et la RGDU',
			async () => {
				const utilisateur = await saisir()

				expect(await optionsDuDispositif(utilisateur)).toStrictEqual([
					'Exonération jeune entreprise innovante (JEI)',
					'Exonération Lodeom',
					'Réduction générale dégressive unique (RGDU)',
				])
			},
			DURÉE_MAXIMALE
		)

		it(
			'coûte moins cher sous le Lodeom que sous la JEI appliquée par défaut',
			async () => {
				const utilisateur = await saisir()

				await choisirLeDispositif(utilisateur, /Lodeom/)

				await attendreLeCoûtTotal('2 138 €')
				expect(mention()).toHaveTextContent(
					'Dispositif d’exonération : Exonération Lodeom'
				)
			},
			DURÉE_MAXIMALE
		)
	})
})
