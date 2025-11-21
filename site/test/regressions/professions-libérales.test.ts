import rules from 'modele-ti'
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
			'entreprise . activité . libérale . réglementée': 'oui',
		}
	)

	expect(
		getMissingVariables(
			engine
				.setSituation({
					...configProfessionLibérale.situation,
					'entreprise . activité . libérale . réglementée': 'oui',
				})
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
		  "indépendant . PL . CNAVPL . exonération incapacité",
		  "indépendant . PL . métier",
		  "indépendant . conjoint collaborateur",
		  "indépendant . cotisations et contributions . cotisations . exonérations . pension invalidité",
		  "indépendant . cotisations et contributions . cotisations . exonérations . âge",
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
