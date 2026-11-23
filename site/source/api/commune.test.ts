import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { searchCommunes, type ApiCommuneJson } from './commune'

const communes: Array<ApiCommuneJson> = [
	{
		_score: 1,
		code: '69123',
		codesPostaux: ['69003', '69001', '69002'],
		departement: { code: '69', nom: 'Rhône' },
		nom: 'Lyon',
	},
	{
		_score: 1,
		code: '97611',
		codesPostaux: ['97600'],
		departement: { code: '976', nom: 'Mayotte' },
		nom: 'Mamoudzou',
	},
	{
		_score: 1,
		code: '67482',
		codesPostaux: ['67000'],
		departement: { code: '67', nom: 'Bas-Rhin' },
		nom: 'Strasbourg',
	},
	{
		_score: 1,
		code: '97105',
		codesPostaux: ['97100'],
		departement: { code: '971', nom: 'Guadeloupe' },
		nom: 'Basse-Terre',
	},
]

describe('searchCommunes', () => {
	const fetchMock = vi.fn()

	beforeEach(() => {
		vi.stubGlobal('fetch', fetchMock)
		fetchMock.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(communes),
		})
	})

	afterEach(() => {
		vi.unstubAllGlobals()
		vi.resetAllMocks()
	})

	it('construit une URL de recherche à partir du nom de la commune', async () => {
		await searchCommunes('Lyon', 'autre')

		expect(fetchMock).toHaveBeenCalledWith(
			'https://geo.api.gouv.fr/communes?fields=nom,code,departement,codesPostaux&nom=Lyon&boost=population'
		)
	})

	it('construit une URL de recherche à partir du code postal', async () => {
		await searchCommunes('69001', 'autre')

		expect(fetchMock).toHaveBeenCalledWith(
			'https://geo.api.gouv.fr/communes?fields=nom,code,departement,codesPostaux&codePostal=69001&boost=population'
		)
	})

	it('retourne les communes avec leurs codes postaux triés', async () => {
		const result = await searchCommunes('Lyon', 'autre')

		expect(result).toEqual([
			{
				'code commune': '69123',
				nom: 'Lyon',
				'code postal': '69001',
				département: 'Rhône',
			},
			{
				'code commune': '69123',
				nom: 'Lyon',
				'code postal': '69002',
				département: 'Rhône',
			},
			{
				'code commune': '69123',
				nom: 'Lyon',
				'code postal': '69003',
				département: 'Rhône',
			},
		])
	})

	it('filtre les codes postaux selon le début de la saisie', async () => {
		const result = await searchCommunes('6900', 'autre')

		expect(result).toEqual([
			expect.objectContaining({ 'code postal': '69001' }),
			expect.objectContaining({ 'code postal': '69002' }),
			expect.objectContaining({ 'code postal': '69003' }),
		])
	})

	it.each([
		['mayotte', 'Mayotte'],
		['drom hors mayotte', 'Guadeloupe'],
		['alsace-moselle', 'Bas-Rhin'],
	] as const)(
		'ne retourne que les communes de la zone "%s"',
		async (zone, département) => {
			const result = await searchCommunes('', zone)

			expect(result).toEqual([expect.objectContaining({ département })])
		}
	)

	it('exclut les départements des zones spécifiques lorsque la zone est "autre"', async () => {
		const result = await searchCommunes('', 'autre')

		expect(result).toEqual([
			expect.objectContaining({ département: 'Rhône' }),
			expect.objectContaining({ département: 'Rhône' }),
			expect.objectContaining({ département: 'Rhône' }),
		])
	})

	it('retourne toutes les communes lorsqu’il n’y a pas de zone', async () => {
		const result = await searchCommunes('')

		expect(result).toEqual([
			expect.objectContaining({ département: 'Rhône' }),
			expect.objectContaining({ département: 'Rhône' }),
			expect.objectContaining({ département: 'Rhône' }),
			expect.objectContaining({ département: 'Mayotte' }),
			expect.objectContaining({ département: 'Bas-Rhin' }),
			expect.objectContaining({ département: 'Guadeloupe' }),
		])
	})
})
