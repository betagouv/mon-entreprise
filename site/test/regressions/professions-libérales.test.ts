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
		  "entreprise . activité . saisonnière",
		  "entreprise . charges",
		  "entreprise . chiffre d'affaires",
		  "entreprise . date de création",
		  "entreprise . imposition . régime",
		  "entreprise . imposition . régime . micro-entreprise",
		  "indépendant . IJSS",
		  "indépendant . conjoint collaborateur",
		  "indépendant . cotisations et contributions",
		  "indépendant . cotisations et contributions . cotisations . exonérations . pension invalidité",
		  "indépendant . cotisations et contributions . cotisations . exonérations . âge",
		  "indépendant . cotisations facultatives",
		  "indépendant . profession libérale . CNAVPL . exonération incapacité",
		  "indépendant . profession libérale . réglementée . métier",
		  "indépendant . revenus étrangers",
		  "indépendant . rémunération . impôt",
		  "indépendant . rémunération . nette",
		  "indépendant . rémunération . nette . après impôt",
		  "situation personnelle . RSA",
		  "situation personnelle . domiciliation fiscale à l'étranger",
		  "établissement . commune . département",
		  "établissement . commune . département . outre-mer",
		]
	`)
})
