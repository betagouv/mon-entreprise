import { afterEach, describe, expect, it, vi } from 'vitest'

const moduleNeuf = async () => {
	vi.resetModules()

	return import('./applicationLanguage')
}

describe('applicationLanguage', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('donne la langue que l’application a déclarée', async () => {
		const { declareLanguage, applicationLanguage } = await moduleNeuf()

		declareLanguage('en')

		expect(applicationLanguage()).toBe('en')
	})

	it('suit la dernière langue déclarée', async () => {
		const { declareLanguage, applicationLanguage } = await moduleNeuf()

		declareLanguage('en')
		declareLanguage('fr')

		expect(applicationLanguage()).toBe('fr')
	})

	it('retombe sur le français quand aucune langue n’a été déclarée', async () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {})
		const { applicationLanguage } = await moduleNeuf()

		expect(applicationLanguage()).toBe('fr')
	})

	it('avertit au lieu de laisser croire que le français était voulu', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const { applicationLanguage } = await moduleNeuf()

		applicationLanguage()

		expect(warn).toHaveBeenCalled()
	})

	it('n’avertit qu’une fois', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const { applicationLanguage } = await moduleNeuf()

		applicationLanguage()
		applicationLanguage()

		expect(warn).toHaveBeenCalledTimes(1)
	})
})
