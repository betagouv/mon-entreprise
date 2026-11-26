import i18next from 'i18next'
import { describe, expect, it } from 'vitest'

import { createIsolatedI18n, setAppLanguage } from './i18n'

describe('setAppLanguage', () => {
	it('fait parler l’instance partagée dans la langue de l’application', () => {
		expect(setAppLanguage('en').language).toBe('en')
	})

	it('donne bien l’instance partagée, celle que lit le code hors React', () => {
		expect(setAppLanguage('fr')).toBe(i18next)
	})

	it('change de langue quand on la rappelle sur une instance déjà initialisée', () => {
		setAppLanguage('fr')

		expect(setAppLanguage('en').language).toBe('en')
	})

	it('rend les traductions lisibles dès le retour, sans attendre', () => {
		expect(setAppLanguage('en').t('heure', { ns: 'units' })).toBe('hour')
	})
})

describe('createIsolatedI18n', () => {
	it('donne une instance distincte de celle de l’application', () => {
		expect(createIsolatedI18n('en')).not.toBe(i18next)
	})

	it('laisse la langue de l’application intacte', () => {
		setAppLanguage('fr')
		createIsolatedI18n('en')

		expect(i18next.language).toBe('fr')
	})
})

describe('catalogue de traduction', () => {
	it('alimente les traductions quand l’instance s’initialise', () => {
		expect(
			createIsolatedI18n('en', { catalog: { maClé: 'Ma valeur' } }).t('maClé')
		).toBe('Ma valeur')
	})

	it('alimente les traductions même sur une instance déjà initialisée', () => {
		setAppLanguage('fr')

		expect(
			setAppLanguage('en', {
				catalog: { monAutreClé: 'Mon autre valeur' },
			}).t('monAutreClé')
		).toBe('Mon autre valeur')
	})
})
