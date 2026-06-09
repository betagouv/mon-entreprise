import { describe, expect, it } from 'vitest'

import {
	getTrackingChapters,
	TrackingChapters,
} from './TrackingChaptersContext'

describe('getTrackingChapters', () => {
	it('ne modifie aucun chapître si aucun ne change', () => {
		const currentChapters = {
			chapter1: 'simulateurs',
			chapter2: 'A',
			chapter3: 'B',
		} satisfies TrackingChapters
		const newChapters = {} satisfies TrackingChapters

		const chapters = getTrackingChapters(currentChapters, newChapters)

		expect(chapters).toEqual({
			chapter1: 'simulateurs',
			chapter2: 'A',
			chapter3: 'B',
		})
	})

	it('remplace tous les chapîtres si tous les chapîtres changent', () => {
		const currentChapters = {
			chapter1: 'simulateurs',
			chapter2: 'A',
			chapter3: 'B',
		} satisfies TrackingChapters
		const newChapters = {
			chapter1: 'assistants',
			chapter2: 'X',
			chapter3: 'Y',
		} satisfies TrackingChapters

		const chapters = getTrackingChapters(currentChapters, newChapters)

		expect(chapters).toEqual({
			chapter1: 'assistants',
			chapter2: 'X',
			chapter3: 'Y',
		})
	})

	it('réinitialise les chapîtres 2 et 3 si le 1er chapître change', () => {
		const currentChapters = {
			chapter1: 'simulateurs',
			chapter2: 'A',
			chapter3: 'B',
		} satisfies TrackingChapters
		const newChapters = {
			chapter1: 'assistants',
		} satisfies TrackingChapters

		const chapters = getTrackingChapters(currentChapters, newChapters)

		expect(chapters).toEqual({
			chapter1: 'assistants',
			chapter2: '',
			chapter3: '',
		})
	})

	it('réinitialise le chapître 3 si les 1er et 2ème chapîtres changent', () => {
		const currentChapters = {
			chapter1: 'simulateurs',
			chapter2: 'A',
			chapter3: 'B',
		} satisfies TrackingChapters
		const newChapters = {
			chapter1: 'assistants',
			chapter2: 'X',
		} satisfies TrackingChapters

		const chapters = getTrackingChapters(currentChapters, newChapters)

		expect(chapters).toEqual({
			chapter1: 'assistants',
			chapter2: 'X',
			chapter3: '',
		})
	})

	// Est-ce une situation que l'on veut autoriser ?
	it('réinitialise le chapître 2 si les 1er et 3ème chapîtres changent', () => {
		const currentChapters = {
			chapter1: 'simulateurs',
			chapter2: 'A',
			chapter3: 'B',
		} satisfies TrackingChapters
		const newChapters = {
			chapter1: 'assistants',
			chapter3: 'Y',
		} satisfies TrackingChapters

		const chapters = getTrackingChapters(currentChapters, newChapters)

		expect(chapters).toEqual({
			chapter1: 'assistants',
			chapter2: '',
			chapter3: 'Y',
		})
	})

	it('conserve le chapître 1 et réinitialise le chapître 3 si le 2ème chapître change', () => {
		const currentChapters = {
			chapter1: 'simulateurs',
			chapter2: 'A',
			chapter3: 'B',
		} satisfies TrackingChapters
		const newChapters = {
			chapter2: 'X',
		} satisfies TrackingChapters

		const chapters = getTrackingChapters(currentChapters, newChapters)

		expect(chapters).toEqual({
			chapter1: 'simulateurs',
			chapter2: 'X',
			chapter3: '',
		})
	})

	it('conserve le chapître 1 et remplace les chapîtres 2 et 3 si les 2ème et 3ème chapîtres changent', () => {
		const currentChapters = {
			chapter1: 'simulateurs',
			chapter2: 'A',
			chapter3: 'B',
		} satisfies TrackingChapters
		const newChapters = {
			chapter2: 'X',
			chapter3: 'Y',
		} satisfies TrackingChapters

		const chapters = getTrackingChapters(currentChapters, newChapters)

		expect(chapters).toEqual({
			chapter1: 'simulateurs',
			chapter2: 'X',
			chapter3: 'Y',
		})
	})

	it('conserve les chapîtres 1 et 2 et remplace le chapître 3 si le 3ème chapître change', () => {
		const currentChapters = {
			chapter1: 'simulateurs',
			chapter2: 'A',
			chapter3: 'B',
		} satisfies TrackingChapters
		const newChapters = {
			chapter3: 'Y',
		} satisfies TrackingChapters

		const chapters = getTrackingChapters(currentChapters, newChapters)

		expect(chapters).toEqual({
			chapter1: 'simulateurs',
			chapter2: 'A',
			chapter3: 'Y',
		})
	})
})
