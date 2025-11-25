import rules from 'modele-ti'
import { expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { configIndépendant } from '@/pages/simulateurs/indépendant/simulationConfig'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import independentSituations from './indépendant.yaml'
import { getMissingVariables, runSimulations } from './utils'

const engine = engineFactory(rules)

it('calculate simulations-indépendant', () => {
	const objectifs = [
		'indépendant . rémunération . totale',
		'indépendant . cotisations et contributions . cotisations',
		'indépendant . rémunération . nette',
		'indépendant . revenu professionnel',
		'impôt . montant',
		'indépendant . rémunération . nette . après impôt',
		'entreprise . charges',
		"entreprise . chiffre d'affaires",
		'indépendant . cotisations et contributions . début activité',
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
				.evaluate('indépendant . rémunération . nette')
		)
	).toMatchInlineSnapshot(`
		[
		  "entreprise . activité",
		  "entreprise . activité . commerciale . débit de tabac",
		  "entreprise . activité . saisonnière",
		  "entreprise . charges",
		  "entreprise . date de création",
		  "entreprise . imposition . régime",
		  "entreprise . imposition . régime . micro-entreprise",
		  "impôt . foyer fiscal . autres revenus imposables",
		  "impôt . foyer fiscal . enfants à charge",
		  "impôt . foyer fiscal . situation de famille",
		  "impôt . méthode de calcul",
		  "indépendant . IJSS",
		  "indépendant . conjoint collaborateur",
		  "indépendant . cotisations et contributions . cotisations . exonérations . pension invalidité",
		  "indépendant . cotisations facultatives",
		  "indépendant . revenus étrangers",
		  "paramètres . impôt . revenu imposable",
		  "situation personnelle . RSA",
		  "situation personnelle . domiciliation fiscale à l'étranger",
		  "établissement . commune . département",
		  "établissement . commune . département . outre-mer",
		]
	`)
})
