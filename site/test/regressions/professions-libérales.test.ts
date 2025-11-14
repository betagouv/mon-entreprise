import rules from 'modele-social'
import { expect, it } from 'vitest'

import { configProfessionLibérale } from '@/pages/simulateurs/profession-libérale/simulationConfig'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import professionsLibéralesSituations from './professions-libérales.yaml'
import { getMissingVariables, runSimulations } from './utils'

const engine = engineFactory(rules)

it('calculate simulations-professions-libérales', () => {
	runSimulations(
		engine,
		professionsLibéralesSituations,
		[
			...(configProfessionLibérale['objectifs exclusifs'] ?? []),
			...(configProfessionLibérale.objectifs ?? []),
		],
		{
			...configProfessionLibérale.situation,
			'entreprise . activité . nature . libérale . réglementée': 'oui',
		}
	)

	expect(
		getMissingVariables(
			engine
				.setSituation({
					...configProfessionLibérale.situation,
					'entreprise . activité . nature . libérale . réglementée': 'oui',
				})
				.evaluate('dirigeant . rémunération . net')
		)
	).toMatchInlineSnapshot(`
		[
		  "dirigeant . indépendant . IJSS",
		  "dirigeant . indépendant . PL . CNAVPL . exonération incapacité",
		  "dirigeant . indépendant . PL . métier",
		  "dirigeant . indépendant . conjoint collaborateur",
		  "dirigeant . indépendant . cotisations et contributions . exonérations . pension invalidité",
		  "dirigeant . indépendant . cotisations et contributions . exonérations . âge",
		  "dirigeant . indépendant . cotisations facultatives",
		  "dirigeant . indépendant . revenus étrangers",
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
