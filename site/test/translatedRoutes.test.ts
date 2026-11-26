import { describe, expect, it } from 'vitest'

import {
	pageRoutes,
	RouteDirectory,
	routeHrefs,
	translatedRoutes,
} from '../build/translatedRoutes'

const directory = (
	name: string,
	rest: Partial<Omit<RouteDirectory, 'name'>> = {}
): RouteDirectory => ({
	name,
	servesAPage: false,
	children: [],
	...rest,
})

const directoryWithAPage = (
	name: string,
	rest: Partial<Omit<RouteDirectory, 'name' | 'servesAPage'>> = {}
): RouteDirectory => directory(name, { ...rest, servesAPage: true })

const salaireBrutNet = () =>
	directoryWithAPage('salaire-brut-net', { translatedPath: 'salary' })

const simulateurs = (children: RouteDirectory[]) =>
	directory('simulateurs', { translatedPath: 'calculators', children })

describe('translatedRoutes', () => {
	it('associe le chemin traduit déclaré au chemin que donne l’arbre de fichiers', () => {
		expect(translatedRoutes([salaireBrutNet()])).toEqual([
			{ original: '/salaire-brut-net', translated: '/salary' },
		])
	})

	it('n’émet rien pour une route dont les deux chemins sont identiques', () => {
		expect(translatedRoutes([directoryWithAPage('documentation')])).toEqual([])
	})

	it('n’émet rien pour un dossier sans page, mais traverse ses enfants', () => {
		expect(translatedRoutes([simulateurs([salaireBrutNet()])])).toEqual([
			{
				original: '/simulateurs/salaire-brut-net',
				translated: '/calculators/salary',
			},
		])
	})

	it('ne compte pas un route group comme un segment d’URL', () => {
		expect(
			translatedRoutes([directory('(main)', { children: [salaireBrutNet()] })])
		).toEqual([{ original: '/salaire-brut-net', translated: '/salary' }])
	})

	it('ne compte pas un parallel slot comme un segment d’URL, mais traverse ses enfants', () => {
		expect(
			translatedRoutes([directory('@modal', { children: [salaireBrutNet()] })])
		).toEqual([{ original: '/salaire-brut-net', translated: '/salary' }])
	})

	it('ignore un private folder et tout ce qu’il contient', () => {
		expect(
			translatedRoutes([directory('_lib', { children: [salaireBrutNet()] })])
		).toEqual([])
	})

	it.each([['(.)photo'], ['(..)photo'], ['(...)photo']])(
		'ignore la route interceptée %s, dont l’URL appartient à la route interceptée',
		(name) => {
			expect(
				translatedRoutes([simulateurs([directoryWithAPage(name)])])
			).toEqual([])
		}
	)

	it('traduit un segment dynamique dans la syntaxe des rewrites', () => {
		expect(
			translatedRoutes([simulateurs([directoryWithAPage('[simulateur]')])])
		).toEqual([
			{
				original: '/simulateurs/:simulateur',
				translated: '/calculators/:simulateur',
			},
		])
	})

	it.each([
		['[...slug]', ':slug*'],
		['[[...slug]]', ':slug*'],
	])('traduit le catch-all %s en %s', (name, pattern) => {
		expect(translatedRoutes([simulateurs([directoryWithAPage(name)])])).toEqual(
			[
				{
					original: `/simulateurs/${pattern}`,
					translated: `/calculators/${pattern}`,
				},
			]
		)
	})

	it('refuse qu’un segment dynamique déclare un chemin traduit', () => {
		expect(() =>
			translatedRoutes([
				simulateurs([
					directoryWithAPage('[simulateur]', { translatedPath: 'calculator' }),
				]),
			])
		).toThrow('[simulateur]')
	})

	it('place les routes statiques avant les routes dynamiques', () => {
		expect(
			translatedRoutes([
				simulateurs([directoryWithAPage('[simulateur]'), salaireBrutNet()]),
			])
		).toEqual([
			{
				original: '/simulateurs/salaire-brut-net',
				translated: '/calculators/salary',
			},
			{
				original: '/simulateurs/:simulateur',
				translated: '/calculators/:simulateur',
			},
		])
	})

	it('place les routes dynamiques avant les catch-all, qui matchent plus large', () => {
		expect(
			translatedRoutes([
				simulateurs([
					directoryWithAPage('[...reste]'),
					directoryWithAPage('[simulateur]'),
				]),
			])
		).toEqual([
			{
				original: '/simulateurs/:simulateur',
				translated: '/calculators/:simulateur',
			},
			{
				original: '/simulateurs/:reste*',
				translated: '/calculators/:reste*',
			},
		])
	})

	it('traduit le préfixe d’une route dont la feuille n’est pas traduite', () => {
		expect(
			translatedRoutes([simulateurs([directoryWithAPage('artisan')])])
		).toEqual([
			{ original: '/simulateurs/artisan', translated: '/calculators/artisan' },
		])
	})
})

describe('pageRoutes', () => {
	it('énumère une route sans traduction, dont les deux chemins sont identiques', () => {
		expect(pageRoutes([directoryWithAPage('documentation')])).toEqual([
			{ original: '/documentation', translated: '/documentation' },
		])
	})

	it('n’énumère pas un dossier sans page', () => {
		expect(pageRoutes([simulateurs([])])).toEqual([])
	})

	it('donne la racine pour une page servie par un route group de premier niveau', () => {
		expect(pageRoutes([directoryWithAPage('(main)')])).toEqual([
			{ original: '/', translated: '/' },
		])
	})
})

describe('routeHrefs', () => {
	const routes = () => pageRoutes([simulateurs([salaireBrutNet()])])

	it('sert les chemins d’origine quand la langue est celle de l’arborescence', () => {
		expect(routeHrefs(routes(), false)).toEqual({
			'/simulateurs/salaire-brut-net': '/simulateurs/salaire-brut-net',
		})
	})

	it('sert les chemins traduits dans l’autre langue, toujours indexés par l’origine', () => {
		expect(routeHrefs(routes(), true)).toEqual({
			'/simulateurs/salaire-brut-net': '/calculators/salary',
		})
	})
})
