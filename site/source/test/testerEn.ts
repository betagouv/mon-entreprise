import { afterEach, vi } from 'vitest'

/**
 * Fige l'année système pour les tests qui dépendent de la date du jour.
 * On ne falsifie que `Date` (pas `setTimeout`/`setInterval`) pour que `userEvent`
 * et les `findBy*` continuent de fonctionner avec de vrais timers.
 */
export const testerEn = (année: number): void => {
	vi.useFakeTimers({ toFake: ['Date'] })
	vi.setSystemTime(new Date(année, 5, 15))
}

afterEach(() => {
	vi.useRealTimers()
})
