import rules from 'modele-ti'
import { expect, it } from 'vitest'

import { configProfessionLibérale } from '@/pages/simulateurs/profession-liberale/simulationConfig'
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
				.evaluate('independant . rémunération . nette')
		)
	).toMatchInlineSnapshot(`
		[
		  "entreprise . activité . saisonnière",
		  "entreprise . charges",
		  "entreprise . chiffre d'affaires",
		  "entreprise . date de création",
		  "entreprise . imposition . IR . régime micro-fiscal",
		  "independant . conjoint collaborateur",
		  "independant . cotisations et contributions",
		  "independant . cotisations et contributions . cotisations . exonérations . invalidité",
		  "independant . cotisations et contributions . cotisations . exonérations . âge",
		  "independant . cotisations et contributions . cotisations facultatives",
		  "independant . profession libérale . CNAVPL . exonération incapacité",
		  "independant . profession libérale . réglementée . métier",
		  "independant . revenus de remplacement",
		  "independant . revenus étrangers",
		  "independant . rémunération . impôt",
		  "independant . rémunération . nette",
		  "independant . rémunération . nette . après impôt",
		  "situation personnelle . RSA",
		  "situation personnelle . domiciliation fiscale à l'étranger",
		  "établissement . commune . département",
		  "établissement . commune . département . outre-mer",
		]
	`)
})
