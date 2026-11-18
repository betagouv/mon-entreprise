import { describe, expect, it } from 'vitest'

import {
	englishPathFrom,
	RouteDirectory,
	translatedPaths,
} from '../build/translatedPaths'

const dossier = (
	name: string,
	reste: Partial<Omit<RouteDirectory, 'name'>> = {}
): RouteDirectory => ({
	name,
	servesAPage: false,
	children: [],
	...reste,
})

const page = (
	name: string,
	reste: Partial<Omit<RouteDirectory, 'name' | 'servesAPage'>> = {}
): RouteDirectory => dossier(name, { ...reste, servesAPage: true })

describe('translatedPaths', () => {
	it('associe le chemin anglais déclaré au chemin français du dossier', () => {
		expect(
			translatedPaths([page('salary-net', { englishPath: 'salary' })])
		).toEqual([{ fr: '/salary-net', en: '/salary' }])
	})

	it("n'émet rien pour une route dont les deux chemins sont identiques", () => {
		expect(translatedPaths([page('documentation')])).toEqual([])
	})

	it("n'émet rien pour un dossier sans page, mais traverse ses enfants", () => {
		expect(
			translatedPaths([
				dossier('simulateurs', {
					englishPath: 'calculators',
					children: [page('salaire-brut-net', { englishPath: 'salary' })],
				}),
			])
		).toEqual([
			{ fr: '/simulateurs/salaire-brut-net', en: '/calculators/salary' },
		])
	})

	it("ne compte pas un route group comme un segment d'URL", () => {
		expect(
			translatedPaths([
				dossier('(main)', {
					children: [page('salaire-brut-net', { englishPath: 'salary' })],
				}),
			])
		).toEqual([{ fr: '/salaire-brut-net', en: '/salary' }])
	})

	it('traduit un segment dynamique dans la syntaxe des rewrites', () => {
		expect(
			translatedPaths([
				dossier('simulateurs', {
					englishPath: 'calculators',
					children: [page('[simulateur]')],
				}),
			])
		).toEqual([
			{ fr: '/simulateurs/:simulateur', en: '/calculators/:simulateur' },
		])
	})

	it('traduit un catch-all, obligatoire ou optionnel', () => {
		expect(
			translatedPaths([
				dossier('documentation', {
					englishPath: 'docs',
					children: [page('[...slug]'), page('[[...reste]]')],
				}),
			])
		).toEqual([
			{ fr: '/documentation/:slug*', en: '/docs/:slug*' },
			{ fr: '/documentation/:reste*', en: '/docs/:reste*' },
		])
	})

	it('place les routes statiques avant les routes dynamiques', () => {
		expect(
			translatedPaths([
				dossier('simulateurs', {
					englishPath: 'calculators',
					children: [
						page('[simulateur]'),
						page('salaire-brut-net', { englishPath: 'salary' }),
					],
				}),
			])
		).toEqual([
			{ fr: '/simulateurs/salaire-brut-net', en: '/calculators/salary' },
			{ fr: '/simulateurs/:simulateur', en: '/calculators/:simulateur' },
		])
	})
})

describe('englishPathFrom', () => {
	it('retourne le chemin déclaré', () => {
		expect(englishPathFrom({ englishPath: 'salary' }, 'path.ts')).toBe('salary')
	})

	it.each([
		['un export absent', {}],
		['un export vide', { englishPath: '' }],
		['un export qui n’est pas une chaîne', { englishPath: 42 }],
		['un module absent', undefined],
	])('refuse %s en nommant le fichier fautif', (_, declaration) => {
		expect(() => englishPathFrom(declaration, 'app/x/path.ts')).toThrow(
			'app/x/path.ts'
		)
	})
})
