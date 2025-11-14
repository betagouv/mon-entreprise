import rules from 'modele-social'
import { expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { configIndépendant } from '@/pages/simulateurs/indépendant/simulationConfig'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import independentSituations from './indépendant.yaml'
import { getMissingVariables, runSimulations } from './utils'

const engine = engineFactory(rules)

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
	runSimulations(
		engine,
		independentSituations,
		objectifs,
		configIndépendant.situation
	)

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
		  "entreprise . activité . nature",
		  "entreprise . activités",
		  "entreprise . activités . commerciale",
		  "entreprise . activités . saisonnière",
		  "entreprise . charges",
		  "entreprise . date de création",
		  "entreprise . imposition . régime",
		  "entreprise . imposition . régime . micro-entreprise",
		  "impôt . foyer fiscal . enfants à charge",
		  "impôt . foyer fiscal . revenu imposable . autres revenus imposables",
		  "impôt . foyer fiscal . situation de famille",
		  "impôt . méthode de calcul",
		  "situation personnelle . RSA",
		  "situation personnelle . domiciliation fiscale à l'étranger",
		  "établissement . commune . département",
		  "établissement . commune . département . outre-mer",
		]
	`)
})
