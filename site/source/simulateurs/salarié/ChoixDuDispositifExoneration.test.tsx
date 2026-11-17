import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TestProvider } from '@/test/TestProvider'

import { Salarié } from './Salarié'

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

const simuler = async (salaireBrut: string, commune: NomDeCommune) => {
	window.history.replaceState(null, '', '/')
	const utilisateur = userEvent.setup()
	render(
		<TestProvider>
			<Salarié />
		</TestProvider>
	)
	const champDuSalaire = await screen.findByRole(
		'textbox',
		{ name: /^Salaire brut/ },
		DÉLAI
	)
	await utilisateur.clear(champDuSalaire)
	await utilisateur.type(champDuSalaire, salaireBrut)

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

	return utilisateur
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

const coûtTotalEmployeur = () =>
	screen
		.getByRole<HTMLInputElement>('textbox', { name: /coût total employeur/i })
		.value.replace(/\s/g, ' ')

const attendreLeCoûtTotal = (montant: string) =>
	waitFor(() => expect(coûtTotalEmployeur()).toBe(montant), DÉLAI)

const mention = () =>
	screen
		.queryAllByRole('link')
		.find(
			(lien) =>
				lien.getAttribute('href') ===
				"/documentation/salarié/dispositif-d'exonération/avantage"
		)

const texteDeLaMention = () =>
	mention()?.textContent?.replace(/\s+/g, ' ').trim()

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

const SUIVANT_OU_PASSER = { name: /^(Suivant|Passer),/ }

const zoneDeLaQuestion = () =>
	screen
		.queryAllByRole('status')
		.find((zone) => zone.textContent && !/^Étape/.test(zone.textContent))

const répondreAuxQuestionsDansLOrdre = async (
	utilisateur: Utilisateur,
	réponses: Array<[RegExp, string]>
) => {
	const questionsPosées: string[] = []
	let zone = zoneDeLaQuestion()
	while (zone && screen.queryAllByRole('button', SUIVANT_OU_PASSER).length) {
		const question = zone.textContent ?? ''
		questionsPosées.push(question)
		const réponse = réponses.find(([intitulé]) => intitulé.test(question))
		if (réponse) {
			await utilisateur.click(
				within(zone).getByRole('radio', { name: réponse[1] })
			)
		}
		await utilisateur.click(screen.getAllByRole('button', SUIVANT_OU_PASSER)[0])
		await waitFor(
			() => expect(zoneDeLaQuestion()?.textContent).not.toBe(question),
			DÉLAI
		)
		zone = zoneDeLaQuestion()
	}

	return questionsPosées
}

const QUESTION_JEI = /Jeune Entreprise Innovante/
const QUESTION_DU_CHOIX = /Quel dispositif d’exonération/
const QUESTION_DU_LODEOM =
	/^Êtes-vous éligible au barème|secteurs éligibles Lodeom/

const rangDe = (questions: string[], intitulé: RegExp) =>
	questions.findIndex((question) => intitulé.test(question))

describe('Choix du dispositif d’exonération dans le simulateur salarié', () => {
	beforeEach(() => {
		vi.useFakeTimers({ toFake: ['Date'] })
		vi.setSystemTime(new Date(2026, 10, 9))
		vi.stubGlobal(
			'Worker',
			class {
				postMessage() {}
				terminate() {}
				addEventListener() {}
				removeEventListener() {}
			}
		)
		const vraiFetch = globalThis.fetch
		vi.stubGlobal('fetch', (adresse: string, options?: RequestInit) => {
			if (String(adresse).startsWith('https://geo.api.gouv.fr/communes')) {
				return Promise.resolve(apiDesCommunes(String(adresse)))
			}
			if (
				String(adresse).includes('versement-mobilit') ||
				String(adresse).includes('taux-collectifs')
			) {
				return Promise.resolve(Response.json({}))
			}

			return vraiFetch(adresse, options)
		})
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	describe('À Lyon', () => {
		it(
			'mentionne la RGDU sous le coût total employeur, sans demander de choisir',
			async () => {
				const utilisateur = await simuler('2000', 'Lyon')
				await attendreLeCoûtTotal('2 249 €')

				expect(texteDeLaMention()).toBe('dont dispositif RGDU : − 629 €')
				expect(await questionDuDispositifProposée(utilisateur)).toBe(false)
			},
			DURÉE_MAXIMALE
		)

		it(
			'ne mentionne aucun dispositif au-delà de 3 Smic',
			async () => {
				await simuler('10000', 'Lyon')
				await attendreLeCoûtTotal('14 325 €')

				expect(mention()).toBeUndefined()
			},
			DURÉE_MAXIMALE
		)
	})

	describe('À Pointe-à-Pitre', () => {
		it(
			'applique le Lodeom par défaut et laisse l’usager choisir la RGDU à la place',
			async () => {
				const utilisateur = await simuler('2000', 'Pointe-à-Pitre')
				await répondre(utilisateur, 'Barème de compétitivité renforcée', 'Non')
				await répondre(utilisateur, 'Barème d’innovation et croissance', 'Non')
				await attendreLeCoûtTotal('2 082 €')
				expect(texteDeLaMention()).toBe('dont dispositif Lodéom : − 796 €')

				expect(await optionsDuDispositif(utilisateur)).toStrictEqual([
					'Exonération Lodeom',
					'Réduction générale dégressive unique (RGDU)',
				])

				await répondre(utilisateur, 'Dispositif d’exonération', /RGDU/)

				await attendreLeCoûtTotal('2 249 €')
				expect(texteDeLaMention()).toBe('dont dispositif RGDU : − 629 €')
			},
			DURÉE_MAXIMALE
		)

		it(
			'ne mentionne aucun dispositif quand le Lodeom n’apporte aucun avantage',
			async () => {
				const utilisateur = await simuler('7000', 'Pointe-à-Pitre')
				await répondre(utilisateur, 'Barème de compétitivité renforcée', 'Non')
				await répondre(utilisateur, 'Barème d’innovation et croissance', 'Non')
				await attendreLeCoûtTotal('10 035 €')

				expect(mention()).toBeUndefined()
			},
			DURÉE_MAXIMALE
		)
	})

	describe('Quand l’usager répond aux questions dans l’ordre', () => {
		it(
			'pose les questions du Lodeom avant celle de la JEI, puis demande quel dispositif appliquer',
			async () => {
				const utilisateur = await simuler('2000', 'Pointe-à-Pitre')

				const questions = await répondreAuxQuestionsDansLOrdre(utilisateur, [
					[QUESTION_JEI, 'Oui'],
				])

				const rangDeLaJEI = rangDe(questions, QUESTION_JEI)
				expect(
					rangDe(questions, /barème d’innovation et croissance/)
				).toBeGreaterThan(-1)
				expect(
					questions
						.slice(rangDeLaJEI + 1)
						.filter((question) => QUESTION_DU_LODEOM.test(question))
				).toStrictEqual([])
				expect(rangDe(questions, QUESTION_DU_CHOIX)).toBeGreaterThan(
					rangDeLaJEI
				)
			},
			DURÉE_MAXIMALE
		)

		it(
			'demande si l’entreprise relève d’un secteur éligible au Lodeom avant de demander la JEI, quand l’effectif dépasse 10 salariés',
			async () => {
				const utilisateur = await simuler('2000', 'Pointe-à-Pitre')

				const questions = await répondreAuxQuestionsDansLOrdre(utilisateur, [
					[/effectif/, 'Entre 11 et 19'],
					[QUESTION_JEI, 'Oui'],
				])

				const rangDuSecteur = rangDe(questions, /secteurs éligibles Lodeom/)
				expect(rangDuSecteur).toBeGreaterThan(-1)
				expect(rangDuSecteur).toBeLessThan(rangDe(questions, QUESTION_JEI))
			},
			DURÉE_MAXIMALE
		)
	})
})
