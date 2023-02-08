import { DottedName } from 'modele-social'
import { expect, it } from 'vitest'

import { configIndépendant } from '@/pages/Simulateurs/indépendant/_simulationConfig'

import independentSituations from './simulations-indépendant.yaml'
import { engine, getMissingVariables, runSimulations } from './utils'

it('calculate simulations-indépendant', () => {
	const objectifs = [
		'dirigeant . rémunération . totale',
		'dirigeant . rémunération . cotisations',
		'dirigeant . rémunération . net',
		'dirigeant . indépendant . revenu professionnel',
		'impôt . montant',
		'dirigeant . rémunération . net . après impôt',
		'entreprise . charges',
		"entreprise . chiffre d'affaires",
		'dirigeant . indépendant . cotisations et contributions . début activité',
	] as DottedName[]
	runSimulations(independentSituations, objectifs, configIndépendant.situation)

	expect(
		getMissingVariables(
			engine
				.setSituation(configIndépendant.situation)
				.evaluate('dirigeant . rémunération . net')
		)
	).toMatchInlineSnapshot(`
		[
		  "dirigeant . indépendant . IJSS",
		  "dirigeant . indépendant . conjoint collaborateur",
		  "dirigeant . indépendant . cotisations et contributions . exonérations . pension invalidité",
		  "dirigeant . indépendant . cotisations facultatives",
		  "dirigeant . indépendant . revenus étrangers",
		  "dirigeant . rémunération . net",
		  "entreprise . activité . nature",
		  "entreprise . activités",
		  "entreprise . activités . commerciale",
		  "entreprise . charges",
		  "entreprise . chiffre d'affaires",
		  "entreprise . date de création",
		  "entreprise . imposition . régime",
		  "entreprise . imposition . régime . micro-entreprise",
		  "impôt . foyer fiscal . enfants à charge",
		  "impôt . foyer fiscal . revenu imposable . autres revenus imposables",
		  "impôt . foyer fiscal . situation de famille",
		  "impôt . méthode de calcul",
		  "situation personnelle . RSA",
		  "situation personnelle . domiciliation fiscale à l'étranger",
		]
	`)
})
