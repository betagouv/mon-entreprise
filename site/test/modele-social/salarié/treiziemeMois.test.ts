import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const situationAvecTreizièmeMois = {
	'salarié . contrat . salaire brut': '2000 €/mois',
	"salarié . rémunération . primes . fin d'année": 'oui',
}

describe('Prime de fin d’année ou de treizième mois', () => {
	let engine: Engine<RègleModèleSocial>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	const montantMensuel = () =>
		engine.evaluate({
			valeur: "salarié . rémunération . primes . fin d'année . montant",
			unité: '€/mois',
		}).nodeValue as number

	it('vaut un mois de salaire brut à temps plein', () => {
		engine.setSituation(situationAvecTreizièmeMois)

		expect(montantMensuel() * 12).toBeCloseTo(2000)
	})

	it('vaut un mois de salaire brut à temps partiel, sans appliquer une seconde fois la quotité', () => {
		engine.setSituation({
			...situationAvecTreizièmeMois,
			'salarié . contrat . temps de travail . temps partiel': 'oui',
			'salarié . contrat . temps de travail . temps partiel . heures par semaine':
				'28 heure/semaine',
		})

		expect(montantMensuel() * 12).toBeCloseTo(2000)
	})

	it('vaut un mois de salaire brut et de primes d’activité à temps partiel, sans appliquer une seconde fois la quotité', () => {
		engine.setSituation({
			...situationAvecTreizièmeMois,
			'salarié . contrat . temps de travail . temps partiel': 'oui',
			'salarié . contrat . temps de travail . temps partiel . heures par semaine':
				'28 heure/semaine',
			'salarié . rémunération . primes . activité . base': '200 €/mois',
		})

		expect(montantMensuel() * 12).toBeCloseTo(2200)
	})
})
